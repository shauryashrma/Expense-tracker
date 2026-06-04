const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const validateExpense = require('../middleware/validateExpense');

const dbPath = path.join(__dirname, '..', 'data', 'expenses.json');

// Helper to read expenses from file
function readExpenses() {
  try {
    if (!fs.existsSync(dbPath)) {
      return [];
    }
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading expenses database:', error);
    return [];
  }
}

// Helper to write expenses to file
function writeExpenses(expenses) {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(expenses, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing expenses database:', error);
    return false;
  }
}

// GET /api/expenses - Fetch expenses with optional filtering
router.get('/', (req, res) => {
  try {
    let expenses = readExpenses();

    const { category, startDate, endDate } = req.query;

    // Filter by category
    if (category && category !== 'All') {
      expenses = expenses.filter(exp => exp.category === category);
    }

    // Filter by startDate (inclusive)
    if (startDate) {
      expenses = expenses.filter(exp => exp.date >= startDate);
    }

    // Filter by endDate (inclusive)
    if (endDate) {
      expenses = expenses.filter(exp => exp.date <= endDate);
    }

    // Sort: Date descending (newest first). If same date, sort by createdAt descending.
    expenses.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      if (dateB - dateA !== 0) {
        return dateB - dateA;
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    res.status(200).json({
      success: true,
      data: expenses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve expenses'
    });
  }
});

// POST /api/expenses - Add new expense
router.post('/', validateExpense, (req, res) => {
  try {
    const { amount, category, date, note } = req.body;
    const expenses = readExpenses();

    const newExpense = {
      id: uuidv4(),
      amount: parseFloat(amount),
      category,
      date,
      note: note || '',
      createdAt: new Date().toISOString()
    };

    expenses.push(newExpense);
    writeExpenses(expenses);

    res.status(201).json({
      success: true,
      data: newExpense
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to add expense'
    });
  }
});

// PUT /api/expenses/:id - Edit existing expense
router.put('/:id', validateExpense, (req, res) => {
  try {
    const { id } = req.params;
    const { amount, category, date, note } = req.body;
    const expenses = readExpenses();

    const expenseIndex = expenses.findIndex(exp => exp.id === id);
    if (expenseIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Expense not found'
      });
    }

    const originalExpense = expenses[expenseIndex];

    // Merge original details with updated details
    const updatedExpense = {
      ...originalExpense,
      amount: amount !== undefined ? parseFloat(amount) : originalExpense.amount,
      category: category !== undefined ? category : originalExpense.category,
      date: date !== undefined ? date : originalExpense.date,
      note: note !== undefined ? note : originalExpense.note
    };

    expenses[expenseIndex] = updatedExpense;
    writeExpenses(expenses);

    res.status(200).json({
      success: true,
      data: updatedExpense
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update expense'
    });
  }
});

// DELETE /api/expenses/:id - Delete an expense
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const expenses = readExpenses();

    const expenseIndex = expenses.findIndex(exp => exp.id === id);
    if (expenseIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Expense not found'
      });
    }

    expenses.splice(expenseIndex, 1);
    writeExpenses(expenses);

    res.status(200).json({
      success: true,
      data: { id }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete expense'
    });
  }
});

module.exports = router;
