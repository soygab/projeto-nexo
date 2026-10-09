import { getCurrentUser, apiRequest, saveUser } from './auth.js';
export function renderUserData() {
  const user = getCurrentUser();
  if (!user) return;
  const name = [user.first_name,user.last_name].filter(Boolean).join(' ') || user.email;
  const initials = ((user.first_name?.[0] || user.email[0]) + (user.last_name?.[0] || '')).toUpperCase();
  const academic = [user.curso,user.instituicao].filter(Boolean).join(' • ');
  for (const [selector, text] of Object.entries({
    '.sidebar-footer .u-name':name, '.sidebar-footer .u-role':academic,
    '.sidebar-footer .avatar':initials, '.topbar-user-avatar':initials,
    '.perfil-profile-name':name, '.perfil-element-002':initials,
    '.perfil-element-006':academic, '.perfil-row-007':user.email,
    '.perfil-description-010':user.bio || 'Conte um pouco sobre você editando seu perfil.'
  })) {
    const element = document.querySelector(selector);
    if (element) element.textContent = text;
  }
  const interests = document.getElementById('profile-interests');
  if (interests) {
    interests.replaceChildren();
    const colors = ['blue', 'orange', 'purple', 'green', 'gray'];
    const tags = (user.interests || '').split(',').map(tag => tag.trim()).filter(Boolean);
    tags.forEach((text, index) => {
      const tag = document.createElement('span');
      tag.className = 'tag tag-' + colors[index % colors.length];
      tag.textContent = text;
      interests.append(tag);
    });
    if (!tags.length) interests.textContent = 'Adicione seus interesses em Editar Perfil.';
  }
  document.querySelectorAll('#profile-form [name]').forEach(input => { input.value = user[input.name] || ''; });
  const activity = user.activity || {};
  const counts = {projects: (activity.projects || []).length,
    contributions: (activity.contributions || []).length,
    followers: activity.followers_count || 0, following: activity.following_count || 0};
  document.querySelectorAll('[data-profile-stat]').forEach(element => {
    element.textContent = counts[element.dataset.profileStat];
  });
}

export function showProfileActivity(tab) {
  const messages = {projects: 'Nenhum projeto cadastrado ainda.',
    contributions: 'Nenhuma contribuição registrada ainda.', badges: 'Você ainda não possui conquistas.'};
  if (!messages[tab]) return;
  document.querySelectorAll('[data-profile-tab]').forEach(button => {
    button.classList.toggle('active', button.dataset.profileTab === tab);
  });
  document.getElementById('profile-activity').textContent = messages[tab];
}
export async function saveProfile(form) {
  const button = form.querySelector('[type=submit]');
  const message = document.getElementById('profile-message');
  button.disabled = true;
  form.querySelector('[data-action="cancel-profile"]').disabled = true;
  message.textContent = 'Salvando...';
  try {
    const user = await apiRequest('/me/', {method:'PATCH', body:JSON.stringify(Object.fromEntries(new FormData(form)))});
    saveUser(user);
    renderUserData();
    toggleProfileEditor(false);
    document.getElementById('profile-save-status').textContent = 'Perfil atualizado com sucesso.';
  } catch (error) { message.textContent = error.message; }
  finally {
    button.disabled = false;
    form.querySelector('[data-action="cancel-profile"]').disabled = false;
  }
}

export function toggleProfileEditor(open) {
  const editor = document.getElementById('profile-editor');
  const trigger = document.getElementById('profile-edit-button');
  if (!editor || !trigger) return;
  renderUserData();
  document.getElementById('profile-message').textContent = '';
  document.getElementById('profile-save-status').textContent = '';
  editor.classList.toggle('is-hidden', !open);
  trigger.setAttribute('aria-expanded', String(open));
  trigger.disabled = open;
  if (open) editor.querySelector('input').focus();
  else trigger.focus();
}
