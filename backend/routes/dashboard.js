const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
    try {
        // Today's sales
        const [todaySales] = await db.query(`
            SELECT 
                IFNULL(SUM(amount_collected), 0) AS total,
                IFNULL(SUM(quantity), 0) AS books
            FROM sales
            WHERE sale_date = CURDATE()
        `);

        // Monthly sales
        const [monthlySales] = await db.query(`
            SELECT 
                IFNULL(SUM(amount_collected), 0) AS total,
                IFNULL(SUM(quantity), 0) AS books
            FROM sales
            WHERE MONTH(sale_date) = MONTH(CURDATE())
            AND YEAR(sale_date) = YEAR(CURDATE())
        `);

        // Total books on hand
        const [onHand] = await db.query(`
            SELECT IFNULL(SUM(stock_quantity), 0) AS total
            FROM books
        `);

        // Top selling book
        const [topSelling] = await db.query(`
            SELECT b.title, SUM(s.quantity) AS total_sold
            FROM sales s
            JOIN books b ON s.book_id = b.id
            WHERE MONTH(s.sale_date) = MONTH(CURDATE())
            AND YEAR(s.sale_date) = YEAR(CURDATE())
            GROUP BY b.id, b.title
            ORDER BY total_sold DESC
            LIMIT 1
        `);

        // Recent sales (last 10)
        const [recentSales] = await db.query(`
            SELECT 
                s.control_number,
                s.sale_date,
                s.student_name,
                s.course,
                s.section,
                b.title AS book_title,
                p.name AS professor_name,
                sem.label AS semester
            FROM sales s
            JOIN books b ON s.book_id = b.id
            JOIN professors p ON s.professor_id = p.id
            LEFT JOIN semesters sem ON s.semester_id = sem.id
            ORDER BY s.sale_date DESC, s.control_number DESC
            LIMIT 10
        `);

        // Sales by professor (current month)
        const [salesByProf] = await db.query(`
            SELECT 
                p.name AS professor_name,
                SUM(s.amount_collected) AS total_sales,
                SUM(s.quantity) AS books_sold
            FROM sales s
            JOIN professors p ON s.professor_id = p.id
            WHERE MONTH(s.sale_date) = MONTH(CURDATE())
            AND YEAR(s.sale_date) = YEAR(CURDATE())
            GROUP BY p.id, p.name
            ORDER BY total_sales DESC
        `);

        // Low stock books (below 10)
        const [lowStocks] = await db.query(`
            SELECT 
                b.title AS book_title,
                pub.name AS publisher_name,
                b.stock_quantity AS current_stock
            FROM books b
            JOIN publishers pub ON b.publisher_id = pub.id
            WHERE b.stock_quantity < 10
            ORDER BY b.stock_quantity ASC
        `);

        res.json({
            todaySales: todaySales[0],
            monthlySales: monthlySales[0],
            onHand: onHand[0].total,
            topSelling: topSelling[0]?.title || 'N/A',
            recentSales,
            salesByProf,
            lowStocks,
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;