# Product Requirements Document (PRD)
## Mini Expense Tracker

---

### 1. Overview
A single-user web app to log daily expenses, filter/view them, and understand spending patterns through a summary panel and chart. No authentication. Built with React frontend + Node.js/Express backend.

---

### 2. Goals
- Let user add, edit, delete expenses quickly
- Show where money is going (by category, by month)
- Persist data across server restarts (JSON file)

---

### 3. Users
Single user. No login. App opens directly to the dashboard.

---

### 4. Features

**F1 — Add Expense**
- Fields: amount (required), category (required), date (required), note (optional)
- Categories: Food, Transport, Bills, Entertainment, Other
- Validation: amount must be positive, date cannot be future, category required

**F2 — View Expenses**
- Table/list sorted by date (newest first)
- Shows: amount, category, date, note, edit/delete actions

**F3 — Edit & Delete**
- Edit opens a pre-filled form
- Delete shows a confirmation prompt before removing

**F4 — Filters**
- Filter by category (dropdown)
- Filter by date range: This Month / Last Month / Custom (date picker)
- Filters apply simultaneously

**F5 — Summary Panel**
- Total spent this month
- Total per category (this month)
- Highest single expense (this month)

**F6 — Chart**
- Pie or bar chart showing expenses by category
- Reflects current active filters

**F7 — CSV Export**
- Export currently visible (filtered) expenses as a .csv file
- Columns: Date, Category, Amount, Note

**F8 — Persistence**
- Data saved to a JSON file on the server
- Survives server restarts

---

### 5. Out of Scope
- Authentication / multi-user
- Budget per category
- Drag and drop
- Mobile app

---

### 6. Success Criteria
- All Must Have features work end-to-end without crashing
- Form validation prevents bad data
- Summary panel updates in real time with filters
- Data persists after server restart