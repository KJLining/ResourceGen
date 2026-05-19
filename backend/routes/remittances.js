const express = require('express');
const router = express.Router();
const db = require('../db');

function getDateFilter(query, alias = 's') {
    const { period, month, year, semester, school_year } = query;

    if (period === 'monthly') {
        return {
            where: `MONTH(${alias}.sale_date) = ? AND YEAR(${alias}.sale_date) = ?`,
            params: [month, year]
        };
    }

    if (period === 'semester') {
        const [startYear, endYear] = school_year.split('-');
        let startDate, endDate;
        if (semester === '1st') {
            startDate = `${startYear}-08-01`;
            endDate = `${endYear}-01-31`;
        } else if (semester === '2nd') {
            startDate = `${endYear}-02-01`;
            endDate = `${endYear}-07-31`;
        } else {
            startDate = `${endYear}-05-01`;
            endDate = `${endYear}-07-31`;
        }
        return {
            where: `${alias}.sale_date BETWEEN ? AND ?`,
            params: [startDate, endDate]
        };
    }

    return { where: '1=1', params: [] };
}

// GET professor commissions
router.get('/professors', async (req, res) => {
    try {
        const { where, params } = getDateFilter(req.query);
        const [rows] = await db.query(`
            SELECT pc.id, pc.sale_id, pc.commission_amount,
                   pc.status, pc.date_paid, pc.mode_of_payment, pc.notes,
                   p.name AS professor_name,
                   b.title AS book_title,
                   s.sale_date
            FROM professor_commissions pc
            JOIN sales s ON pc.sale_id = s.id
            JOIN professors p ON pc.professor_id = p.id
            JOIN books b ON s.book_id = b.id
            WHERE ${where}
            ORDER BY pc.status ASC, s.sale_date DESC
        `, params);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET publisher remittances
router.get('/publishers', async (req, res) => {
    try {
        const { where, params } = getDateFilter(req.query);
        const [rows] = await db.query(`
            SELECT pr.id, pr.sale_id, pr.remittance_amount,
                   pr.status, pr.date_paid, pr.mode_of_payment, pr.notes,
                   pub.name AS publisher_name,
                   b.title AS book_title,
                   s.sale_date
            FROM publisher_remittances pr
            JOIN sales s ON pr.sale_id = s.id
            JOIN publishers pub ON pr.publisher_id = pub.id
            JOIN books b ON s.book_id = b.id
            WHERE ${where}
            ORDER BY pr.status ASC, s.sale_date DESC
        `, params);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET school commissions
router.get('/school', async (req, res) => {
    try {
        const { where, params } = getDateFilter(req.query);
        const [rows] = await db.query(`
            SELECT sc.id, sc.sale_id, sc.commission_rate,
                   sc.commission_amount, sc.status,
                   b.title AS book_title,
                   s.sale_date
            FROM school_commissions sc
            JOIN sales s ON sc.sale_id = s.id
            JOIN books b ON s.book_id = b.id
            WHERE ${where}
            ORDER BY s.sale_date DESC
        `, params);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT mark professor commission as paid
router.put('/professors/:id', async (req, res) => {
    try {
        const { date_paid, mode_of_payment, notes } = req.body;
        await db.query(`
            UPDATE professor_commissions
            SET status = 'paid', date_paid = ?, mode_of_payment = ?, notes = ?
            WHERE id = ?
        `, [date_paid, mode_of_payment, notes || null, req.params.id]);
        res.json({ message: 'Marked as paid' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT mark publisher remittance as paid
router.put('/publishers/:id', async (req, res) => {
    try {
        const { date_paid, mode_of_payment, notes } = req.body;
        await db.query(`
            UPDATE publisher_remittances
            SET status = 'paid', date_paid = ?, mode_of_payment = ?, notes = ?
            WHERE id = ?
        `, [date_paid, mode_of_payment, notes || null, req.params.id]);
        res.json({ message: 'Marked as paid' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;