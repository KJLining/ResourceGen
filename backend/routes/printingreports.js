const express = require("express")
const router = express.Router()
const db = require("../db")

router.get("/", async (req, res) => {
    try {
        const { date_from, date_to } = req.query

        // Build optional date range condition
        let dateCondition = ""
        const dateParams = []

        if (date_from && date_to) {
            dateCondition = "WHERE DATE(created_at) BETWEEN ? AND ?"
            dateParams.push(date_from, date_to)
        } else if (date_from) {
            dateCondition = "WHERE DATE(created_at) >= ?"
            dateParams.push(date_from)
        } else if (date_to) {
            dateCondition = "WHERE DATE(created_at) <= ?"
            dateParams.push(date_to)
        }

        // 1. Overall summary with all statuses
        const [[summary]] = await db.query(`
            SELECT
                COUNT(*) AS total_requests,
                COALESCE(SUM(total_amount), 0) AS total_revenue,
                SUM(CASE WHEN status = 'Received'         THEN 1 ELSE 0 END) AS received,
                SUM(CASE WHEN status = 'For Binding'      THEN 1 ELSE 0 END) AS for_binding,
                SUM(CASE WHEN status = 'Ready for Pickup' THEN 1 ELSE 0 END) AS ready_for_pickup,
                SUM(CASE WHEN status = 'Claimed'          THEN 1 ELSE 0 END) AS claimed,
                SUM(CASE WHEN status = 'Cancelled'        THEN 1 ELSE 0 END) AS cancelled
            FROM printing_services
            ${dateCondition}
        `, dateParams)

        // 2. Requests per course with revenue
        const [courses] = await db.query(`
            SELECT
                course,
                COUNT(*) AS total,
                SUM(CASE WHEN status = 'Claimed'   THEN 1 ELSE 0 END) AS claimed,
                SUM(CASE WHEN status = 'Cancelled' THEN 1 ELSE 0 END) AS cancelled,
                COALESCE(SUM(total_amount), 0) AS revenue
            FROM printing_services
            ${dateCondition}
            GROUP BY course
            ORDER BY total DESC
        `, dateParams)

        // 3. Requests per document type
        const [types] = await db.query(`
            SELECT
                document_type,
                COUNT(*) AS total,
                SUM(CASE WHEN status = 'Claimed' THEN 1 ELSE 0 END) AS claimed,
                COALESCE(SUM(total_amount), 0) AS revenue
            FROM printing_services
            ${dateCondition}
            GROUP BY document_type
            ORDER BY total DESC
        `, dateParams)

        // 4. Binding totals
        const [[bindings]] = await db.query(`
            SELECT
                COALESCE(SUM(hardbound_qty), 0) AS hardbound_total,
                COALESCE(SUM(softbound_qty), 0) AS softbound_total
            FROM printing_services
            ${dateCondition}
        `, dateParams)

        // 5. Monthly trend (last 6 months or within date range)
        const monthlyCondition = dateCondition
            ? dateCondition + " AND DATE(created_at) >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)"
            : "WHERE DATE(created_at) >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)"

        const [monthly] = await db.query(`
            SELECT
                DATE_FORMAT(created_at, '%Y-%m') AS month,
                DATE_FORMAT(created_at, '%b %Y')  AS month_label,
                COUNT(*) AS total,
                SUM(CASE WHEN status = 'Claimed' THEN 1 ELSE 0 END) AS claimed,
                COALESCE(SUM(total_amount), 0) AS revenue
            FROM printing_services
            ${monthlyCondition}
            GROUP BY month, month_label
            ORDER BY month ASC
        `, dateParams)

        res.json({ summary, courses, types, bindings, monthly })

    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

module.exports = router