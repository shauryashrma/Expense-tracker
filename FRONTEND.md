# Frontend Specification Document
## Mini Expense Tracker

---

### 1. Tech Stack
- React + Vite
- Tailwind CSS
- Recharts (pie/bar chart)
- Axios (API calls)

---

### 2. Pages
Single page app. No routing needed. All components render in `App.jsx`.

---

### 3. Component Tree

```
App.jsx
├── ExpenseForm.jsx        # Add / Edit
├── FilterBar.jsx          # Category + date range filters
├── SummaryPanel.jsx       # Totals + highest expense
├── CategoryChart.jsx      # Pie or bar chart
└── ExpenseTable.jsx       # Expense list + edit/delete actions
```

---

### 4. Component Specifications

---

#### 4.1 App.jsx
- Owns all state (see state shape below)
- Fetches expenses from backend on mount (`useEffect`)
- Passes handlers down as props
- Re-fetches after every add / edit / delete

**State:**
```js
const [expenses, setExpenses] = useState([])
const [filters, setFilters] = useState({
  category: 'All',
  dateRange: 'thisMonth',   // 'thisMonth' | 'lastMonth' | 'custom'
  startDate: '',
  endDate: ''
})
const [editingExpense, setEditingExpense] = useState(null)
const [loading, setLoading] = useState(false)
const [error, setError] = useState(null)
```

**Derived (computed inline):**
```js
const filteredExpenses = expenses
  .filter(e => filters.category === 'All' || e.category === filters.category)
  .filter(e => /* date range logic */)
  .sort((a, b) => new Date(b.date) - new Date(a.date))
```

---

#### 4.2 ExpenseForm.jsx
**Props:** `editingExpense`, `onSubmit`, `onCancel`

**Behaviour:**
- If `editingExpense` is not null → Edit mode (form pre-filled)
- If `editingExpense` is null → Add mode (form empty)
- On submit → calls `onSubmit(formData)` → parent handles API call
- On cancel → calls `onCancel()` → clears `editingExpense`

**Fields:**

| Field | Type | Validation |
|---|---|---|
| Amount | number input | Required, > 0 |
| Category | select dropdown | Required |
| Date | date input | Required, max = today |
| Note | text input | Optional, max 200 chars |

**Category Options:** Food, Transport, Bills, Entertainment, Other

---

#### 4.3 FilterBar.jsx
**Props:** `filters`, `onFilterChange`

**Controls:**

| Control | Type | Options |
|---|---|---|
| Category | select | All, Food, Transport, Bills, Entertainment, Other |
| Date Range | select | This Month, Last Month, Custom |
| Start Date | date input | Shown only when dateRange = 'custom' |
| End Date | date input | Shown only when dateRange = 'custom' |

- On any change → calls `onFilterChange(updatedFilters)`
- Filters apply simultaneously

---

#### 4.4 SummaryPanel.jsx
**Props:** `filteredExpenses`

**Displays:**

| Stat | Logic |
|---|---|
| Total This Month | sum of all filteredExpenses amounts |
| Per Category | group by category, sum each |
| Highest Single Expense | max amount in filteredExpenses |

- All amounts formatted as ₹1,234.50
- Updates automatically when `filteredExpenses` changes

---

#### 4.5 CategoryChart.jsx
**Props:** `filteredExpenses`

- Pie chart (Recharts `PieChart`)
- One slice per category present in `filteredExpenses`
- Shows category name + total amount in tooltip
- If no data → show "No expenses to display"

---

#### 4.6 ExpenseTable.jsx
**Props:** `filteredExpenses`, `onEdit`, `onDelete`, `loading`

**Columns:**

| Column | Notes |
|---|---|
| Date | formatted as DD/MM/YYYY |
| Category | plain text |
| Amount | formatted as ₹1,234.50 |
| Note | plain text, empty if none |
| Actions | Edit button + Delete button |

**Behaviour:**
- Edit button → calls `onEdit(expense)` → sets `editingExpense` in App.jsx
- Delete button → shows `window.confirm()` prompt → calls `onDelete(id)`
- Loading state → show spinner or "Loading..." text
- Empty state → show "No expenses found" message
- Sorted newest first (handled in App.jsx derived state)

---

### 5. CSV Export

**Trigger:** Export button above `ExpenseTable`

**Logic (exportCsv.js):**
```js
// Columns: Date, Category, Amount, Note
// Converts filteredExpenses to CSV string
// Creates blob → triggers browser download
// Filename: expenses-YYYY-MM-DD.csv
```

---

### 6. Currency Formatting

Single utility function used across all components:

```js
const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(amount)
```

---

### 7. API Service (services/api.js)

All backend calls in one file:

```js
const BASE_URL = 'http://localhost:5000/api'

export const getExpenses = (filters) => axios.get(`${BASE_URL}/expenses`, { params: filters })
export const addExpense = (data) => axios.post(`${BASE_URL}/expenses`, data)
export const updateExpense = (id, data) => axios.put(`${BASE_URL}/expenses/${id}`, data)
export const deleteExpense = (id) => axios.delete(`${BASE_URL}/expenses/${id}`)
```

---

### 8. Loading & Error States

| State | UI |
|---|---|
| Loading expenses | Spinner inside ExpenseTable |
| API error | Red error message below FilterBar |
| Empty filtered list | "No expenses found" inside ExpenseTable |
| Form validation error | Inline red text below each invalid field |

---

### 9. Layout (rough)

```
┌─────────────────────────────────────┐
│  💰 Mini Expense Tracker            │
├─────────────────────────────────────┤
│  ExpenseForm (Add / Edit)           │
├─────────────────────────────────────┤
│  FilterBar                          │
├──────────────────┬──────────────────┤
│  SummaryPanel    │  CategoryChart   │
├─────────────────────────────────────┤
│  [Export CSV]                       │
│  ExpenseTable                       │
└─────────────────────────────────────┘
```

---

### 10. Responsive Behaviour
- SummaryPanel + CategoryChart stack vertically on mobile
- ExpenseTable scrolls horizontally on small screens
- ExpenseForm is full width on mobile