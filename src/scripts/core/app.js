// NEXO - controle da aplicação

import { loadComponent } from '../components.js';
import { showPage } from './router.js';
import { isAuthenticated } from './auth.js';
import { renderUserData } from './profile.js';

export async function initializeApp() {
  await loadComponent('#screen-login', './src/pages/login.html');
  await loadComponent('#sidebar-container', './src/components/sidebar.html');
  await loadComponent('#topbar-container', './src/components/topbar.html');
  await loadComponent('#modals-container', './src/components/modals.html');

  if (isAuthenticated()) {
    renderUserData();
    document.getElementById('screen-login')?.classList.remove('active');
    document.getElementById('screen-app')?.classList.add('active');
  }
  await showPage('home');
}

export function goToApp() {
  document.getElementById('screen-login')?.classList.remove('active');
  document.getElementById('screen-app')?.classList.add('active');
  return showPage('home');
}
