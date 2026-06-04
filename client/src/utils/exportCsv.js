/**
 * Exports an array of expense objects as a CSV file.
 * Columns: Date, Category, Amount, Note
 * Filename: expenses-YYYY-MM-DD.csv
 */
export const exportToCsv = (expenses) => {
  if (!expenses || expenses.length === 0) return;

  const headers = ['Date', 'Category', 'Amount', 'Note'];

  // Helper: properly escape a CSV field value
  const escapeCsvField = (value) => {
    const str = String(value);
    // If the field contains a comma, double-quote, or newline, wrap it in quotes
    // and double any existing double-quotes
    if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
      return '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
  };

  const rows = expenses.map(exp => {
    const date = exp.date || '';
    const category = exp.category || '';
    const amount = exp.amount;
    const note = exp.note || '';

    return [
      escapeCsvField(date),
      escapeCsvField(category),
      escapeCsvField(amount),
      escapeCsvField(note)
    ].join(',');
  });

  const csvContent = [headers.join(','), ...rows].join('\n');

  // Generate Filename: expenses-YYYY-MM-DD.csv
  const today = new Date().toISOString().split('T')[0];
  const filename = `expenses-${today}.csv`;

  // Use Blob URL for download — Chrome respects the download attribute on blob: URLs
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();

  // Generous delay before cleanup — gives the browser plenty of time
  // to fully initiate the download and use the correct filename
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 10000);
};

