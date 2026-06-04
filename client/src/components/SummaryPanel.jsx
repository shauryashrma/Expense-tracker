import React, { useMemo } from 'react';
import { formatCurrency } from '../utils/formatters';
import { IndianRupee, TrendingUp, BarChart3, AlertTriangle } from 'lucide-react';
import { CATEGORIES } from '../utils/validateExpense';
import { getBudgetStatus } from '../utils/budgets';

export default function SummaryPanel({ filteredExpenses, budgets = {} }) {
  const totalSpent = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  const highestExpense = filteredExpenses.reduce(
    (max, exp) => (exp.amount > max ? exp.amount : max),
    0
  );

  const categoryBreakdown = useMemo(
    () =>
      CATEGORIES.reduce((acc, cat) => {
        acc[cat] = filteredExpenses
          .filter((exp) => exp.category === cat)
          .reduce((sum, exp) => sum + exp.amount, 0);
        return acc;
      }, {}),
    [filteredExpenses]
  );

  const overBudgetCount = CATEGORIES.filter((cat) => {
    const status = getBudgetStatus(categoryBreakdown[cat], budgets[cat]);
    return status.hasBudget && status.overBudget;
  }).length;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-indigo-650 p-5 rounded-2xl border border-indigo-700/30 shadow-lg text-white relative overflow-hidden flex flex-col justify-between min-h-[110px]">
          <div className="absolute right-3 top-3 opacity-15">
            <IndianRupee className="h-14 w-14" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-200">
            Total Spent
          </span>
          <span className="text-2xl font-extrabold tracking-tight mt-1">
            {formatCurrency(totalSpent)}
          </span>
        </div>

        <div className="bg-slate-800/80 backdrop-blur-md p-5 rounded-2xl border border-slate-700/60 shadow-lg flex flex-col justify-between min-h-[110px] relative overflow-hidden">
          <div className="absolute right-3 top-3 opacity-5 text-rose-500">
            <TrendingUp className="h-14 w-14" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Highest Expense
          </span>
          <span className="text-2xl font-extrabold tracking-tight text-rose-400 mt-1">
            {formatCurrency(highestExpense)}
          </span>
        </div>
      </div>

      {overBudgetCount > 0 && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-rose-950/50 border border-rose-800/60 text-rose-200 text-xs font-medium">
          <AlertTriangle className="h-4 w-4 shrink-0 text-rose-400" />
          <span>
            {overBudgetCount} {overBudgetCount === 1 ? 'category is' : 'categories are'} over
            budget for the current view
          </span>
        </div>
      )}

      <div className="bg-slate-800/80 backdrop-blur-md p-5 rounded-2xl border border-slate-700/60 shadow-lg flex-1">
        <div className="flex items-center space-x-2 mb-4">
          <BarChart3 className="h-5 w-5 text-indigo-400" />
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
            Category Breakdown
          </h3>
        </div>

        <div className="space-y-4">
          {CATEGORIES.map((cat) => {
            const amount = categoryBreakdown[cat];
            const budget = budgets[cat];
            const status = getBudgetStatus(amount, budget);
            const sharePercent = totalSpent > 0 ? (amount / totalSpent) * 100 : 0;

            if (status.hasBudget) {
              const barWidth = Math.min(status.percent, 100);
              return (
                <div
                  key={cat}
                  className={`space-y-1.5 rounded-lg p-2 -mx-2 transition-colors ${
                    status.overBudget ? 'bg-rose-950/30' : ''
                  }`}
                >
                  <div className="flex justify-between items-center text-xs font-medium gap-2">
                    <span
                      className={`flex items-center gap-1.5 ${
                        status.overBudget ? 'text-rose-300' : 'text-slate-350'
                      }`}
                    >
                      {cat}
                      {status.overBudget && (
                        <AlertTriangle className="h-3.5 w-3.5 text-rose-400" aria-label="Over budget" />
                      )}
                    </span>
                    <span className="text-slate-200 font-semibold text-right">
                      {formatCurrency(amount)}
                      <span className="text-slate-500 font-normal">
                        {' '}
                        / {formatCurrency(budget)}
                      </span>
                    </span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        status.overBudget
                          ? 'bg-rose-500'
                          : status.percent >= 80
                            ? 'bg-amber-500'
                            : 'bg-indigo-500'
                      }`}
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                  <p
                    className={`text-[10px] font-medium ${
                      status.overBudget ? 'text-rose-400' : 'text-slate-500'
                    }`}
                  >
                    {status.overBudget
                      ? `${Math.round(status.percent)}% of budget · ${formatCurrency(status.overBy)} over`
                      : `${Math.round(status.percent)}% of budget · ${formatCurrency(status.remaining)} left`}
                  </p>
                </div>
              );
            }

            return (
              <div key={cat} className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-350">{cat}</span>
                  <span className="text-slate-200 font-semibold">{formatCurrency(amount)}</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-indigo-500 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${sharePercent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
