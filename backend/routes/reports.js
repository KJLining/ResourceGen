const express = require('express');
const router = express.Router();
const db = require('../db');

// Helper to build date filter
function getDateFilter(query) {
    const { type, date, month, year, semester, school_year } = query;

    if (type === 'daily') {
        return { where: 's.sale_date = ?', params: [date] };
    }

    if (type === 'monthly') {
        return {
            where: 'MONTH(s.sale_date) = ? AND YEAR(s.sale_date) = ?',
            params: [month, year]
        };
    }

    if (type === 'semester') {
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
            where: 's.sale_date BETWEEN ? AND ?',
            params: [startDate, endDate]
        };
    }

    return { where: '1=1', params: [] };
}

// GET sales report
router.get('/sales', async (req, res) => {
    try {
        const { where, params } = getDateFilter(req.query);
        const [rows] = await db.query(`
            SELECT s.control_number, s.sale_date, s.student_name,
                   s.student_number, s.course, s.section, s.quantity,
                   s.amount_collected,
                   p.name AS professor_name,
                   b.title AS book_title
            FROM sales s
            JOIN professors p ON s.professor_id = p.id
            JOIN books b ON s.book_id = b.id
            WHERE ${where}
            ORDER BY s.control_number ASC
        `, params);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET professor commissions report
router.get('/professors', async (req, res) => {
    try {
        const { where, params } = getDateFilter(req.query);
        const [rows] = await db.query(`
            SELECT
                p.name AS professor_name,
                GROUP_CONCAT(DISTINCT b.title ORDER BY b.title SEPARATOR ', ') AS books_prescribed,
                SUM(s.quantity) AS total_sold,
                SUM(pc.commission_amount) AS total_commission
            FROM professor_commissions pc
            JOIN sales s ON pc.sale_id = s.id
            JOIN professors p ON pc.professor_id = p.id
            JOIN books b ON s.book_id = b.id
            WHERE ${where}
            GROUP BY p.id, p.name
            ORDER BY total_commission DESC
        `, params);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET publisher remittances report
router.get('/publishers', async (req, res) => {
    try {
        const { where, params } = getDateFilter(req.query);
        const [rows] = await db.query(`
            SELECT
                pub.name AS publisher_name,
                GROUP_CONCAT(DISTINCT b.title ORDER BY b.title SEPARATOR ', ') AS books_supplied,
                SUM(s.quantity) AS total_sold,
                SUM(pr.remittance_amount) AS total_remittance
            FROM publisher_remittances pr
            JOIN sales s ON pr.sale_id = s.id
            JOIN publishers pub ON pr.publisher_id = pub.id
            JOIN books b ON s.book_id = b.id
            WHERE ${where}
            GROUP BY pub.id, pub.name
            ORDER BY total_remittance DESC
        `, params);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;