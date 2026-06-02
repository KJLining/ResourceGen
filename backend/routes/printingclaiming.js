const express = require("express")
const router = express.Router()
const db = require("../db")

// GET all Ready for Pickup items, grouped by course
// Supports filtering by name (members), course, and document_type
router.get("/", async (req, res) => {
    try {
        const { course, document_type, search } = req.query

        let conditions = [`status = 'Ready for Pickup'`]
        const params = []

        if (course) {
            conditions.push(`course = ?`)
            params.push(course)
        }

        if (document_type) {
            conditions.push(`document_type = ?`)
            params.push(document_type)
        }

        if (search) {
            conditions.push(`(members LIKE ? OR title LIKE ? OR control_no LIKE ?)`)
            const s = `%${search}%`
            params.push(s, s, s)
        }

        const where = conditions.join(" AND ")

        const [rows] = await db.query(
            `SELECT * FROM printing_services WHERE ${where} ORDER BY course ASC, created_at ASC`,
            params
        )

        // Group by course
        const grouped = {}
        for (const row of rows) {
            if (!grouped[row.course]) grouped[row.course] = []
            grouped[row.course].push(row)
        }

        res.json({ rows, grouped })

    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// PATCH - Mark as Claimed
router.patch("/:id/claim", async (req, res) => {
    try {
        const { claimed_by, release_notes } = req.body

        if (!claimed_by || !claimed_by.trim()) {
            return res.status(400).json({ error: "claimed_by is required" })
        }

        const [check] = await db.query(
            `SELECT id, status FROM printing_services WHERE id = ?`,
            [req.params.id]
        )

        if (check.length === 0) {
            return res.status(404).json({ error: "Request not found" })
        }

        if (check[0].status !== "Ready for Pickup") {
            return res.status(400).json({ error: "Request is not Ready for Pickup" })
        }

        await db.query(
            `UPDATE printing_services
             SET status = 'Claimed',
                 claimed_by = ?,
                 claim_date = NOW(),
                 release_notes = ?
             WHERE id = ?`,
            [claimed_by.trim(), release_notes || null, req.params.id]
        )

        res.json({ message: "Request marked as Claimed" })

    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// GET distinct courses and document types for filter dropdowns
router.get("/filters", async (req, res) => {
    try {
        const [courses] = await db.query(
            `SELECT DISTINCT course FROM printing_services WHERE status = 'Ready for Pickup' ORDER BY course ASC`
        )
        const [types] = await db.query(
            `SELECT DISTINCT document_type FROM printing_services WHERE status = 'Ready for Pickup' ORDER BY document_type ASC`
        )
        res.json({
            courses: courses.map(r => r.course),
            document_types: types.map(r => r.document_type),
        })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

module.exports = router