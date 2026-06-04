const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

// Body parser
app.use(express.json());

// Ensure data folder and expenses.json exist
const dataDir = path.join(__dirname, 'data');
const dbPath = path.join(dataDir, 'expenses.json');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, JSON.stringify([], null, 2), 'utf8');
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server running'
  });
});

// Expense Routes
const expenseRoutes = require('./routes/expenses');
app.use('/api/expenses', expenseRoutes);

// 404 Route handler for unmatched routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Not found'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'An internal server error occurred'
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
