import React from 'react';
import { Filter, Calendar } from 'lucide-react';

const CATEGORIES = ['All', 'Food', 'Transport', 'Bills', 'Entertainment', 'Other'];

export default function FilterBar({ filters, onFilterChange }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="bg-slate-800/80 backdrop-blur-md p-6 rounded-2xl border border-slate-700/60 shadow-xl">
      <div className="flex items-center space-x-2 mb-4">
        <Filter className="h-5 w-5 text-indigo-400" />
        <h2 className="text-lg font-bold text-slate-200">Filters</h2>
      </div>

      <div className="space-y-4">
        {/* Category Filter */}
        <div>
          <label htmlFor="category-filter" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Category
          </label>
          <select
            id="category-filter"
            name="category"
            value={filters.category}
            onChange={handleChange}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Date Range Preset Filter */}
        <div>
          <label htmlFor="date-range-filter" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Date Range
          </label>
          <select
            id="date-range-filter"
            name="dateRange"
            value={filters.dateRange}
            onChange={handleChange}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
          >
            <option value="thisMonth">This Month</option>
            <option value="lastMonth">Last Month</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>

        {/* Custom Date Pickers */}
        {filters.dateRange === 'custom' && (
          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-700/50 animate-fadeIn duration-200">
            <div>
              <label htmlFor="start-date-filter" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center">
                <Calendar className="h-3 w-3 mr-1 text-slate-400" /> Start Date
              </label>
              <input
                id="start-date-filter"
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
              />
            </div>
            <div>
              <label htmlFor="end-date-filter" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center">
                <Calendar className="h-3 w-3 mr-1 text-slate-400" /> End Date
              </label>
              <input
                id="end-date-filter"
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
