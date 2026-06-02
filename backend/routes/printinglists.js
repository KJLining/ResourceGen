const express = require("express")
const router = express.Router()
const db = require("../db")

router.get("/office-list", async (req, res) => {

    try {

        const [rows] = await db.query(`
            SELECT *
            FROM printing_services
            WHERE status = 'Received'
            ORDER BY created_at ASC
        `)

        res.json(rows)

    } catch (err) {

        res.status(500).json({
            error: err.message
        })

    }

})

router.get("/pickup-list", async (req, res) => {

    try {

        const [rows] = await db.query(`
            SELECT *
            FROM printing_services
            WHERE status = 'Ready for Pickup'
            ORDER BY created_at ASC
        `)

        res.json(rows)

    } catch (err) {

        res.status(500).json({
            error: err.message
        })

    }

})

module.exports = router