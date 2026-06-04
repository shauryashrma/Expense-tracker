export const CATEGORIES = ['Food', 'Transport', 'Bills', 'Entertainment', 'Other'];

export function getLocalDateString(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * @param {{ amount?: string|number, category?: string, date?: string, note?: string }} data
 * @returns {{ valid: boolean, errors: Record<string, string> }}
 */
export function validateExpenseForm(data) {
  const errors = {};

  const amountRaw = data.amount;
  if (amountRaw === '' || amountRaw === null || amountRaw === undefined) {
    errors.amount = 'Amount is required';
  } else {
    const num = parseFloat(amountRaw);
    if (isNaN(num)) {
      errors.amount = 'Amount must be a valid number';
    } else if (num < 0) {
      errors.amount = 'Amount cannot be negative';
    } else if (num === 0) {
      errors.amount = 'Amount must be greater than zero';
    }
  }

  const category = typeof data.category === 'string' ? data.category.trim() : data.category;
  if (!category) {
    errors.category = 'Category is required';
  } else if (!CATEGORIES.includes(category)) {
    errors.category = 'Please select a valid category';
  }

  const date = data.date;
  if (!date) {
    errors.date = 'Date is required';
  } else if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    errors.date = 'Please enter a valid date';
  } else if (date > getLocalDateString()) {
    errors.date = 'Date cannot be in the future';
  }

  if (data.note && data.note.length > 200) {
    errors.note = 'Note must be at most 200 characters';
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

const SERVER_ERROR_FIELDS = {
  'Amount is required': 'amount',
  'Amount must be a positive number': 'amount',
  'Amount cannot be negative': 'amount',
  'Category is required': 'category',
  'Category must be one of: Food, Transport, Bills, Entertainment, Other': 'category',
  'Date is required': 'date',
  'Invalid date format': 'date',
  'Date cannot be in the future': 'date',
  'Note must be at most 200 characters': 'note',
};

export function fieldErrorFromServerMessage(message) {
  if (!message) return null;
  const field = SERVER_ERROR_FIELDS[message];
  return field ? { [field]: message } : null;
}
