import { getCurrentUser } from './auth.js';

function getIniciais(nome, sobrenome) {
  return `${nome?.[0] ?? ''}${sobrenome?.[0] ?? ''}`.toUpperCase();
}

export function renderUserData() {
  const user = getCurrentUser();
  if (!user) return;

  const nomeCompleto = `${user.first_name} ${user.last_name}`;
  const iniciais = getIniciais(user.first_name, user.last_name);

  // Sidebar
  const sidebarNome = document.querySelector('.sidebar-footer .u-name');
  const sidebarRole = document.querySelector('.sidebar-footer .u-role');
  const sidebarAvatar = document.querySelector('.sidebar-footer .avatar');
  if (sidebarNome) sidebarNome.textContent = nomeCompleto;
  if (sidebarRole) sidebarRole.textContent = `${user.curso} • ${user.instituicao}`;
  if (sidebarAvatar) sidebarAvatar.textContent = iniciais;

  // Topbar
  const topbarAvatar = document.querySelector('.topbar-user-avatar');
  if (topbarAvatar) topbarAvatar.textContent = iniciais;

  // Página de perfil
  const perfilNome = document.querySelector('.perfil-profile-name');
  const perfilAvatar = document.querySelector('.perfil-element-002');
  const perfilInfo = document.querySelector('.perfil-element-006');
  const perfilEmail = document.querySelector('.perfil-row-007');
  if (perfilNome) perfilNome.textContent = nomeCompleto;
  if (perfilAvatar) perfilAvatar.textContent = iniciais;
  if (perfilInfo) perfilInfo.textContent = `${user.curso} • ${user.instituicao}`;
  if (perfilEmail) perfilEmail.innerHTML = `<i class="ti ti-link perfil-icon-008"></i> ${user.email}`;
}