import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../utils/formatters';
import { PieChart as PieIcon, AlertTriangle } from 'lucide-react';
import { CATEGORIES } from '../utils/validateExpense';
import { getBudgetStatus } from '../utils/budgets';

// Modern premium color palette for chart categories
const COLORS = {
  Food: '#6366f1',          // Indigo
  Transport: '#38bdf8',     // Sky Blue
  Bills: '#f43f5e',         // Rose
  Entertainment: '#fbbf24', // Amber
  Other: '#34d399'          // Emerald
};

// Custom tooltip renderer for a premium styled popup
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900 border border-slate-750 px-3 py-2 rounded-xl shadow-xl text-xs">
        <p className="font-bold text-slate-200">{data.name}</p>
        <p className="text-indigo-400 font-semibold mt-0.5">{formatCurrency(data.value)}</p>
      </div>
    );
  }
  return null;
};

export default function CategoryChart({ filteredExpenses, budgets = {} }) {
  const categoryTotals = useMemo(() => {
    const totals = CATEGORIES.map((cat) => {
      const value = filteredExpenses
        .filter((exp) => exp.category === cat)
        .reduce((sum, exp) => sum + exp.amount, 0);
      const status = getBudgetStatus(value, budgets[cat]);
      return { name: cat, value, overBudget: status.hasBudget && status.overBudget };
    });
    return totals.filter((entry) => entry.value > 0);
  }, [filteredExpenses, budgets]);

  const hasData = categoryTotals.length > 0;
  const overBudgetNames = categoryTotals.filter((e) => e.overBudget).map((e) => e.name);

  return (
    <div className="bg-slate-800/80 backdrop-blur-md p-5 rounded-2xl border border-slate-700/60 shadow-lg flex flex-col min-h-[300px] flex-1">
      <div className="flex items-center space-x-2 mb-4">
        <PieIcon className="h-5 w-5 text-indigo-400" />
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
          Category Share
        </h3>
      </div>

      {overBudgetNames.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {overBudgetNames.map((name) => (
            <span
              key={name}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-950/60 border border-rose-800/50 text-[10px] font-semibold text-rose-300"
            >
              <AlertTriangle className="h-3 w-3" />
              {name}
            </span>
          ))}
        </div>
      )}

      <div className="flex-1 flex items-center justify-center min-h-[220px]">
        {hasData ? (
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={categoryTotals}
                cx="50%"
                cy="45%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {categoryTotals.map((entry) => (
                  <Cell key={`cell-${entry.name}`} fill={COLORS[entry.name] || '#94a3b8'} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="bottom" 
                height={36} 
                iconSize={10} 
                iconType="circle"
                formatter={(value) => <span className="text-xs text-slate-400 font-medium">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex flex-col items-center text-center py-8">
            <span className="text-xs text-slate-500 italic">No expenses to display</span>
          </div>
        )}
      </div>
    </div>
  );
}
