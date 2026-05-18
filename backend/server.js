const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
const booksRouter = require('./routes/books');
app.use('/api/books', booksRouter);

// Test route
app.get('/', (req, res) => {
    res.json({ message: 'ResourceGen API is running!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});