const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Middleware: Allows the server to understand JSON data from the website
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serves your HTML/CSS files

// 2. Connect to Supabase using the URL in your .env file
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false } // Required for cloud databases
});

// 3. The "POST" Route: This is the endpoint that receives form data
app.post('/api/enquire', async (req, res) => {
    const { name, email, phone, projectInterest, budget, message } = req.body;

    try {
        const queryText = `
            INSERT INTO enquiries (name, email, phone, project_interest, budget_range, message)
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
        
        const values = [name, email, phone, projectInterest, budget, message];
        await pool.query(queryText, values);

        res.status(201).json({ success: true, message: "Enquiry received!" });
    } catch (err) {
        console.error("Database Error:", err);
        res.status(500).json({ success: false, error: "Database error" });
    }
});

// 4. Start the server
app.listen(PORT, () => {
    console.log(`GridStone Backend is running on http://localhost:${PORT}`);
});