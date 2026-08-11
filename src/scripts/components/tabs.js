// NEXO - abas reutilizáveis

export function switchTab(element) {
  if (!element?.parentElement) return;

  element.parentElement.querySelectorAll('.tab').forEach(tab => {
    tab.classList.remove('active');
  });

  element.classList.add('active');
}

export function switchLoginTab(tab) {
  document.querySelectorAll('.login-tab').forEach((element, index) => {
    element.classList.toggle(
      'active',
      index === (tab === 'login' ? 0 : 1)
    );
  });

  document.getElementById('login-panel')?.classList.toggle('is-hidden', tab !== 'login');
  document.getElementById('register-panel')?.classList.toggle('is-hidden', tab !== 'register');
}
