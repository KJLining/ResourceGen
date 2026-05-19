const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
const booksRouter = require('./routes/books');
app.use('/api/books', booksRouter);

// Bookselling routes
const dashboardRouter = require('./routes/dashboard');
app.use('/api/dashboard', dashboardRouter);

const professorsRouter = require('./routes/professors');
app.use('/api/professors', professorsRouter);

const publishersRouter = require('./routes/publishers');
app.use('/api/publishers', publishersRouter);

const deliveriesRouter = require('./routes/deliveries');
app.use('/api/deliveries', deliveriesRouter);

const salesRouter = require('./routes/sales');
app.use('/api/sales', salesRouter);

const reportsRouter = require('./routes/reports');
app.use('/api/reports', reportsRouter);

const remittancesRouter = require('./routes/remittances');
app.use('/api/remittances', remittancesRouter);

// Test route
app.get('/', (req, res) => {
    res.json({ message: 'ResourceGen API is running!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});