const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 5001;

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL Configuration
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Test Database Connection
pool.connect((err) => {
    if (err) {
        console.error('Database connection error:', err.stack);
    } else {
        console.log('Connected to PostgreSQL database');
    }
});

// GET /data - Fetch all items
app.get('/data', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM items'); // Adjust table name
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// POST /data - Add a new item
app.post('/data', async (req, res) => {
    try {
        const { name } = req.body; // Expecting a "name" field in the request body
        const result = await pool.query(
            'INSERT INTO items (name) VALUES ($1) RETURNING *',
            [name]
        ); // Adjust table and column names
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// PUT /data/:id - Update an item by ID
app.put('/data/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body; // Expecting a "name" field in the request body
        const result = await pool.query(
            'UPDATE items SET name = $1 WHERE id = $2 RETURNING *',
            [name, id]
        ); // Adjust table and column names
        if (result.rowCount === 0) {
            return res.status(404).send('Item not found');
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// DELETE /data/:id - Delete an item by ID
app.delete('/data/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM items WHERE id = $1 RETURNING *', [id]);
        if (result.rowCount === 0) {
            return res.status(404).send('Item not found');
        }
        res.status(200).send('Item deleted successfully');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
