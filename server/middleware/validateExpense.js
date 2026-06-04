const ALLOWED_CATEGORIES = ['Food', 'Transport', 'Bills', 'Entertainment', 'Other'];

function getLocalDateString(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function isValidDateString(date) {
  return typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date);
}

module.exports = (req, res, next) => {
  const isPut = req.method === 'PUT';
  const { amount, category, date, note } = req.body;

  if (!isPut || amount !== undefined) {
    if (amount === undefined || amount === null || amount === '') {
      return res.status(400).json({ success: false, error: 'Amount is required' });
    }
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount)) {
      return res.status(400).json({ success: false, error: 'Amount must be a positive number' });
    }
    if (parsedAmount < 0) {
      return res.status(400).json({ success: false, error: 'Amount cannot be negative' });
    }
    if (parsedAmount <= 0) {
      return res.status(400).json({ success: false, error: 'Amount must be a positive number' });
    }
    req.body.amount = parsedAmount;
  }

  if (!isPut || category !== undefined) {
    const trimmedCategory = typeof category === 'string' ? category.trim() : category;
    if (!trimmedCategory) {
      return res.status(400).json({ success: false, error: 'Category is required' });
    }
    if (!ALLOWED_CATEGORIES.includes(trimmedCategory)) {
      return res.status(400).json({
        success: false,
        error: 'Category must be one of: Food, Transport, Bills, Entertainment, Other',
      });
    }
    req.body.category = trimmedCategory;
  }

  if (!isPut || date !== undefined) {
    if (!date) {
      return res.status(400).json({ success: false, error: 'Date is required' });
    }
    if (!isValidDateString(date)) {
      return res.status(400).json({ success: false, error: 'Invalid date format' });
    }
    if (date > getLocalDateString()) {
      return res.status(400).json({ success: false, error: 'Date cannot be in the future' });
    }
  }

  if (note !== undefined && note !== null) {
    req.body.note = String(note).trim();
    if (req.body.note.length > 200) {
      return res.status(400).json({ success: false, error: 'Note must be at most 200 characters' });
    }
  }

  next();
};
