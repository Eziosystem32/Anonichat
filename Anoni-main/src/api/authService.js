const BASE_URL = 'http://localhost:5000/api';

export const loginUser = async (credentials) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: credentials.email || credentials.username, // support both
      password: credentials.password,
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Login failed');

  // save token for future requests
  localStorage.setItem('token', data.token);
  return data.user;
};

export const registerUser = async (credentials) => {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: credentials.username,
      email: credentials.email,
      password: credentials.password,
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Registration failed');

  localStorage.setItem('token', data.token);
  return data.user;
};

export const logoutUser = () => {
  localStorage.removeItem('token');
};

export const getToken = () => localStorage.getItem('token');

export const getCurrentUser = async () => {
  const token = getToken();
  if (!token) return null;

  const res = await fetch(`${BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    localStorage.removeItem('token'); // token expired or invalid
    return null;
  }
  const data = await res.json();
  return data.user;
};
