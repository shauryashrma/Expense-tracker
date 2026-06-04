import axios from 'axios';

const BASE_URL = 'https://expense-tracker-2mjg.onrender.com';

// Create an instance of axios if needed, or use default axios
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getExpenses = (filters) => {
  // Translate frontend filters object to query parameters if needed.
  // Wait, backend supports ?category, ?startDate, ?endDate.
  // We can pass them as params. Let's make sure the shape is clean.
  const params = {};
  if (filters) {
    if (filters.category && filters.category !== 'All') {
      params.category = filters.category;
    }
    // Handle dateRange and custom dates
    if (filters.startDate) params.startDate = filters.startDate;
    if (filters.endDate) params.endDate = filters.endDate;
  }
  return apiClient.get('/expenses', { params });
};

export const addExpense = (data) => apiClient.post('/expenses', data);

export const updateExpense = (id, data) => apiClient.put(`/expenses/${id}`, data);

export const deleteExpense = (id) => apiClient.delete(`/expenses/${id}`);
