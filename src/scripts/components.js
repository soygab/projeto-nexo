// NEXO - carregamento de componentes HTML
export async function loadComponent(selector, url) {
  const target = document.querySelector(selector);
  if (!target) return null;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Falha ao carregar ${url}: ${response.status}`);
  target.innerHTML = await response.text();
  return target;
}
