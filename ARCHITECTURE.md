# Technical Architecture Document
## Mini Expense Tracker

---

### 1. Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Frontend | React + Vite | Fast setup, modern tooling |
| Styling | Tailwind CSS | Utility-first, no extra config |
| Chart | Recharts | Best React-native chart library |
| Backend | Node.js + Express | Simple, minimal boilerplate |
| Storage | JSON file | Zero setup, covers persistence bonus |
| HTTP Client | Axios | Clean API calls from frontend |

---

### 2. Monorepo Structure

```
expense-tracker/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ExpenseForm.jsx       # Add + Edit form
│   │   │   ├── ExpenseTable.jsx      # List of expenses
│   │   │   ├── FilterBar.jsx         # Category + date filters
│   │   │   ├── SummaryPanel.jsx      # Totals + highest expense
│   │   │   └── CategoryChart.jsx     # Pie/bar chart
│   │   ├── services/
│   │   │   └── api.js                # All axios calls
│   │   ├── utils/
│   │   │   └── exportCsv.js          # CSV export helper
│   │   ├── App.jsx                   # Root state + layout
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
│
├── server/
│   ├── routes/
│   │   └── expenses.js               # All expense routes
│   ├── data/
│   │   └── expenses.json             # Persistent storage
│   ├── middleware/
│   │   └── validateExpense.js        # Request validation
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

### 3. Data Model

```json
{
  "id": "uuid-v4",
  "amount": 450.00,
  "category": "Food",
  "date": "2026-06-03",
  "note": "Lunch at office",
  "createdAt": "2026-06-03T10:30:00Z"
}
```

---

### 4. API Endpoints

| Method | Path | Description | Used By |
|---|---|---|---|
| GET | /api/expenses | Get all expenses (with optional filters) | ExpenseTable, SummaryPanel, CategoryChart |
| POST | /api/expenses | Add new expense | ExpenseForm |
| PUT | /api/expenses/:id | Edit existing expense | ExpenseForm (edit mode) |
| DELETE | /api/expenses/:id | Delete expense | ExpenseTable |

---

### 5. Endpoint Details

#### GET /api/expenses
Fetch all expenses. Supports optional query params for filtering.

**Query Params (all optional):**
```
?category=Food
?startDate=2026-06-01
?endDate=2026-06-30
?category=Food&startDate=2026-06-01&endDate=2026-06-30
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "abc-123",
      "amount": 450.00,
      "category": "Food",
      "date": "2026-06-03",
      "note": "Lunch",
      "createdAt": "2026-06-03T10:30:00Z"
    }
  ]
}
```

---

#### POST /api/expenses
Add a new expense.

**Request Body:**
```json
{
  "amount": 450.00,
  "category": "Food",
  "date": "2026-06-03",
  "note": "Lunch"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "abc-123",
    "amount": 450.00,
    "category": "Food",
    "date": "2026-06-03",
    "note": "Lunch",
    "createdAt": "2026-06-03T10:30:00Z"
  }
}
```

---

#### PUT /api/expenses/:id
Edit an existing expense by ID.

**Request Body (any subset of fields):**
```json
{
  "amount": 500.00,
  "category": "Food",
  "date": "2026-06-03",
  "note": "Updated note"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "abc-123",
    "amount": 500.00,
    "category": "Food",
    "date": "2026-06-03",
    "note": "Updated note",
    "createdAt": "2026-06-03T10:30:00Z"
  }
}
```

---

#### DELETE /api/expenses/:id
Delete an expense by ID.

**Response:**
```json
{
  "success": true,
  "data": { "id": "abc-123" }
}
```

---

### 6. Validation Rules (middleware/validateExpense.js)

| Field | Rule |
|---|---|
| amount | Required, must be a positive number |
| category | Required, must be one of: Food, Transport, Bills, Entertainment, Other |
| date | Required, cannot be a future date |
| note | Optional, max 200 characters |

**Error Response Shape:**
```json
{
  "success": false,
  "error": "Amount must be a positive number"
}
```

---

### 7. Frontend State (App.jsx)

```
expenses[]          — full list fetched from backend
filteredExpenses[]  — derived from expenses + active filters
filters{}           — { category, dateRange, startDate, endDate }
editingExpense      — null or expense object (controls form mode)
loading             — boolean
error               — string or null
```

---

### 8. Data Flow

```
User Action
    → Component fires handler in App.jsx
    → api.js makes axios call to Express
    → validateExpense middleware checks request
    → Route handler reads/writes expenses.json
    → Returns JSON response
    → App.jsx updates expenses[] state
    → filteredExpenses[] re-derived
    → SummaryPanel + Chart re-render automatically
```

---

### 9. CSV Export Flow

Handled entirely on the frontend — no backend endpoint needed.

```
User clicks Export
    → exportCsv.js receives filteredExpenses[]
    → Converts to CSV string (Date, Category, Amount, Note)
    → Creates a blob URL
    → Triggers browser download
```

---

### 10. CORS Configuration

Backend allows requests from `http://localhost:5173` (Vite default) in development.
Configured via `cors` npm package in `server.js`.

---

### 11. Ports

| Service | Port |
|---|---|
| Vite (frontend) | 5173 |
| Express (backend) | 5000 |