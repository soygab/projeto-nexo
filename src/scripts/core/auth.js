const API_URL = 'http://localhost:8000/api/auth';

export async function login(email, senha) {
  const response = await fetch(`${API_URL}/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: senha }),
  });
  if (!response.ok) throw new Error('Credenciais inválidas');
  const data = await response.json();
  localStorage.setItem('nexo_access_token', data.access);
  localStorage.setItem('nexo_refresh_token', data.refresh);
  if (data.user) {
    localStorage.setItem('nexo_user', JSON.stringify(data.user));
  }
  return data;
}

export async function register(dados) {
  const response = await fetch(`${API_URL}/register/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  });
  if (!response.ok) throw new Error('Falha ao cadastrar');
  const data = await response.json();
  localStorage.setItem('nexo_access_token', data.access);
  localStorage.setItem('nexo_refresh_token', data.refresh);
  localStorage.setItem('nexo_user', JSON.stringify(data.user));
  return data;
}

export function getCurrentUser() {
  const raw = localStorage.getItem('nexo_user');
  return raw ? JSON.parse(raw) : null;
}

export function isAuthenticated() {
  return !!localStorage.getItem('nexo_access_token');
}

export function logout() {
  localStorage.removeItem('nexo_access_token');
  localStorage.removeItem('nexo_refresh_token');
  localStorage.removeItem('nexo_user');
}