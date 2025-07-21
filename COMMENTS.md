## 📌 Decisões de implementação

### 🧱 Escolha da Interface

Optei por utilizar React para facilitar o gerenciamento do DOM. Com JavaScript puro (vanilla), seria necessário escrever múltiplas funções imperativas para inserir, atualizar e remover elementos, o que complicaria tanto a leitura quanto a manutenção do código.

### 📦 Escolha de bibliotecas

Utilizei o mínimo possível de bibliotecas para demonstrar minha capacidade técnica em construir soluções do zero. Acredito que a escolha de dependências deve sempre considerar o contexto e a necessidade específica do projeto, não existe “bala de prata”.
Para um cenário mais robusto e escalável, eu teria considerado bibliotecas como:

- `Axios`: Cliente HTTP com recursos como interceptors
- `Zustand`: Gerenciamento de estado global simples
- `TanStack Query`: Controle de requisições, cache e estados
- `TanStack Table`: Tabelas complexas com paginação, ordenação e filtros

### 📁 Orgnização de pastas

Segui uma estrutura de pastas simples e intuitiva, proporcional à complexidade do projeto. A separação inclui:

```
components/   → Componentes reutilizáveis
constants/    → Constantes centralizadas
hooks/        → Hooks reutilizáveis
lib/          → Funções utilitárias ou lógicas específicas
pages/        → Entrypoints de páginas
services/     → Comunicação com a API
utils/        → Funções auxiliares (formatação, validações, etc)
```

### 🎬 Redirecionamento para o IMDB

A API do TMDB não retorna o ID do IMDB diretamente na busca. Para contornar isso, optei por realizar uma nova requisição ao selecionar um item e exibir um modal de “Redirecionando...”. Caso a API falhe existe um fallback para o usuário ser levado para uma busca no próprio IMDB com base no termo digitado.

### 🧹 Refatorações durante o desenvolvimento

Conforme o projeto crescia, alguns componentes começaram a concentrar muita lógica e JSX. Por isso, separei responsabilidades para manter legibilidade. Um exemplo foi o MovieSearchBar, que originou componentes menores como NoResultsMessage e MoviesSuggestionList.

### 🐳 Docker + Makefile

Implementei um Dockerfile e docker-compose para facilitar a execução do projeto, permitindo rodar com um único comando. Também criei um Makefile com uma task setup para gerar .env.local dinamicamente, usando uma variável de ambiente (TMDB_TOKEN) com fallback padrão caso não seja fornecida.

### 🌟 Extras

- `Dark mode`: Implementado com suporte à preferência do sistema e persistência no localStorage. Há um botão de toggle para alternância manual.
- `Testes automatizados`: Escrevi testes para garantir a confiabilidade dos componentes e comportamentos principais.
- `Modal de confirmação`: Para evitar exclusões acidentais, adicionei um modal de confirmação ao remover favoritos.

### 💡 Ideias de para implementação

- `Internacionalização (i18n)`: Planejei adicionar um seletor de idioma (PT/EN/ES) com adaptação dos textos da interface e também nas chamadas para a API da TMDB. Essa funcionalidade não foi implementada devido ao tempo disponível.
