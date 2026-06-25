const express = require("express");
const router = express.Router();
const db = require("../db");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ─── FILE UPLOAD SETUP ───────────────────────────────────────────────────────

const uploadDir = path.join(__dirname, "../uploads/concessionaire_docs");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    cb(null, unique + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /pdf|jpg|jpeg|png|doc|docx|xls|xlsx/;
    const ext = path.extname(file.originalname).toLowerCase().replace(".", "");
    if (allowed.test(ext)) cb(null, true);
    else cb(new Error("File type not allowed"));
  },
});

// ─── DASHBOARD SUMMARY (must be before /:id routes) ──────────────────────────

router.get("/dashboard/summary", async (req, res) => {
  try {
    const [[totals]] = await db.query(`
      SELECT
        COUNT(*) AS total_concessionaires,
        SUM(status = 'Active') AS active_count,
        SUM(status = 'Inactive') AS inactive_count,
        SUM(contract_end < CURDATE() AND status = 'Active') AS expired_contracts
      FROM concessionaires
    `);
    const [[billing]] = await db.query(`
      SELECT
        COALESCE(SUM(total_amount), 0) AS total_billed,
        COALESCE(SUM(amount_paid), 0) AS total_collected,
        COALESCE(SUM(CASE WHEN payment_status != 'Paid' THEN total_amount - amount_paid END), 0) AS total_outstanding
      FROM concessionaire_bills
      WHERE year = YEAR(CURDATE()) AND month = MONTH(CURDATE())
    `);
    const [expiring] = await db.query(`
      SELECT id, name, business_name, contract_end,
        DATEDIFF(contract_end, CURDATE()) AS days_left
      FROM concessionaires
      WHERE contract_end BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 60 DAY)
        AND status = 'Active'
      ORDER BY contract_end ASC
    `);
    res.json({ ...totals, ...billing, expiring_soon: expiring });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── BILLS ALL (must be before /:id routes) ───────────────────────────────────

router.get("/bills/all", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT b.*, c.name, c.business_name, c.type
      FROM concessionaire_bills b
      JOIN concessionaires c ON c.id = b.concessionaire_id
      ORDER BY b.year DESC, b.month DESC, c.name ASC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── CONCESSIONAIRES CRUD ────────────────────────────────────────────────────

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT c.*,
        DATEDIFF(c.contract_end, CURDATE()) AS days_until_expiry,
        COUNT(DISTINCT b.id) AS bill_count,
        COALESCE(SUM(CASE WHEN b.payment_status != 'Paid' THEN b.total_amount - b.amount_paid END), 0) AS outstanding_balance
      FROM concessionaires c
      LEFT JOIN concessionaire_bills b ON b.concessionaire_id = c.id
      GROUP BY c.id
      ORDER BY c.name ASC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT c.*, DATEDIFF(c.contract_end, CURDATE()) AS days_until_expiry
       FROM concessionaires c WHERE c.id = ?`,
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: "Not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  const { name, business_name, type, unit_location, contact_no, email,
    contract_start, contract_end, base_rent, status, notes } = req.body;
  try {
    const [result] = await db.query(
      `INSERT INTO concessionaires
        (name, business_name, type, unit_location, contact_no, email,
         contract_start, contract_end, base_rent, status, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, business_name, type, unit_location, contact_no, email,
       contract_start, contract_end, base_rent, status || "Active", notes]
    );
    res.status(201).json({ id: result.insertId, message: "Concessionaire created" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  const { name, business_name, type, unit_location, contact_no, email,
    contract_start, contract_end, base_rent, status, notes } = req.body;
  try {
    await db.query(
      `UPDATE concessionaires SET
        name=?, business_name=?, type=?, unit_location=?, contact_no=?, email=?,
        contract_start=?, contract_end=?, base_rent=?, status=?, notes=?
       WHERE id=?`,
      [name, business_name, type, unit_location, contact_no, email,
       contract_start, contract_end, base_rent, status, notes, req.params.id]
    );
    res.json({ message: "Updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM concessionaires WHERE id = ?", [req.params.id]);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── BILLS ──────────────────────────────────────────────────────────────────

router.get("/:id/bills", async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT * FROM concessionaire_bills
       WHERE concessionaire_id = ?
       ORDER BY year DESC, month DESC`,
      [req.params.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/:id/bills", async (req, res) => {
  const { year, month, rent_amount, electricity_amount, water_amount,
    other_fees, other_fees_label, payment_status, amount_paid, due_date, paid_date, notes } = req.body;
  try {
    const [result] = await db.query(
      `INSERT INTO concessionaire_bills
        (concessionaire_id, year, month, rent_amount, electricity_amount,
         water_amount, other_fees, other_fees_label, payment_status,
         amount_paid, due_date, paid_date, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [req.params.id, year, month, rent_amount || 0, electricity_amount || 0,
       water_amount || 0, other_fees || 0, other_fees_label,
       payment_status || "Unpaid", amount_paid || 0, due_date || null, paid_date || null, notes]
    );
    res.status(201).json({ id: result.insertId, message: "Bill created" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/bills/:billId", async (req, res) => {
  const { rent_amount, electricity_amount, water_amount, other_fees, other_fees_label,
    payment_status, amount_paid, due_date, paid_date, notes } = req.body;
  try {
    await db.query(
      `UPDATE concessionaire_bills SET
        rent_amount=?, electricity_amount=?, water_amount=?, other_fees=?,
        other_fees_label=?, payment_status=?, amount_paid=?, due_date=?, paid_date=?, notes=?
       WHERE id=?`,
      [rent_amount, electricity_amount, water_amount, other_fees, other_fees_label,
       payment_status, amount_paid, due_date || null, paid_date || null, notes, req.params.billId]
    );
    res.json({ message: "Bill updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/bills/:billId", async (req, res) => {
  try {
    await db.query("DELETE FROM concessionaire_bills WHERE id = ?", [req.params.billId]);
    res.json({ message: "Bill deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── DOCUMENTS ──────────────────────────────────────────────────────────────

router.get("/:id/documents", async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT * FROM concessionaire_documents
       WHERE concessionaire_id = ?
       ORDER BY document_date DESC`,
      [req.params.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/:id/documents", upload.single("file"), async (req, res) => {
  const { document_type, title, description, document_date, expiry_date, remarks } = req.body;
  const file_name = req.file ? req.file.originalname : null;
  const file_path = req.file ? `/uploads/concessionaire_docs/${req.file.filename}` : null;
  try {
    const [result] = await db.query(
      `INSERT INTO concessionaire_documents
        (concessionaire_id, document_type, title, description,
         file_path, file_name, document_date, expiry_date, remarks)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [req.params.id, document_type, title, description,
       file_path, file_name, document_date || null, expiry_date || null, remarks]
    );
    res.status(201).json({ id: result.insertId, message: "Document added" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/documents/:docId", upload.single("file"), async (req, res) => {
  const { document_type, title, description, document_date, expiry_date, remarks } = req.body;
  try {
    if (req.file) {
      const [rows] = await db.query(
        "SELECT file_path FROM concessionaire_documents WHERE id = ?",
        [req.params.docId]
      );
      if (rows[0]?.file_path) {
        const oldPath = path.join(__dirname, "..", rows[0].file_path);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      const file_name = req.file.originalname;
      const file_path = `/uploads/concessionaire_docs/${req.file.filename}`;
      await db.query(
        `UPDATE concessionaire_documents SET
          document_type=?, title=?, description=?, file_path=?, file_name=?,
          document_date=?, expiry_date=?, remarks=?
         WHERE id=?`,
        [document_type, title, description, file_path, file_name,
         document_date || null, expiry_date || null, remarks, req.params.docId]
      );
    } else {
      await db.query(
        `UPDATE concessionaire_documents SET
          document_type=?, title=?, description=?,
          document_date=?, expiry_date=?, remarks=?
         WHERE id=?`,
        [document_type, title, description,
         document_date || null, expiry_date || null, remarks, req.params.docId]
      );
    }
    res.json({ message: "Document updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/documents/:docId", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT file_path FROM concessionaire_documents WHERE id = ?",
      [req.params.docId]
    );
    if (rows[0]?.file_path) {
      const filePath = path.join(__dirname, "..", rows[0].file_path);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    await db.query("DELETE FROM concessionaire_documents WHERE id = ?", [req.params.docId]);
    res.json({ message: "Document deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;