const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all semesters
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT * FROM semesters
            ORDER BY start_date DESC
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST add semester
router.post('/', async (req, res) => {
    try {
        const { label, semester, school_year, start_date, end_date } = req.body;
        if (!label) return res.status(400).json({ error: 'Label is required' });

        const [result] = await db.query(`
            INSERT INTO semesters (label, semester, school_year, start_date, end_date, is_active)
            VALUES (?, ?, ?, ?, ?, 0)
        `, [label, semester, school_year, start_date, end_date]);

        res.status(201).json({ id: result.insertId, label });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT update semester
router.put('/:id', async (req, res) => {
    try {
        const { label, semester, school_year, start_date, end_date } = req.body;
        await db.query(`
            UPDATE semesters
            SET label = ?, semester = ?, school_year = ?,
                start_date = ?, end_date = ?
            WHERE id = ?
        `, [label, semester, school_year, start_date, end_date, req.params.id]);
        res.json({ message: 'Semester updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT set active semester (deactivates all others first)
router.put('/:id/set-active', async (req, res) => {
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();
        await conn.query(`UPDATE semesters SET is_active = 0`);
        await conn.query(`UPDATE semesters SET is_active = 1 WHERE id = ?`, [req.params.id]);
        await conn.commit();
        res.json({ message: 'Active semester updated' });
    } catch (err) {
        await conn.rollback();
        res.status(500).json({ error: err.message });
    } finally {
        conn.release();
    }
});

// DELETE semester
router.delete('/:id', async (req, res) => {
    try {
        await db.query(`DELETE FROM semesters WHERE id = ?`, [req.params.id]);
        res.json({ message: 'Semester deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;