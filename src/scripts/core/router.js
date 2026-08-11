// NEXO - navegação entre páginas

const ROUTES = {
  home: 'dashboard',
  explore: 'explorar',
  project: 'projetos',
  profile: 'perfil',
  events: 'eventos',
  chat: 'chat',
  opportunities: 'oportunidades',
  mobile: 'mobile'
};

const VALID_ROUTES = new Set(Object.keys(ROUTES));

export async function loadPage(page) {
  if (!VALID_ROUTES.has(page)) return false;

  const target = document.querySelector('#page-content');
  if (!target) return false;

  const file = ROUTES[page];
  target.classList.add('is-loading');

  try {
    const response = await fetch(`./src/pages/${file}.html`);
    if (!response.ok) throw new Error(`Página não encontrada: ${file}`);

    target.innerHTML = await response.text();
    updateActiveNavigation(page);
    return true;
  } finally {
    target.classList.remove('is-loading');
  }
}

export function showPage(page) {
  return loadPage(page).catch(error => {
    console.error('[NEXO] Erro ao carregar página:', error);
  });
}

export function updateActiveNavigation(page) {
  document.querySelectorAll('.sidebar .nav-item[data-page]').forEach(item => {
    item.classList.toggle('active', item.dataset.page === page);
  });
}
