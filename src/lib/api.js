const API_BASE = import.meta.env.VITE_API_BASE || 'https://smarttaskmanager-be-2.onrender.com';

// Helper function to get user data from either localStorage or sessionStorage
export function getUserData() {
  return {
    userId: localStorage.getItem('userId') || sessionStorage.getItem('userId'),
    userName: localStorage.getItem('userName') || sessionStorage.getItem('userName'),
    role: localStorage.getItem('role') || sessionStorage.getItem('role')
  };
}

// Helper function to check if user is authenticated
export function isAuthenticated() {
  const userData = getUserData();
  return !!userData.userId;
}

// Helper function to logout and clear all stored data
export function logout() {
  localStorage.removeItem('userId');
  localStorage.removeItem('userName');
  localStorage.removeItem('role');
  localStorage.removeItem('accessToken');
  
  sessionStorage.removeItem('userId');
  sessionStorage.removeItem('userName');
  sessionStorage.removeItem('role');
  sessionStorage.removeItem('accessToken');
}

export async function api(path, options = {}) {
  // Get token from localStorage for authenticated requests
  const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
  
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  
  // Add Authorization header if token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    headers,
    ...options
  });
  const text = await res.text();
  let data;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (!res.ok) throw { status: res.status, data };
  return data;
}
