const API_URL = '/api/auth';
async function dataFrom(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.detail || Object.values(data).flat().join(' ') || 'Não foi possível concluir a operação.');
  return data;
}
async function post(path, data) {
  return dataFrom(await fetch(API_URL + path, {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data)}));
}
export async function login(email, password) {
  const data = await post('/login/', {email, password});
  localStorage.setItem('nexo_access_token', data.access);
  localStorage.setItem('nexo_refresh_token', data.refresh);
  saveUser(data.user);
  return data;
}
export const register = data => post('/register/', data);
export const resendVerification = (email, password) => post('/resend-verification/', {email, password});
export function saveUser(user) { localStorage.setItem('nexo_user', JSON.stringify(user)); }
export function getCurrentUser() {
  try { return JSON.parse(localStorage.getItem('nexo_user') || 'null'); } catch { return null; }
}
export function isAuthenticated() { return !!getCurrentUser() && !!localStorage.getItem('nexo_access_token'); }
export function logout() {
  ['nexo_access_token','nexo_refresh_token','nexo_user'].forEach(key => localStorage.removeItem(key));
}
let refreshing;
export async function apiRequest(path, options = {}) {
  const send = () => fetch(API_URL + path, {...options, headers:{'Content-Type':'application/json', ...options.headers, Authorization:'Bearer ' + localStorage.getItem('nexo_access_token')}});
  let response = await send();
  if (response.status === 401) {
    try {
      if (!refreshing) refreshing = post('/login/refresh/', {refresh:localStorage.getItem('nexo_refresh_token')})
        .then(data => localStorage.setItem('nexo_access_token', data.access)).finally(() => { refreshing = null; });
      await refreshing;
      response = await send();
    } catch {
      logout();
      document.getElementById('screen-app')?.classList.remove('active');
      document.getElementById('screen-login')?.classList.add('active');
      throw new Error('Sua sessão expirou. Entre novamente.');
    }
  }
  if (response.status === 401 || response.status === 403) {
    logout();
    document.getElementById('screen-app')?.classList.remove('active');
    document.getElementById('screen-login')?.classList.add('active');
  }
  return dataFrom(response);
}
export async function restoreSession() {
  if (!localStorage.getItem('nexo_refresh_token')) { logout(); return false; }
  try { saveUser(await apiRequest('/me/')); return true; }
  catch { return false; }
}
