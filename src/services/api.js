const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

let logoutCallback = null;
let toastCallback = null;

export const setLogoutCallback = (cb) => {
  logoutCallback = cb;
};

export const setToastCallback = (cb) => {
  toastCallback = cb;
};

export const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('walletwiz_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);

    // Rate Limit Exceeded (429)
    if (response.status === 429) {
      const errorData = await response.json().catch(() => ({}));
      const message = errorData.detail || 'Slow down! You are sending too many requests.';
      if (toastCallback) {
        toastCallback(message, 'warning');
      }
      throw new Error(message);
    }

    // Unauthorized (401)
    if (response.status === 401) {
      if (logoutCallback) {
        logoutCallback();
      }
      throw new Error('Session expired. Please log in again.');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || errorData.message || 'Something went wrong');
    }

    // Handled success responses
    if (response.status === 204) {
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error('API Request Error:', error.message);
    throw error;
  }
};

export const authAPI = {
  register: (email, password, firstName) => 
    apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, first_name: firstName }),
    }),
    
  login: (email, password) => 
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
    
  loginGoogle: (idToken) => 
    apiRequest('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ id_token: idToken }),
    }),
};

export const transactionAPI = {
  create: (data) => 
    apiRequest('/transactions', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    
  list: (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
        params.append(key, filters[key]);
      }
    });
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return apiRequest(`/transactions${queryString}`, { method: 'GET' });
  },
  
  update: (id, data) => 
    apiRequest(`/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    
  delete: (id) => 
    apiRequest(`/transactions/${id}`, {
      method: 'DELETE',
    }),
};

export const analyticsAPI = {
  getDashboard: (timeframe = 'this-month') => 
    apiRequest(`/analytics/dashboard?timeframe=${timeframe}`, { method: 'GET' }),
};

export const chatAPI = {
  sendQuery: (message, history = []) => 
    apiRequest('/chat', {
      method: 'POST',
      body: JSON.stringify({ message, history }),
    }),
};
