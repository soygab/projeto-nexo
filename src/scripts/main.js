// NEXO - ponto de entrada da aplicação

import { initializeApp, goToApp } from './core/app.js';
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
      goToApp();
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

async function init() {
  bindGlobalEvents();
  await initializeApp();
}

init().catch(error => {
  console.error('[NEXO] Falha ao inicializar a aplicação:', error);
});
