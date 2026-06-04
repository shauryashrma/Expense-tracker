# Security & Access Document
## Mini Expense Tracker

---

### 1. Overview
Since this is a single-user app with no authentication, security focus is on input validation, safe file handling, and basic API protection.

---

### 2. Authentication & Authorization
- No authentication required (single user, per brief)
- No JWT, sessions, or login flow
- All endpoints are publicly accessible by design

---

### 3. Input Validation

All incoming POST and PUT requests pass through `validateExpense.js` middleware before reaching the route handler.

| Field | Validation |
|---|---|
| amount | Must exist, must be a number, must be > 0 |
| category | Must exist, must be one of allowed enum values |
| date | Must exist, must not be a future date |
| note | Optional, stripped of leading/trailing whitespace, max 200 chars |

Any failed validation returns immediately with:
```json
{
  "success": false,
  "error": "Descriptive error message"
}
```

---

### 4. Data Sanitization

- All string inputs trimmed of whitespace before saving
- Amount parsed as `parseFloat` and validated as finite number
- Date validated using `new Date()` — invalid date strings rejected
- No HTML rendering of user input on frontend (React escapes by default)
- Note field never rendered as raw HTML — prevents XSS

---

### 5. File Storage Safety

- `expenses.json` is read and written only via server-side route handlers
- File path is hardcoded — no user input ever constructs a file path
- Write operations use atomic pattern: build new array in memory, then write full file
- If `expenses.json` does not exist on startup, server creates it with empty array `[]`

---

### 6. API Protection

- CORS restricted to `http://localhost:5173` in development
- For production deployment, CORS origin updated to actual frontend domain
- All unmatched routes return 404 with `{ "success": false, "error": "Not found" }`
- Express does not expose stack traces in responses — errors caught in try/catch blocks

---

### 7. Dependency Safety

- Minimal dependencies — only what is needed (express, cors, uuid)
- No `eval()` or dynamic code execution anywhere
- No user-controlled file paths or shell commands

---

### 8. Frontend Safety

- No sensitive data stored in localStorage or sessionStorage
- Axios base URL points to backend only — no direct third-party API calls from frontend
- Delete action requires confirmation prompt before API call is made
- Form inputs have type constraints (`type="number"`, `type="date"`) as first line of defence

---

### 9. Production Checklist (for deployment)

| Item | Action |
|---|---|
| CORS origin | Update to deployed frontend URL |
| expenses.json | Ensure write permissions on server |
| Error messages | Never expose internal file paths or stack traces |
| HTTPS | Use Render/Railway which provide HTTPS by default |