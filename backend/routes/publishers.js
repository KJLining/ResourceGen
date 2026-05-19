const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all publishers with book count
router.get('/', async (req, res) => {
    try {
        const search = req.query.search ? `%${req.query.search}%` : '%';
        const [rows] = await db.query(`
            SELECT p.id, p.name, p.contact_person, p.phone, p.email, p.address,
                   COUNT(b.id) AS book_count
            FROM publishers p
            LEFT JOIN books b ON b.publisher_id = p.id
            WHERE p.name LIKE ? OR p.contact_person LIKE ?
            GROUP BY p.id
            ORDER BY p.name ASC
        `, [search, search]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET single publisher with books + remittance data
router.get('/:id', async (req, res) => {
    try {
        const [pub] = await db.query(`
            SELECT id, name, contact_person, phone, email, address
            FROM publishers WHERE id = ?
        `, [req.params.id]);

        if (pub.length === 0)
            return res.status(404).json({ error: 'Publisher not found' });

        const [books] = await db.query(`
            SELECT
                b.id, b.title, b.stock_quantity,
                br.selling_price, br.wholesale_price,
                IFNULL(SUM(s.quantity), 0) AS copies_sold,
                IFNULL(SUM(CASE WHEN pr.status = 'unpaid' THEN pr.remittance_amount ELSE 0 END), 0) AS unpaid_remittance,
                IFNULL(SUM(CASE WHEN pr.status = 'paid' THEN pr.remittance_amount ELSE 0 END), 0) AS paid_remittance
            FROM books b
            LEFT JOIN book_rates br ON br.book_id = b.id
                AND br.effective_date = (
                    SELECT MAX(effective_date) FROM book_rates
                    WHERE book_id = b.id AND effective_date <= CURDATE()
                )
            LEFT JOIN sales s ON s.book_id = b.id
            LEFT JOIN publisher_remittances pr ON pr.sale_id = s.id
            WHERE b.publisher_id = ?
            GROUP BY b.id, b.title, b.stock_quantity, br.selling_price, br.wholesale_price
        `, [req.params.id]);

        res.json({ ...pub[0], books });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST add publisher
router.post('/', async (req, res) => {
    try {
        const { name, contact_person, phone, email, address } = req.body;
        if (!name) return res.status(400).json({ error: 'Publisher name is required' });

        const [result] = await db.query(`
            INSERT INTO publishers (name, contact_person, phone, email, address)
            VALUES (?, ?, ?, ?, ?)
        `, [name, contact_person || null, phone || null, email || null, address || null]);

        res.status(201).json({ id: result.insertId, name, contact_person, phone, email, address });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT update publisher
router.put('/:id', async (req, res) => {
    try {
        const { name, contact_person, phone, email, address } = req.body;
        if (!name) return res.status(400).json({ error: 'Publisher name is required' });

        await db.query(`
            UPDATE publishers
            SET name = ?, contact_person = ?, phone = ?, email = ?, address = ?
            WHERE id = ?
        `, [name, contact_person || null, phone || null, email || null, address || null, req.params.id]);

        res.json({ id: req.params.id, name, contact_person, phone, email, address });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE publisher
router.delete('/:id', async (req, res) => {
    try {
        await db.query(`DELETE FROM publishers WHERE id = ?`, [req.params.id]);
        res.json({ message: 'Publisher deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;