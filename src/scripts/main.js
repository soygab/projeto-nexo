// NEXO - ponto de entrada da aplicação

import { initializeApp, goToApp } from './core/app.js';
import { logout } from './core/auth.js';
import { showPage } from './core/router.js';
import { closeAllModals, closeModal, openModal } from './components/modal.js';
import { switchLoginTab, switchTab } from './components/tabs.js';
import { renderUserData, saveProfile, toggleProfileEditor, showProfileActivity } from './core/profile.js';

function bindGlobalEvents() {
  document.addEventListener('submit', event => {
    if (event.target.id === 'profile-form') {
      event.preventDefault();
      saveProfile(event.target);
    }
  });
  document.addEventListener('click', event => {
    const profileTab = event.target.closest('[data-profile-tab]');
    if (profileTab) {
      showProfileActivity(profileTab.dataset.profileTab);
      return;
    }
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
    if (['edit-profile', 'cancel-profile'].includes(action?.dataset.action)) {
      toggleProfileEditor(action.dataset.action === 'edit-profile');
      return;
    }
    if (['go-to-app', 'resend-verification'].includes(action?.dataset.action)) {
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

import { login, register, resendVerification } from './core/auth.js';

async function handleAuthSubmit(button) {
  const isRegister = button.closest('#register-panel');
  const message = document.getElementById('login-message');
  const originalContent = button.innerHTML;

  message?.classList.add('is-hidden');
  message?.classList.remove('is-success');
  button.disabled = true;
  button.innerHTML = '<i class="ti ti-loader-2"></i> Aguarde...';

  try {
    if (isRegister) {
      const result = await register({
        first_name: document.getElementById('reg-nome').value,
        last_name: document.getElementById('reg-sobrenome').value,
        email: document.getElementById('reg-email').value,
        instituicao: document.getElementById('reg-instituicao').value,
        curso: document.getElementById('reg-curso').value,
        password: document.getElementById('reg-senha').value,
      });
      if (result.requires_verification) {
        message.textContent = result.detail;
        message.classList.add('is-success');
        message.classList.remove('is-hidden');
        document.getElementById('register-panel').querySelectorAll('input').forEach(input => {
          input.value = '';
        });
        return;
      }
    } else {
      const emailInput = document.getElementById('login-email');
      const email = emailInput.value.trim();
      const password = document.getElementById('login-senha').value;

      if (!email) throw new Error('Informe seu e-mail para entrar.');
      if (!emailInput.checkValidity()) {
        throw new Error('Digite um endereço de e-mail válido.');
      }
      if (!password) throw new Error('Informe sua senha para entrar.');

      if (button.dataset.action === 'resend-verification') {
        const result = await resendVerification(email, password);
        message.textContent = result.detail;
        message.classList.add('is-success');
        message.classList.remove('is-hidden');
        return;
      }
      await login(email, password);
    }
    renderUserData();
    goToApp();
  } catch (error) {
    if (message) {
      message.textContent = error.message === 'Failed to fetch'
        ? 'Não foi possível conectar ao servidor. Confirme se o Django está em execução e tente novamente.'
        : error.message;
      message.classList.remove('is-hidden');
    }
  } finally {
    button.disabled = false;
    button.innerHTML = originalContent;
  }
}

async function init() {
  bindGlobalEvents();
  await initializeApp();

  const verification = new URLSearchParams(location.search).get('verification');
  const message = document.getElementById('login-message');
  if (verification && message) {
    message.textContent = verification === 'success'
      ? 'E-mail confirmado com sucesso. Agora você já pode entrar.'
      : 'O link de confirmação é inválido ou expirou.';
    message.classList.toggle('is-success', verification === 'success');
    message.classList.remove('is-hidden');
    history.replaceState({}, '', location.pathname);
  }
}

init().catch(error => {
  console.error('[NEXO] Falha ao inicializar a aplicação:', error);
});
