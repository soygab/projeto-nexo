# NEXO

Protótipo da plataforma acadêmica colaborativa NEXO.

## Estrutura

- `index.html`: ponto de entrada da aplicação.
- `public/images/`: imagens e recursos visuais.
- `public/styles/global/`: reset, variáveis, tipografia, utilitários e animações.
- `public/styles/layout/`: estrutura geral, sidebar, topbar, grid e responsividade.
- `public/styles/components/`: componentes visuais reutilizáveis.
- `public/styles/pages/`: estilos específicos de cada página.
- `src/components/`: componentes HTML compartilhados.
- `src/pages/`: páginas carregadas dinamicamente.
- `src/scripts/core/`: inicialização e roteamento.
- `src/scripts/components/`: comportamentos reutilizáveis de componentes.
- `src/scripts/`: ponto de entrada e carregador de componentes.
- `backup/nexo.html`: versão original preservada.

## Execução

Use o Live Server do VS Code ou outro servidor HTTP local. A aplicação utiliza `fetch()` para carregar páginas e componentes, portanto não deve ser aberta diretamente por `file://`.


## Correção da tela de cadastro
A aba "Cadastrar" usa `register-panel is-hidden` inicialmente. `tabs.js` alterna `is-hidden` entre login e cadastro; o CSS não depende mais de `.active` para exibir o cadastro.
