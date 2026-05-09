const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8000';
const ADMIN_API = `${API_BASE}/api/admin`;

function getToken() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('admin_token');
  }
  return null;
}

async function request(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${ADMIN_API}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `HTTP ${res.status}`);
  }

  return res.json();
}

export const api = {
  login: (email, password) =>
    request('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  logout: () => request('/logout', { method: 'POST' }),

  getUser: () => request('/user'),

  getProfile: () => request('/profile'),

  updateProfile: (data) =>
    request('/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  getSkills: () => request('/skills'),

  createSkill: (data) =>
    request('/skills', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateSkill: (id, data) =>
    request(`/skills/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteSkill: (id) => request(`/skills/${id}`, { method: 'DELETE' }),

  getProjects: () => request('/projects'),

  createProject: (data) =>
    request('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateProject: (id, data) =>
    request(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteProject: (id) => request(`/projects/${id}`, { method: 'DELETE' }),
};
