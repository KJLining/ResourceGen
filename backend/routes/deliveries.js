const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all deliveries with items
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                bd.id, bd.delivery_date, bd.reference_no, bd.notes,
                p.name AS publisher_name,
                b.title AS book_title,
                bdi.quantity, bdi.wholesale_price,
                bdi.id AS item_id, bdi.book_id
            FROM book_deliveries bd
            JOIN publishers p ON bd.publisher_id = p.id
            LEFT JOIN book_delivery_items bdi ON bdi.delivery_id = bd.id
            LEFT JOIN books b ON bdi.book_id = b.id
            ORDER BY bd.delivery_date DESC, bd.id DESC
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST record delivery
router.post('/', async (req, res) => {
    const conn = await db.getConnection();
    try {
        const { publisher_id, delivery_date, reference_no,
                book_id, quantity, wholesale_price, notes } = req.body;

        if (!publisher_id)   return res.status(400).json({ error: 'Publisher is required' });
        if (!delivery_date)  return res.status(400).json({ error: 'Delivery date is required' });
        if (!book_id)        return res.status(400).json({ error: 'Book is required' });
        if (!quantity || quantity < 1) return res.status(400).json({ error: 'Quantity must be at least 1' });
        if (!wholesale_price) return res.status(400).json({ error: 'Wholesale price is required' });

        await conn.beginTransaction();

        const [deliveryResult] = await conn.query(`
            INSERT INTO book_deliveries (publisher_id, delivery_date, reference_no, notes)
            VALUES (?, ?, ?, ?)
        `, [publisher_id, delivery_date, reference_no || null, notes || null]);

        const deliveryId = deliveryResult.insertId;

        await conn.query(`
            INSERT INTO book_delivery_items (delivery_id, book_id, quantity, wholesale_price)
            VALUES (?, ?, ?, ?)
        `, [deliveryId, book_id, quantity, wholesale_price]);

        await conn.commit();
        res.status(201).json({ id: deliveryId });
    } catch (err) {
        await conn.rollback();
        res.status(500).json({ error: err.message });
    } finally {
        conn.release();
    }
});

// DELETE delivery (and its items)
router.delete('/:id', async (req, res) => {
    const conn = await db.getConnection();
    try {
        const [items] = await conn.query(
            `SELECT book_id, quantity FROM book_delivery_items WHERE delivery_id = ?`,
            [req.params.id]
        );

        await conn.beginTransaction();

        for (const item of items) {
            await conn.query(
                `UPDATE books SET stock_quantity = stock_quantity - ? WHERE id = ?`,
                [item.quantity, item.book_id]
            );
        }

        await conn.query(`DELETE FROM book_delivery_items WHERE delivery_id = ?`, [req.params.id]);
        await conn.query(`DELETE FROM book_deliveries WHERE id = ?`, [req.params.id]);

        await conn.commit();
        res.json({ message: 'Delivery deleted' });
    } catch (err) {
        await conn.rollback();
        res.status(500).json({ error: err.message });
    } finally {
        conn.release();
    }
});

module.exports = router;