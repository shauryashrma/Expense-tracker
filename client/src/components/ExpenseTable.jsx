import React from 'react';
import { formatCurrency, formatDate } from '../utils/formatters';
import { exportToCsv } from '../utils/exportCsv';
import { Edit2, Trash2, Download, Inbox, Loader2 } from 'lucide-react';

export default function ExpenseTable({ filteredExpenses, onEdit, onDelete, loading }) {
  
  const handleConfirmDelete = (id, note) => {
    const message = note 
      ? `Are you sure you want to delete the expense: "${note}"?` 
      : 'Are you sure you want to delete this expense?';
    if (window.confirm(message)) {
      onDelete(id);
    }
  };

  const handleExport = () => {
    exportToCsv(filteredExpenses);
  };

  return (
    <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl border border-slate-700/60 shadow-xl overflow-hidden flex flex-col flex-1">
      {/* Table Header Controls */}
      <div className="p-5 border-b border-slate-700/60 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-200">Expense History</h2>
          <p className="text-xs text-slate-400">
            Showing {filteredExpenses.length} expense{filteredExpenses.length === 1 ? '' : 's'}
          </p>
        </div>
        <button
          onClick={handleExport}
          disabled={filteredExpenses.length === 0}
          className="flex items-center space-x-2 bg-indigo-650 hover:bg-indigo-600 disabled:bg-slate-800 disabled:text-slate-600 disabled:border-slate-700/60 text-slate-200 border border-indigo-700/30 px-4 py-2 rounded-xl text-sm font-semibold transition-all active:scale-95 duration-150 shadow-md"
        >
          <Download className="h-4 w-4" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Table Body */}
      <div className="overflow-x-auto relative flex-1 min-h-[300px]">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-800/40 backdrop-blur-[1px]">
            <div className="flex flex-col items-center space-y-2">
              <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
              <span className="text-sm text-slate-400">Loading expenses...</span>
            </div>
          </div>
        ) : null}

        {!loading && filteredExpenses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="bg-slate-900/60 p-4 rounded-full border border-slate-700/40 mb-4">
              <Inbox className="h-8 w-8 text-slate-500" />
            </div>
            <h3 className="text-slate-350 font-bold mb-1">No expenses found</h3>
            <p className="text-xs text-slate-500 max-w-xs">
              Try adjusting your filters or add a new expense log above.
            </p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-700/60 bg-slate-900/20 text-slate-400 text-xs uppercase font-semibold">
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Note</th>
                <th className="px-6 py-4 text-right">Amount</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/40 text-sm">
              {filteredExpenses.map((exp) => (
                <tr 
                  key={exp.id} 
                  className="hover:bg-slate-750/30 transition-colors group"
                >
                  <td className="px-6 py-4 font-medium text-slate-300 whitespace-nowrap">
                    {formatDate(exp.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-700/50 text-slate-300 border border-slate-650/40">
                      {exp.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-405 max-w-[200px] truncate" title={exp.note}>
                    {exp.note || <span className="text-slate-600 italic">No note</span>}
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-slate-200 whitespace-nowrap">
                    {formatCurrency(exp.amount)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center space-x-2.5">
                      <button
                        onClick={() => onEdit(exp)}
                        className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-700/50 rounded-lg transition-all"
                        title="Edit Expense"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleConfirmDelete(exp.id, exp.note)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-700/50 rounded-lg transition-all"
                        title="Delete Expense"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
