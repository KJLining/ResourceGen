const express = require('express');
const router = express.Router();
const db = require('../db');


// GET all printing requests
router.get('/', async (req, res) => {
    try {

        const search = req.query.search
            ? `%${req.query.search}%`
            : '%';

        const [rows] = await db.query(`
            SELECT *
            FROM printing_services
            WHERE
                control_no LIKE ?
                OR course LIKE ?
                OR document_type LIKE ?
                OR title LIKE ?
                OR members LIKE ?
            ORDER BY created_at DESC
        `, [search, search, search, search, search]);

        res.json(rows);

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});


// GET single request
router.get('/:id', async (req, res) => {
    try {

        const [rows] = await db.query(`
            SELECT *
            FROM printing_services
            WHERE id = ?
        `, [req.params.id]);

        if (rows.length === 0) {
            return res.status(404).json({
                error: 'Request not found'
            });
        }

        res.json(rows[0]);

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});


// CREATE request
router.post('/', async (req, res) => {
    try {

        const {
            control_no,
            course,
            document_type,
            title,
            members,
            date_received,
            hardbound_qty,
            softbound_qty,
            total_amount,
            remarks
        } = req.body;

        const [result] = await db.query(`
            INSERT INTO printing_services (
                control_no,
                course,
                document_type,
                title,
                members,
                date_received,
                hardbound_qty,
                softbound_qty,
                total_amount,
                status,
                remarks
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            control_no,
            course,
            document_type,
            title,
            members,
            date_received,
            hardbound_qty || 0,
            softbound_qty || 0,
            total_amount || 0,
            "Received",
            remarks || null
        ]);

        res.status(201).json({
            message: 'Printing request created',
            id: result.insertId
        });

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});


// UPDATE request
router.put('/:id', async (req, res) => {
    try {

        const {
            course,
            document_type,
            title,
            members,
            date_received,
            hardbound_qty,
            softbound_qty,
            total_amount,
            status,
            remarks
        } = req.body;

        await db.query(`
            UPDATE printing_services
            SET
                course = ?,
                document_type = ?,
                title = ?,
                members = ?,
                date_received = ?,
                hardbound_qty = ?,
                softbound_qty = ?,
                total_amount = ?,
                status = ?,
                remarks = ?
            WHERE id = ?
        `, [
            course,
            document_type,
            title,
            members,
            date_received,
            hardbound_qty,
            softbound_qty,
            total_amount,
            status,
            remarks,
            req.params.id
        ]);

        res.json({
            message: 'Request updated'
        });

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});


// UPDATE status only
router.patch('/:id/status', async (req, res) => {
    try {

        const { status } = req.body;

        await db.query(`
            UPDATE printing_services
            SET status = ?
            WHERE id = ?
        `, [status, req.params.id]);

        res.json({
            message: 'Status updated'
        });

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});


// DELETE request
router.delete('/:id', async (req, res) => {
    try {

        await db.query(`
            DELETE FROM printing_services
            WHERE id = ?
        `, [req.params.id]);

        res.json({
            message: 'Request deleted'
        });

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

module.exports = router;