// NEXO - ponto de entrada da aplicação

import { initializeApp, goToApp } from './core/app.js';
import { logout } from './core/auth.js';
import { showPage } from './core/router.js';
import { closeAllModals, closeModal, openModal } from './components/modal.js';
import { switchLoginTab, switchTab } from './components/tabs.js';

function bindGlobalEvents() {
  document.addEventListener('click', event => {
    const navigation = event.target.closest('[data-page]');
    if (navigation) {
      event.preventDefault();
      showPage(navigation.dataset.page);
      return;
    }

    const modalOpen = event.target.closest('[data-modal-open]');
    if (modalOpen) {
      openModal(modalOpen.dataset.modalOpen);
      return;
    }

    const modalClose = event.target.closest('[data-modal-close]');
    if (modalClose) {
      closeModal(modalClose.dataset.modalClose);
      return;
    }

    const loginTab = event.target.closest('[data-login-tab]');
    if (loginTab) {
      switchLoginTab(loginTab.dataset.loginTab);
      return;
    }

    const action = event.target.closest('[data-action]');
    if (action?.dataset.action === 'go-to-app') {
      event.preventDefault();
      handleAuthSubmit(action);
      return;
    }
    
    if (action?.dataset.action === 'logout') {
      logout();
      location.reload();
      return;
    }

    const tab = event.target.closest('[data-tab]');
    if (tab) switchTab(tab);
  });

  document.addEventListener('click', event => {
    const overlay = event.target.closest('.modal-overlay');
    if (overlay && event.target === overlay) closeAllModals();
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeAllModals();
  });
}

import { login, register } from './core/auth.js';

async function handleAuthSubmit(button) {
  const isRegister = button.closest('#register-panel');
  try {
    if (isRegister) {
      await register({
        first_name: document.getElementById('reg-nome').value,
        last_name: document.getElementById('reg-sobrenome').value,
        email: document.getElementById('reg-email').value,
        instituicao: document.getElementById('reg-instituicao').value,
        curso: document.getElementById('reg-curso').value,
        password: document.getElementById('reg-senha').value,
      });
    } else {
      await login(
        document.getElementById('login-email').value,
        document.getElementById('login-senha').value
      );
    }
    goToApp();
  } catch (error) {
    alert(error.message); // troque por um elemento visual de erro depois
  }
}

async function init() {
  bindGlobalEvents();
  await initializeApp();
}

init().catch(error => {
  console.error('[NEXO] Falha ao inicializar a aplicação:', error);
});
