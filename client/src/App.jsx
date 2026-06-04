import React, { useState, useEffect } from 'react';
import { getExpenses, addExpense, updateExpense, deleteExpense } from './services/api';
import ExpenseForm from './components/ExpenseForm';
import FilterBar from './components/FilterBar';
import SummaryPanel from './components/SummaryPanel';
import CategoryChart from './components/CategoryChart';
import ExpenseTable from './components/ExpenseTable';
import BudgetSettings from './components/BudgetSettings';
import { loadBudgets, saveBudgets } from './utils/budgets';
import { CreditCard, RefreshCw } from 'lucide-react';

export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [filters, setFilters] = useState({
    category: 'All',
    dateRange: 'thisMonth', // 'thisMonth' | 'lastMonth' | 'custom'
    startDate: '',
    endDate: ''
  });
  const [editingExpense, setEditingExpense] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [budgets, setBudgets] = useState(() => loadBudgets());

  const handleBudgetChange = (category, value) => {
    setBudgets((prev) => {
      const next = { ...prev, [category]: value };
      saveBudgets(next);
      return next;
    });
  };

  // Fetch expenses from the backend
  const fetchExpenses = async () => {
    setLoading(true);
    setError(null);
    try {
      // We fetch all expenses from the backend and filter them in memory on the client side.
      // This matches the spec's recommendation of inline derived filtering and ensures
      // immediate visual updates on filter changes.
      const response = await getExpenses();
      if (response.data && response.data.success) {
        setExpenses(response.data.data);
      } else {
        setError(response.data.error || 'Failed to fetch expenses');
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Server error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // Handlers for Add, Edit, Delete
  const handleAddExpense = async (formData) => {
    setError(null);
    try {
      const response = await addExpense(formData);
      if (response.data && response.data.success) {
        await fetchExpenses();
        return { success: true };
      } else {
        setError(response.data.error || 'Failed to add expense');
        return { success: false, error: response.data.error };
      }
    } catch (err) {
      const errMsg = err.response?.data?.error || err.message || 'Server error';
      setError(errMsg);
      return { success: false, error: errMsg };
    }
  };

  const handleEditExpense = async (formData) => {
    if (!editingExpense) return { success: false };
    setError(null);
    try {
      const response = await updateExpense(editingExpense.id, formData);
      if (response.data && response.data.success) {
        setEditingExpense(null);
        await fetchExpenses();
        return { success: true };
      } else {
        setError(response.data.error || 'Failed to update expense');
        return { success: false, error: response.data.error };
      }
    } catch (err) {
      const errMsg = err.response?.data?.error || err.message || 'Server error';
      setError(errMsg);
      return { success: false, error: errMsg };
    }
  };

  const handleDeleteExpense = async (id) => {
    setError(null);
    try {
      const response = await deleteExpense(id);
      if (response.data && response.data.success) {
        await fetchExpenses();
      } else {
        setError(response.data.error || 'Failed to delete expense');
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Server error');
    }
  };

  // Derive filteredExpenses
  const filteredExpenses = expenses
    .filter((e) => {
      // 1. Category Filter
      if (filters.category !== 'All' && e.category !== filters.category) {
        return false;
      }

      // 2. Date Range Filter
      const expDate = new Date(e.date);
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth(); // 0-indexed

      if (filters.dateRange === 'thisMonth') {
        return (
          expDate.getFullYear() === currentYear &&
          expDate.getMonth() === currentMonth
        );
      }

      if (filters.dateRange === 'lastMonth') {
        let lastMonth = currentMonth - 1;
        let lastYear = currentYear;
        if (lastMonth < 0) {
          lastMonth = 11;
          lastYear = currentYear - 1;
        }
        return (
          expDate.getFullYear() === lastYear &&
          expDate.getMonth() === lastMonth
        );
      }

      if (filters.dateRange === 'custom') {
        const expDateStr = e.date; // YYYY-MM-DD
        const matchesStart = !filters.startDate || expDateStr >= filters.startDate;
        const matchesEnd = !filters.endDate || expDateStr <= filters.endDate;
        return matchesStart && matchesEnd;
      }

      return true;
    })
    .sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      if (dateB - dateA !== 0) {
        return dateB - dateA;
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <header className="mb-8 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-600 p-2.5 rounded-xl shadow-lg shadow-indigo-500/30">
            <CreditCard className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Mini Expense Tracker
            </h1>
            <p className="text-sm text-slate-400">
              Manage your spending and analyze your category breakdowns
            </p>
          </div>
        </div>
        <button
          onClick={fetchExpenses}
          disabled={loading}
          className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-4 py-2 rounded-xl text-sm font-semibold border border-slate-700 transition-all active:scale-95 duration-150"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </header>



      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Form & Filters */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <ExpenseForm
            editingExpense={editingExpense}
            onSubmit={editingExpense ? handleEditExpense : handleAddExpense}
            onCancel={() => setEditingExpense(null)}
          />
          <FilterBar filters={filters} onFilterChange={setFilters} />
          <BudgetSettings budgets={budgets} onBudgetChange={handleBudgetChange} />
          {error && (
            <div className="p-4 bg-rose-950/60 border border-rose-800/80 text-rose-200 rounded-xl text-sm flex items-start shadow-lg shadow-rose-950/10 transition-all duration-200">
              <span className="mr-2 font-bold">Error:</span>
              <span className="flex-1">{error}</span>
            </div>
          )}
        </div>

        {/* Right Column: Dashboard & Table */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Summary & Chart row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SummaryPanel filteredExpenses={filteredExpenses} budgets={budgets} />
            <CategoryChart filteredExpenses={filteredExpenses} budgets={budgets} />
          </div>

          {/* Table container */}
          <ExpenseTable
            filteredExpenses={filteredExpenses}
            onEdit={setEditingExpense}
            onDelete={handleDeleteExpense}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}
