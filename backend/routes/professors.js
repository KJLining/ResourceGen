const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all professors (with optional search)
router.get('/', async (req, res) => {
    try {
        const search = req.query.search ? `%${req.query.search}%` : '%';
        const [rows] = await db.query(`
            SELECT
                p.id,
                p.name,
                p.department,
                p.contact_number,
                COUNT(bp.id) AS books_prescribed_count
            FROM professors p
            LEFT JOIN book_prescriptions bp ON bp.professor_id = p.id
            WHERE p.name LIKE ? OR p.department LIKE ?
            GROUP BY p.id, p.name, p.department, p.contact_number
            ORDER BY p.name ASC
        `, [search, search]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET single professor with their prescribed books
router.get('/:id', async (req, res) => {
    try {
        const [prof] = await db.query(`
            SELECT id, name, department, contact_number
            FROM professors WHERE id = ?
        `, [req.params.id]);

        if (prof.length === 0)
            return res.status(404).json({ error: 'Professor not found' });

        const [books] = await db.query(`
            SELECT b.id, b.title
            FROM book_prescriptions bp
            JOIN books b ON bp.book_id = b.id
            WHERE bp.professor_id = ?
        `, [req.params.id]);

        res.json({ ...prof[0], books });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST add new professor
router.post('/', async (req, res) => {
    try {
        const { name, department, contact_number } = req.body;
        if (!name) return res.status(400).json({ error: 'Name is required' });

        const [result] = await db.query(`
            INSERT INTO professors (name, department, contact_number)
            VALUES (?, ?, ?)
        `, [name, department || null, contact_number || null]);

        res.status(201).json({ id: result.insertId, name, department, contact_number });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT update professor
router.put('/:id', async (req, res) => {
    try {
        const { name, department, contact_number } = req.body;
        if (!name) return res.status(400).json({ error: 'Name is required' });

        await db.query(`
            UPDATE professors
            SET name = ?, department = ?, contact_number = ?
            WHERE id = ?
        `, [name, department || null, contact_number || null, req.params.id]);

        res.json({ id: req.params.id, name, department, contact_number });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE professor
router.delete('/:id', async (req, res) => {
    try {
        await db.query(`DELETE FROM professors WHERE id = ?`, [req.params.id]);
        res.json({ message: 'Professor deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;