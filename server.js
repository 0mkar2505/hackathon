const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) {
        console.error("Database connection failed: " + err.stack);
        return;
    }
    console.log("Connected to MySQL database");
});

app.post("/donate", (req, res) => {
    const { name, email, amount } = req.body;
    if (!name || !email || !amount) {
        return res.status(400).json({ error: "All fields are required" });
    }
    const sql = "INSERT INTO donations (name, email, amount) VALUES (?, ?, ?)";
    db.query(sql, [name, email, amount], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: "Donation received!" });
    });
});

app.get("/donations", (req, res) => {
    const sql = "SELECT * FROM donations";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const ADMIN_USER = "admin";
const ADMIN_PASS = "password"; // CAN BE CHANGED


function authenticateAdmin(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || authHeader !== "Bearer admin-token") {
        return res.status(403).json({ error: "Unauthorized access" });
    }
    next();
}


app.post("/admin/login", (req, res) => {
    const { username, password } = req.body;
    if (username === ADMIN_USER && password === ADMIN_PASS) {
        res.json({ message: "Login successful", token: "admin-token" });
    } else {
        res.status(401).json({ error: "Invalid credentials" });
    }
});

app.get("/admin/donations", authenticateAdmin, (req, res) => {
    const sql = "SELECT * FROM donations";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});


app.delete("/admin/donations/:id", authenticateAdmin, (req, res) => {
    const sql = "DELETE FROM donations WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Donation record deleted successfully!" });
    });
});

