# 💸 Mini Expense Tracker

A clean, single-user web app to log daily expenses, visualize spending patterns, and export data built with a React frontend and a Node.js/Express backend.

---

## ✨ Features

- **Add / Edit / Delete Expenses** — Log expenses with amount, category, date, and an optional note. Edit inline or delete with a confirmation prompt.
- **Smart Filters** — Filter by category and date range (This Month / Last Month / Custom).
- **Summary Panel** — See total spent, per-category totals, and highest single expense for the active filter period.
- **Category Chart** — Pie/bar chart (Recharts) that updates live with your active filters.
- **CSV Export** — Download the currently filtered expenses as a `.csv` file (Date, Category, Amount, Note).
- **Persistent Storage** — Data saved to a JSON file on the server; survives restarts with no database setup required.

---

## 🛠 Tech Stack

| Layer       | Tech                  |
|-------------|-----------------------|
| Frontend    | React + Vite          |
| Styling     | Tailwind CSS          |
| Charts      | Recharts              |
| Backend     | Node.js + Express     |
| Storage     | JSON file (`expenses.json`) |
| HTTP Client | Axios                 |

---

## 📁 Project Structure

```
expense-tracker/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ExpenseForm.jsx       # Add + Edit form
│   │   │   ├── ExpenseTable.jsx      # Expenses list
│   │   │   ├── FilterBar.jsx         # Category + date filters
│   │   │   ├── SummaryPanel.jsx      # Totals + highest expense
│   │   │   └── CategoryChart.jsx     # Pie/bar chart
│   │   ├── services/
│   │   │   └── api.js                # Axios API calls
│   │   ├── utils/
│   │   │   └── exportCsv.js          # CSV export helper
│   │   ├── App.jsx                   # Root state + layout
│   │   └── main.jsx
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
├── ARCHITECTURE.md
├── PRD.md
├── SECURITY.md
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- npm v9+

### 1. Clone the repository

```bash
git clone https://github.com/shauryashrma/Expense-tracker.git
cd Expense-tracker
```

### 2. Start the backend

```bash
cd server
npm install
node server.js
```

The Express server runs on **http://localhost:5000**.

### 3. Start the frontend

```bash
cd client
npm install
npm run dev
```

The Vite dev server runs on **http://localhost:5173**.

Open your browser at `http://localhost:5173` to use the app.

---

## 📡 API Reference

| Method | Endpoint            | Description                        |
|--------|---------------------|------------------------------------|
| GET    | `/api/expenses`     | Get all expenses (supports filters) |
| POST   | `/api/expenses`     | Add a new expense                  |
| PUT    | `/api/expenses/:id` | Edit an existing expense           |
| DELETE | `/api/expenses/:id` | Delete an expense                  |

**Optional query params for GET:**
```
?category=Food
?startDate=2026-06-01
?endDate=2026-06-30
```

---

## ✅ Validation Rules

| Field    | Rule                                                              |
|----------|-------------------------------------------------------------------|
| amount   | Required, must be a positive number                               |
| category | Required — one of: `Food`, `Transport`, `Bills`, `Entertainment`, `Other` |
| date     | Required, cannot be a future date                                 |
| note     | Optional, max 200 characters                                      |

---

## 📦 Data Model

Each expense is stored as:

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

## 🔒 Security

- Input validation via `validateExpense.js` middleware on all write operations
- CORS restricted to `http://localhost:5173` in development
- No user-controlled file paths or shell commands
- React escapes all user input by default — no XSS risk
- See [SECURITY.md](./SECURITY.md) for the full security document

---

## 📄 Additional Docs

- [ARCHITECTURE.md](./ARCHITECTURE.md) — Full technical architecture and data flow
- [PRD.md](./PRD.md) — Product requirements and feature list
- [SECURITY.md](./SECURITY.md) — Security & access document

---

## 🗺 Roadmap / Out of Scope (v1)

The following are explicitly out of scope for the current version:

- Authentication / multi-user support
- Per-category budgets
- Mobile app
- Drag and drop reordering

---

## 👤 Author

**Shaurya Sharma** — [@shauryashrma](https://github.com/shauryashrma)
