# Nexo

> Projeto desenvolvido para o **1º Hackathon da UGB** (Centro Universitário UGB)

## Sobre o projeto

O **Nexo** nasceu de um problema simples, mas que afeta boa parte da vida acadêmica: a comunicação ineficiente entre alunos sobre o que estão desenvolvendo.

Mesmo estando cercados de colegas de cursos diferentes, a divulgação de projetos em andamento é precária. Muitas vezes, a ajuda de que você precisa para avançar em um trabalho está literalmente ao seu lado — só que você não sabe.

Ao mesmo tempo, existe um enorme potencial em acompanhar o desenvolvimento de diferentes áreas do conhecimento, especialmente em um cenário de constante avanço tecnológico, onde a troca entre cursos pode acelerar aprendizado e inovação.

O Nexo propõe resolver isso funcionando como um **"GitHub acadêmico"**: uma plataforma de integração entre alunos, pensada para ser implementada em qualquer faculdade, com o objetivo de conectar pessoas e conhecimento — aproximando quem tem uma dúvida de quem tem a resposta, e quem tem um projeto de quem quer contribuir com ele.

## Objetivo

Facilitar a troca de conhecimento e a colaboração entre estudantes de diferentes cursos, tornando visível o que está sendo produzido dentro da própria instituição e reduzindo a distância entre quem precisa de ajuda e quem pode oferecê-la.

## Funcionalidades principais

### Hub Inicial
Feed central com as publicações da comunidade — projetos novos, artigos, dúvidas e pedidos de colaboração — além de um painel com estatísticas em tempo real (projetos ativos, estudantes conectados, discussões abertas, instituições participantes), tópicos em alta e projetos em destaque.

### Explorar Projetos
Página de descoberta com busca e filtros por área (IA/ML, IoT, Saúde, Sustentabilidade, Educação, Dados, Robótica), status e relevância. Cada projeto exibe um card com descrição, barra de progresso, número de colaboradores, estrelas, commits e tecnologias utilizadas.

### Meus Projetos
Página de projeto no estilo **GitHub acadêmico**, com:
- **Visão Geral**: descrição, progresso geral e tags de tecnologia.
- **Timeline do Projeto**: marcos e etapas concluídas/em andamento.
- **Commits**: histórico de atualizações feitas pelos colaboradores.
- **Colaboradores**: lista de membros, papéis (líder, dev, dados etc.) e contribuição individual.
- **Discussões e Comentários**: espaço para tirar dúvidas e discutir soluções diretamente no projeto.

### Oportunidades Acadêmicas
Mural de bolsas de iniciação científica, monitorias e hackathons (nacionais e internacionais), com prazos, requisitos, tags de área e botão de candidatura direta.

### Eventos & Palestras
Calendário de hackathons, workshops, palestras e semanas acadêmicas, com destaque para o evento principal, inscrições e um espaço de **ideias da comunidade**, onde os usuários sugerem e votam em futuros eventos.

### Chat
Comunicação direta entre estudantes para tirar dúvidas pontuais ou alinhar detalhes de colaboração em projetos.

### Versão Mobile
Acesso à plataforma também via aplicativo mobile, mantendo a comunidade conectada fora do desktop.

## Proposta de escalabilidade

O Nexo foi pensado para não ficar restrito a uma única instituição. A ideia é que a plataforma possa ser adotada por diferentes faculdades, criando redes de colaboração acadêmica que aproveitem ao máximo o conhecimento disponível dentro (e, futuramente, entre) as instituições.

## Sobre o hackathon

Este projeto foi idealizado e desenvolvido durante o **1º Hackathon da UGB**, como resposta ao desafio de propor soluções inovadoras para problemas do dia a dia acadêmico. Mesmo com pouco tempo, conseguimos entregar um protótipo interativo e apresentar nossas ideias com clareza e objetivo.

## Status

Organização e estrutura do código, dando funcionalidade e implementando novas tecnologias.

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
