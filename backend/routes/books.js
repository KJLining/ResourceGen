const express = require('express');
const router  = express.Router();
const db      = require('../db');

// GET all books
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT b.id, b.title, b.isbn, b.stock_quantity,
                   p.name AS publisher_name,
                   br.selling_price, br.wholesale_price,
                   br.professor_commission, br.school_commission
            FROM books b
            JOIN publishers p ON b.publisher_id = p.id
            LEFT JOIN book_rates br ON br.book_id = b.id
                AND br.effective_date = (
                    SELECT MAX(effective_date)
                    FROM book_rates
                    WHERE book_id = b.id
                    AND effective_date <= CURDATE()
                )
            ORDER BY b.title ASC
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET single book by ID
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT b.id, b.title, b.isbn, b.stock_quantity,
                   p.name AS publisher_name,
                   br.selling_price, br.wholesale_price,
                   br.professor_commission, br.school_commission
            FROM books b
            JOIN publishers p ON b.publisher_id = p.id
            LEFT JOIN book_rates br ON br.book_id = b.id
                AND br.effective_date = (
                    SELECT MAX(effective_date)
                    FROM book_rates
                    WHERE book_id = b.id
                    AND effective_date <= CURDATE()
                )
            WHERE b.id = ?
        `, [req.params.id]);

        if (rows.length === 0)
            return res.status(404).json({ error: 'Book not found' });

        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;