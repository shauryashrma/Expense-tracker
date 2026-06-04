# Feature Ticket List
## Mini Expense Tracker

---

### Ticket Structure
Each ticket follows: **ID | Title | Description | Acceptance Criteria | Dependencies**

---

## BACKEND TICKETS

---

**BE-01 — Project Setup**
Set up Express server with folder structure, CORS, and JSON file storage.

Acceptance Criteria:
- `server.js` runs on port 5000
- CORS allows `http://localhost:5173`
- `expenses.json` created automatically if it does not exist
- `GET /api/health` returns `{ "success": true, "message": "Server running" }`

Dependencies: None

---

**BE-02 — Expense Data Model**
Define the expense object shape and uuid generation.

Acceptance Criteria:
- Each expense has: `id`, `amount`, `category`, `date`, `note`, `createdAt`
- `id` generated using `uuid` package
- `createdAt` set automatically on creation

Dependencies: BE-01

---

**BE-03 — Validation Middleware**
Create `validateExpense.js` middleware for POST and PUT requests.

Acceptance Criteria:
- Rejects if `amount` is missing, not a number, or <= 0
- Rejects if `category` is missing or not in allowed list
- Rejects if `date` is missing or is a future date
- Trims `note` whitespace, enforces max 200 chars
- Returns `{ "success": false, "error": "message" }` on failure

Dependencies: BE-01

---

**BE-04 — GET /api/expenses**
Fetch all expenses with optional category and date filters.

Acceptance Criteria:
- Returns all expenses sorted by date (newest first) by default
- Supports `?category=Food` filter
- Supports `?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD` filter
- Both filters can be combined
- Returns `{ "success": true, "data": [] }`

Dependencies: BE-02

---

**BE-05 — POST /api/expenses**
Add a new expense.

Acceptance Criteria:
- Validates request via BE-03 middleware
- Generates `id` and `createdAt` automatically
- Appends to `expenses.json`
- Returns created expense with 201 status
- Returns `{ "success": true, "data": { expense } }`

Dependencies: BE-02, BE-03

---

**BE-06 — PUT /api/expenses/:id**
Edit an existing expense by ID.

Acceptance Criteria:
- Validates request via BE-03 middleware
- Returns 404 if ID not found: `{ "success": false, "error": "Expense not found" }`
- Updates only provided fields
- Preserves original `id` and `createdAt`
- Writes updated array back to `expenses.json`
- Returns updated expense

Dependencies: BE-02, BE-03

---

**BE-07 — DELETE /api/expenses/:id**
Delete an expense by ID.

Acceptance Criteria:
- Returns 404 if ID not found
- Removes expense from array
- Writes updated array back to `expenses.json`
- Returns `{ "success": true, "data": { "id": "deleted-id" } }`

Dependencies: BE-02

---

## FRONTEND TICKETS

---

**FE-01 — Project Setup**
Set up Vite + React project with Tailwind CSS and Axios.

Acceptance Criteria:
- Vite dev server runs on port 5173
- Tailwind CSS configured and working
- Axios installed
- Recharts installed
- `services/api.js` created with all 4 API functions

Dependencies: None

---

**FE-02 — App.jsx State & Layout**
Set up root state, layout skeleton, and initial data fetch.

Acceptance Criteria:
- All state defined: `expenses`, `filters`, `editingExpense`, `loading`, `error`
- `useEffect` fetches expenses on mount
- `filteredExpenses` derived correctly from `expenses` + `filters`
- Layout renders all 5 component placeholders
- Re-fetches after add / edit / delete

Dependencies: FE-01, BE-04

---

**FE-03 — ExpenseForm Component**
Build the Add / Edit expense form.

Acceptance Criteria:
- Fields: amount, category (dropdown), date, note
- Add mode: form is empty, submit calls POST
- Edit mode: form pre-filled from `editingExpense`, submit calls PUT
- Inline validation errors shown per field
- Cancel button clears edit mode
- Form resets after successful submit

Dependencies: FE-02, BE-05, BE-06

---

**FE-04 — FilterBar Component**
Build category and date range filter controls.

Acceptance Criteria:
- Category dropdown: All + 5 categories
- Date range dropdown: This Month / Last Month / Custom
- Custom date range shows start + end date pickers
- Any change updates `filters` state in App.jsx immediately
- Filters apply simultaneously to `filteredExpenses`

Dependencies: FE-02

---

**FE-05 — ExpenseTable Component**
Display filtered expenses in a table.

Acceptance Criteria:
- Columns: Date, Category, Amount, Note, Actions
- Sorted newest first
- Amount formatted as ₹1,234.50
- Date formatted as DD/MM/YYYY
- Edit button sets `editingExpense` in App.jsx
- Delete button shows confirm prompt then calls DELETE
- Loading spinner shown while `loading` is true
- Empty state message when no expenses match filters

Dependencies: FE-02, BE-07

---

**FE-06 — SummaryPanel Component**
Display spending summary based on filtered expenses.

Acceptance Criteria:
- Shows total spent (sum of filteredExpenses)
- Shows total per category
- Shows highest single expense
- All amounts formatted as ₹1,234.50
- Updates automatically when filteredExpenses changes

Dependencies: FE-02

---

**FE-07 — CategoryChart Component**
Display pie chart of expenses by category.

Acceptance Criteria:
- Uses Recharts PieChart
- One slice per category in filteredExpenses
- Tooltip shows category name + total amount
- Empty state: "No expenses to display"
- Updates when filteredExpenses changes

Dependencies: FE-02

---

**FE-08 — CSV Export**
Export currently visible expenses as a CSV file.

Acceptance Criteria:
- Export button shown above ExpenseTable
- Exports only `filteredExpenses`
- Columns: Date, Category, Amount, Note
- Filename: `expenses-YYYY-MM-DD.csv`
- No backend call needed — handled in `utils/exportCsv.js`

Dependencies: FE-05

---

**FE-09 — Error & Loading States**
Handle all loading and error states across the app.

Acceptance Criteria:
- Loading spinner shown in ExpenseTable during fetch
- API error shown as red message below FilterBar
- Form submission errors shown inline
- All errors cleared on next successful action

Dependencies: FE-02, FE-03, FE-05

---

## BUILD ORDER

```
BE-01 → BE-02 → BE-03 → BE-04 → BE-05 → BE-06 → BE-07
FE-01 → FE-02 → FE-04 → FE-03 → FE-05 → FE-06 → FE-07 → FE-08 → FE-09
```

Start backend first. Once BE-04 is done, frontend can begin in parallel.

---

## SUMMARY

| ID | Title | Priority |
|---|---|---|
| BE-01 | Server Setup | Must |
| BE-02 | Data Model | Must |
| BE-03 | Validation Middleware | Must |
| BE-04 | GET /api/expenses | Must |
| BE-05 | POST /api/expenses | Must |
| BE-06 | PUT /api/expenses/:id | Must |
| BE-07 | DELETE /api/expenses/:id | Must |
| FE-01 | Frontend Setup | Must |
| FE-02 | App State & Layout | Must |
| FE-03 | ExpenseForm | Must |
| FE-04 | FilterBar | Must |
| FE-05 | ExpenseTable | Must |
| FE-06 | SummaryPanel | Must |
| FE-07 | CategoryChart | Should |
| FE-08 | CSV Export | Should |
| FE-09 | Error & Loading States | Must |