const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all sales
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT s.id, s.control_number, s.sale_date,
                   s.student_name, s.student_number,
                   s.course, s.section, s.quantity,
                   s.amount_collected, s.professor_id, s.book_id,
                   p.name AS professor_name,
                   b.title AS book_title
            FROM sales s
            JOIN professors p ON s.professor_id = p.id
            JOIN books b ON s.book_id = b.id
            ORDER BY s.control_number DESC
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET books prescribed by a professor (for dropdown)
router.get('/books-by-prof/:profId', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT b.id, b.title,
                   br.selling_price, br.wholesale_price,
                   br.professor_commission, br.school_commission
            FROM book_prescriptions bp
            JOIN books b ON bp.book_id = b.id
            LEFT JOIN book_rates br ON br.book_id = b.id
                AND br.effective_date = (
                    SELECT MAX(effective_date) FROM book_rates
                    WHERE book_id = b.id AND effective_date <= CURDATE()
                )
            WHERE bp.professor_id = ?
            ORDER BY b.title ASC
        `, [req.params.profId]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST record a sale
router.post('/', async (req, res) => {
    const conn = await db.getConnection();
    try {
        const { student_name, student_number, course, section,
                sale_date, professor_id, book_id, quantity } = req.body;

        if (!student_name) return res.status(400).json({ error: 'Student name is required' });
        if (!professor_id) return res.status(400).json({ error: 'Professor is required' });
        if (!book_id) return res.status(400).json({ error: 'Book is required' });

        await conn.beginTransaction();

        // Get current rate for this book
        const [rates] = await conn.query(`
            SELECT * FROM book_rates
            WHERE book_id = ? AND effective_date <= ?
            ORDER BY effective_date DESC LIMIT 1
        `, [book_id, sale_date || new Date().toISOString().split('T')[0]]);

        if (rates.length === 0) {
            await conn.rollback();
            return res.status(400).json({ error: 'No rate found for this book. Please set a rate in inventory first.' });
        }

        const rate = rates[0];
        const qty = quantity || 1;
        const amount = rate.selling_price * qty;
        const schoolComm = (rate.school_commission / 100) * rate.selling_price * qty;
        const pubRemit = rate.wholesale_price * qty;

        // Get active semester
        const [semesters] = await conn.query(`
            SELECT id FROM semesters
            WHERE ? BETWEEN start_date AND end_date
            LIMIT 1
        `, [sale_date || new Date().toISOString().split('T')[0]]);

        const semesterId = semesters.length > 0 ? semesters[0].id : null;

        // Insert sale
        const [saleResult] = await conn.query(`
            INSERT INTO sales (
                semester_id, sale_date, student_name, student_number,
                course, section, professor_id, book_id, book_rate_id,
                quantity, selling_price, wholesale_price,
                professor_commission, school_commission_rate,
                amount_collected, school_commission_amount,
                publisher_remittance_amount
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [semesterId, sale_date, student_name, student_number,
            course, section, professor_id, book_id, rate.id,
            qty, rate.selling_price, rate.wholesale_price,
            rate.professor_commission, rate.school_commission,
            amount, schoolComm, pubRemit]);

        const saleId = saleResult.insertId;

        // Generate professor commissions for ALL professors who prescribed this book
        const [prescribedProfs] = await conn.query(`
            SELECT professor_id FROM book_prescriptions WHERE book_id = ?
        `, [book_id]);

        for (const prof of prescribedProfs) {
            await conn.query(`
                INSERT INTO professor_commissions
                (sale_id, professor_id, commission_amount, status)
                VALUES (?, ?, ?, 'unpaid')
            `, [saleId, prof.professor_id, rate.professor_commission * qty]);
        }

        // Generate school commission
        await conn.query(`
            INSERT INTO school_commissions
            (sale_id, commission_rate, commission_amount, status)
            VALUES (?, ?, ?, 'collected')
        `, [saleId, rate.school_commission, schoolComm]);

        // Generate publisher remittance
        const [bookInfo] = await conn.query(`SELECT publisher_id FROM books WHERE id = ?`, [book_id]);
        await conn.query(`
            INSERT INTO publisher_remittances
            (sale_id, publisher_id, remittance_amount, status)
            VALUES (?, ?, ?, 'unpaid')
        `, [saleId, bookInfo[0].publisher_id, pubRemit]);

        await conn.commit();
        res.status(201).json({ id: saleId, control_number: saleId });
    } catch (err) {
        await conn.rollback();
        res.status(500).json({ error: err.message });
    } finally {
        conn.release();
    }
});

// PUT update sale (student details only — not book/prof to protect commission integrity)
router.put('/:id', async (req, res) => {
    try {
        const { student_name, student_number, course, section, sale_date } = req.body;
        await db.query(`
            UPDATE sales
            SET student_name = ?, student_number = ?, course = ?, section = ?, sale_date = ?
            WHERE id = ?
        `, [student_name, student_number, course, section, sale_date, req.params.id]);
        res.json({ message: 'Sale updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE sale
router.delete('/:id', async (req, res) => {
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();
        await conn.query(`DELETE FROM professor_commissions WHERE sale_id = ?`, [req.params.id]);
        await conn.query(`DELETE FROM school_commissions WHERE sale_id = ?`, [req.params.id]);
        await conn.query(`DELETE FROM publisher_remittances WHERE sale_id = ?`, [req.params.id]);
        await conn.query(`DELETE FROM sales WHERE id = ?`, [req.params.id]);
        await conn.commit();
        res.json({ message: 'Sale removed' });
    } catch (err) {
        await conn.rollback();
        res.status(500).json({ error: err.message });
    } finally {
        conn.release();
    }
});

module.exports = router;