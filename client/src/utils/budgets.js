import { CATEGORIES } from './validateExpense';

const STORAGE_KEY = 'expense-tracker-category-budgets';

export function defaultBudgets() {
  return CATEGORIES.reduce((acc, cat) => {
    acc[cat] = null;
    return acc;
  }, {});
}

function normalizeBudgets(parsed) {
  const budgets = defaultBudgets();
  if (!parsed || typeof parsed !== 'object') return budgets;

  for (const cat of CATEGORIES) {
    const value = parsed[cat];
    if (value === null || value === undefined || value === '') {
      budgets[cat] = null;
    } else {
      const num = parseFloat(value);
      budgets[cat] = !isNaN(num) && num > 0 ? num : null;
    }
  }
  return budgets;
}

export function loadBudgets() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultBudgets();
    return normalizeBudgets(JSON.parse(raw));
  } catch {
    return defaultBudgets();
  }
}

export function saveBudgets(budgets) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeBudgets(budgets)));
}

export function parseBudgetInput(value) {
  if (value === '' || value === null || value === undefined) return null;
  const num = parseFloat(value);
  if (isNaN(num) || num <= 0) return null;
  return num;
}

export function getBudgetStatus(spent, budget) {
  if (budget == null || budget <= 0) {
    return { hasBudget: false, percent: 0, overBudget: false, remaining: null };
  }
  const percent = (spent / budget) * 100;
  return {
    hasBudget: true,
    percent,
    overBudget: spent > budget,
    remaining: Math.max(budget - spent, 0),
    overBy: spent > budget ? spent - budget : 0,
  };
}
