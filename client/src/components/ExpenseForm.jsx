import React, { useState, useEffect, useMemo } from 'react';
import { PlusCircle, Edit3, XCircle } from 'lucide-react';
import {
  CATEGORIES,
  getLocalDateString,
  validateExpenseForm,
  fieldErrorFromServerMessage,
} from '../utils/validateExpense';

export default function ExpenseForm({ editingExpense, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    date: '',
    note: ''
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const maxDate = useMemo(() => getLocalDateString(), []);

  // Sync with editingExpense prop
  useEffect(() => {
    if (editingExpense) {
      setFormData({
        amount: editingExpense.amount,
        category: editingExpense.category,
        date: editingExpense.date,
        note: editingExpense.note || ''
      });
      setFieldErrors({});
    } else {
      // Default to empty form
      setFormData({
        amount: '',
        category: '',
        date: '',
        note: ''
      });
      setFieldErrors({});
    }
  }, [editingExpense]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear field error on edit
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validate = () => {
    const { valid, errors } = validateExpenseForm(formData);
    setFieldErrors(errors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    const payload = {
      ...formData,
      category: formData.category.trim(),
      note: formData.note.trim(),
    };
    const result = await onSubmit(payload);
    setSubmitting(false);

    if (result.success) {
      setFormData({
        amount: '',
        category: '',
        date: '',
        note: '',
      });
      setFieldErrors({});
    } else if (result.error) {
      const serverFieldErrors = fieldErrorFromServerMessage(result.error);
      if (serverFieldErrors) {
        setFieldErrors((prev) => ({ ...prev, ...serverFieldErrors }));
      }
    }
  };

  return (
    <div className="bg-slate-800/80 backdrop-blur-md p-6 rounded-2xl border border-slate-700/60 shadow-xl">
      <div className="flex items-center space-x-2 mb-6">
        {editingExpense ? (
          <Edit3 className="h-5 w-5 text-amber-400" />
        ) : (
          <PlusCircle className="h-5 w-5 text-indigo-400" />
        )}
        <h2 className="text-lg font-bold text-slate-200">
          {editingExpense ? 'Edit Expense' : 'Add Expense'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Amount Field */}
        <div>
          <label htmlFor="amount-input" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Amount (INR)
          </label>
          <input
            id="amount-input"
            type="number"
            name="amount"
            step="0.01"
            min="0.01"
            required
            placeholder="0.00"
            value={formData.amount}
            onChange={handleChange}
            className={`w-full bg-slate-900 border ${
              fieldErrors.amount ? 'border-rose-500 focus:ring-rose-500/50' : 'border-slate-700 focus:ring-indigo-500/50'
            } rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:border-indigo-500 transition-all`}
          />
          {fieldErrors.amount && (
            <p className="text-xs text-rose-400 mt-1.5 font-medium">{fieldErrors.amount}</p>
          )}
        </div>

        {/* Category Field */}
        <div>
          <label htmlFor="category-input" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Category
          </label>
          <select
            id="category-input"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className={`w-full bg-slate-900 border ${
              fieldErrors.category ? 'border-rose-500 focus:ring-rose-500/50' : 'border-slate-700 focus:ring-indigo-500/50'
            } rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:border-indigo-500 transition-all`}
          >
            <option value="" disabled>Select Category</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {fieldErrors.category && (
            <p className="text-xs text-rose-400 mt-1.5 font-medium">{fieldErrors.category}</p>
          )}
        </div>

        {/* Date Field */}
        <div>
          <label htmlFor="date-input" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Date
          </label>
          <input
            id="date-input"
            type="date"
            name="date"
            max={maxDate}
            required
            value={formData.date}
            onChange={handleChange}
            className={`w-full bg-slate-900 border ${
              fieldErrors.date ? 'border-rose-500 focus:ring-rose-500/50' : 'border-slate-700 focus:ring-indigo-500/50'
            } rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:border-indigo-500 transition-all`}
          />
          {fieldErrors.date && (
            <p className="text-xs text-rose-400 mt-1.5 font-medium">{fieldErrors.date}</p>
          )}
        </div>

        {/* Note Field */}
        <div>
          <label htmlFor="note-input" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Note (Optional)
          </label>
          <textarea
            id="note-input"
            name="note"
            rows="2"
            placeholder="Add details (e.g. Lunch at office)"
            value={formData.note}
            onChange={handleChange}
            className={`w-full bg-slate-900 border ${
              fieldErrors.note ? 'border-rose-500 focus:ring-rose-500/50' : 'border-slate-700 focus:ring-indigo-500/50'
            } rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:border-indigo-500 transition-all resize-none`}
          />
          <div className="flex justify-between mt-1">
            {fieldErrors.note ? (
              <p className="text-xs text-rose-400 font-medium">{fieldErrors.note}</p>
            ) : (
              <span />
            )}
            <span className="text-[10px] text-slate-500 font-medium self-end">
              {formData.note ? formData.note.length : 0}/200
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-2">
          {editingExpense ? (
            <>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-amber-600 hover:bg-amber-500 disabled:bg-amber-800 text-slate-900 font-semibold px-4 py-2.5 rounded-xl text-sm flex items-center justify-center space-x-2 transition-all active:scale-95 duration-150 shadow-lg shadow-amber-600/20"
              >
                <span>Update</span>
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="bg-slate-700 hover:bg-slate-650 text-slate-200 border border-slate-650 font-semibold px-4 py-2.5 rounded-xl text-sm flex items-center justify-center space-x-2 transition-all active:scale-95 duration-150"
              >
                <XCircle className="h-4 w-4" />
                <span>Cancel</span>
              </button>
            </>
          ) : (
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white font-semibold px-4 py-2.5 rounded-xl text-sm flex items-center justify-center space-x-2 transition-all active:scale-95 duration-150 shadow-lg shadow-indigo-600/30"
            >
              <span>Add Expense</span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
