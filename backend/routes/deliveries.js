const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all books with current rate and sales
router.get('/', async (req, res) => {
    try {
        const search = req.query.search ? `%${req.query.search}%` : '%';
        const [rows] = await db.query(`
            SELECT b.id, b.title, b.isbn, b.stock_quantity, b.publisher_id,
                   p.name AS publisher_name,
                   br.selling_price, br.wholesale_price,
                   br.professor_commission, br.school_commission,
                   IFNULL(SUM(s.quantity), 0) AS total_sold
            FROM books b
            JOIN publishers p ON b.publisher_id = p.id
            LEFT JOIN book_rates br ON br.book_id = b.id
                AND br.effective_date = (
                    SELECT MAX(effective_date) FROM book_rates
                    WHERE book_id = b.id AND effective_date <= CURDATE()
                )
            LEFT JOIN sales s ON s.book_id = b.id
            WHERE b.title LIKE ? OR p.name LIKE ?
            GROUP BY b.id, b.title, b.isbn, b.stock_quantity,
                     b.publisher_id, p.name, br.selling_price,
                     br.wholesale_price, br.professor_commission, br.school_commission
            ORDER BY b.title ASC
        `, [search, search]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET single book with rates and professors
router.get('/:id', async (req, res) => {
    try {
        const [book] = await db.query(`
            SELECT b.id, b.title, b.isbn, b.stock_quantity,
                   p.name AS publisher_name,
                   IFNULL(SUM(s.quantity), 0) AS total_sold
            FROM books b
            JOIN publishers p ON b.publisher_id = p.id
            LEFT JOIN sales s ON s.book_id = b.id
            WHERE b.id = ?
            GROUP BY b.id, b.title, b.isbn, b.stock_quantity, p.name
        `, [req.params.id]);

        if (book.length === 0)
            return res.status(404).json({ error: 'Book not found' });

        const [rates] = await db.query(`
            SELECT id, selling_price, wholesale_price,
                   professor_commission, school_commission, effective_date
            FROM book_rates WHERE book_id = ?
            ORDER BY effective_date DESC
        `, [req.params.id]);

        const [professors] = await db.query(`
            SELECT p.id, p.name, p.department
            FROM book_prescriptions bp
            JOIN professors p ON bp.professor_id = p.id
            WHERE bp.book_id = ?
        `, [req.params.id]);

        res.json({ ...book[0], rates, professors });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST add book
router.post('/', async (req, res) => {
    const conn = await db.getConnection();
    try {
        const { title, isbn, publisher_id, selling_price,
                wholesale_price, professor_commission,
                school_commission, professor_ids } = req.body;

        if (!title) return res.status(400).json({ error: 'Title is required' });
        if (!publisher_id) return res.status(400).json({ error: 'Publisher is required' });

        await conn.beginTransaction();

        const [result] = await conn.query(`
            INSERT INTO books (title, isbn, publisher_id)
            VALUES (?, ?, ?)
        `, [title, isbn || null, publisher_id]);

        const bookId = result.insertId;

        if (selling_price && wholesale_price) {
            await conn.query(`
                INSERT INTO book_rates
                (book_id, selling_price, wholesale_price, professor_commission, school_commission, effective_date)
                VALUES (?, ?, ?, ?, ?, CURDATE())
            `, [bookId, selling_price, wholesale_price,
                professor_commission || 0, school_commission || 0]);
        }

        if (professor_ids && professor_ids.length > 0) {
            const values = professor_ids.map(pid => [bookId, pid]);
            await conn.query(`
                INSERT INTO book_prescriptions (book_id, professor_id) VALUES ?
            `, [values]);
        }

        await conn.commit();
        res.status(201).json({ id: bookId, title });
    } catch (err) {
        await conn.rollback();
        res.status(500).json({ error: err.message });
    } finally {
        conn.release();
    }
});

// PUT update book
router.put('/:id', async (req, res) => {
    const conn = await db.getConnection();
    try {
        const { title, isbn, publisher_id, selling_price,
                wholesale_price, professor_commission,
                school_commission, professor_ids } = req.body;

        if (!title) return res.status(400).json({ error: 'Title is required' });

        await conn.beginTransaction();

        await conn.query(`
            UPDATE books SET title = ?, isbn = ?, publisher_id = ?
            WHERE id = ?
        `, [title, isbn || null, publisher_id, req.params.id]);

        if (selling_price && wholesale_price) {
            await conn.query(`
                INSERT INTO book_rates
                (book_id, selling_price, wholesale_price, professor_commission, school_commission, effective_date)
                VALUES (?, ?, ?, ?, ?, CURDATE())
            `, [req.params.id, selling_price, wholesale_price,
                professor_commission || 0, school_commission || 0]);
        }

        await conn.query(`DELETE FROM book_prescriptions WHERE book_id = ?`, [req.params.id]);
        if (professor_ids && professor_ids.length > 0) {
            const values = professor_ids.map(pid => [req.params.id, pid]);
            await conn.query(`INSERT INTO book_prescriptions (book_id, professor_id) VALUES ?`, [values]);
        }

        await conn.commit();
        res.json({ id: req.params.id, title });
    } catch (err) {
        await conn.rollback();
        res.status(500).json({ error: err.message });
    } finally {
        conn.release();
    }
});

// DELETE book
router.delete('/:id', async (req, res) => {
    try {
        await db.query(`DELETE FROM books WHERE id = ?`, [req.params.id]);
        res.json({ message: 'Book deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;