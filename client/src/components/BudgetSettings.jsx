import React, { useState } from 'react';
import { Wallet } from 'lucide-react';
import { CATEGORIES } from '../utils/validateExpense';
import { parseBudgetInput } from '../utils/budgets';

export default function BudgetSettings({ budgets, onBudgetChange }) {
  const [drafts, setDrafts] = useState({});

  const displayValue = (cat) => {
    if (drafts[cat] !== undefined) return drafts[cat];
    return budgets[cat] != null ? String(budgets[cat]) : '';
  };

  const handleChange = (cat, value) => {
    setDrafts((prev) => ({ ...prev, [cat]: value }));
  };

  const handleBlur = (cat) => {
    const raw = drafts[cat] !== undefined ? drafts[cat] : displayValue(cat);
    const parsed = parseBudgetInput(raw);
    onBudgetChange(cat, parsed);
    setDrafts((prev) => {
      const next = { ...prev };
      delete next[cat];
      return next;
    });
  };

  return (
    <div className="bg-slate-800/80 backdrop-blur-md p-5 rounded-2xl border border-slate-700/60 shadow-xl">
      <div className="flex items-center space-x-2 mb-4">
        <Wallet className="h-5 w-5 text-indigo-400" />
        <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
          Category Budgets
        </h2>
      </div>
      <p className="text-xs text-slate-500 mb-4">
        Set a monthly limit per category. Leave blank to skip tracking.
      </p>

      <div className="space-y-3">
        {CATEGORIES.map((cat) => (
          <div key={cat} className="flex items-center gap-3">
            <label
              htmlFor={`budget-${cat}`}
              className="text-xs font-medium text-slate-400 w-24 shrink-0"
            >
              {cat}
            </label>
            <input
              id={`budget-${cat}`}
              type="number"
              min="0"
              step="100"
              placeholder="No limit"
              value={displayValue(cat)}
              onChange={(e) => handleChange(cat, e.target.value)}
              onBlur={() => handleBlur(cat)}
              className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
