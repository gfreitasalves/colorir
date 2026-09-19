---

description: "Task list template for feature implementation"
---

# Tasks: Temas de Cor da Interface

**Input**: Design documents from `/specs/001-interface-color-themes/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: Não solicitados na spec nem no plano — este projeto não tem suíte de testes
automatizados; a validação é manual, via `quickstart.md` (Princípio V da constituição).

**Organization**: Tarefas agrupadas por user story (spec.md), permitindo implementar e testar cada
uma de forma independente.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode rodar em paralelo (arquivos diferentes, sem dependência de tarefas incompletas)
- **[Story]**: A qual user story a tarefa pertence (US1, US2, US3)
- Caminhos de arquivo exatos em cada descrição

## Path Conventions

Projeto único (SPA React + Vite): `src/`, `docs/` na raiz do repositório — conforme `plan.md`.

---

## Phase 1: Setup

**Purpose**: Criar a base de dados do tema e as variáveis CSS que todas as user stories vão consumir

- [X] T001 [P] Criar `src/data/interfaceThemes.js` exportando um array de objetos
  `{ id, nome, corDestaque }` para os 4 temas definidos em `data-model.md`: `padrao` ("Padrão"),
  `oceano` ("Oceano"), `flor` ("Flor"), `floresta` ("Floresta"). Restrição do data-model a respeitar
  literalmente: "`id` deve ser um dos 4 valores conhecidos" e "o tema `padrao` ... sempre deve
  existir como primeira opção da lista".
- [X] T002 [P] Em `src/index.css`, adicionar os blocos de variáveis CSS de chrome para cada tema,
  seguindo a Decisão 1 de `research.md`: um bloco `:root { --chrome-bg: ...; --chrome-border: ...;
  --chrome-text: ...; --chrome-accent: ...; --chrome-button-bg: ...; }` e `.dark { ... }` com os
  valores atuais (equivalentes aos hardcoded `bg-white`/`border-gray-200`/`text-gray-800` em modo
  claro e `dark:bg-gray-800`/`dark:border-gray-700`/`dark:text-gray-100` em modo escuro, hoje
  espalhados em `Header.jsx`, `Toolbar.jsx` e `Palette.jsx`) para servir de padrão do tema
  `padrao`; e um par de blocos `:root[data-theme="oceano"]` / `.dark[data-theme="oceano"]` (tons de
  azul), `:root[data-theme="flor"]` / `.dark[data-theme="flor"]` (tons de rosa/roxo) e
  `:root[data-theme="floresta"]` / `.dark[data-theme="floresta"]` (tons de verde) com as mesmas
  variáveis.

**Checkpoint**: Dados e variáveis de tema disponíveis para o hook e os componentes consumirem.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Infraestrutura mínima que TODAS as user stories precisam antes de começar

**⚠️ CRITICAL**: Nenhuma user story pode começar antes desta fase estar completa

- [X] T003 Criar `src/hooks/useInterfaceTheme.js`: hook que mantém o estado `theme` (inicializado
  como `'padrao'`), expõe `theme` e `setTheme`, e usa um `useEffect` para aplicar
  `document.documentElement.setAttribute('data-theme', theme)` a cada mudança — espelhando a
  estrutura do `useEffect` de `darkMode` já existente em `App.jsx`. Ainda sem persistência em
  `localStorage` (isso é FR-005, tratado em T011/US2). Depende de T001 (usa os `id`s de
  `interfaceThemes.js` como valores válidos).
- [X] T004 Em `src/App.jsx`, chamar `useInterfaceTheme()` ao lado do estado `darkMode` já existente,
  e repassar `theme`/`setTheme` como props para `Header` (mesmo padrão de props já usado para
  `darkMode`/`onToggleDarkMode`). Depende de T003.

**Checkpoint**: Estado de tema e aplicação do atributo `data-theme` no DOM funcionando — pronto para
as user stories usarem.

---

## Phase 3: User Story 1 - Escolher um tema de cor divertido para a interface (Priority: P1) 🎯 MVP

**Goal**: O usuário troca o tema de cor da interface (Header, Toolbar, Palette, botões) a partir do
cabeçalho, e a paleta de pintura usada para colorir os desenhos permanece inalterada.

**Independent Test**: Cenário 1 de `quickstart.md` — selecionar cada tema (Oceano, Flor, Floresta) e
confirmar visualmente que o chrome muda e a paleta de pintura (as 40 cores) não muda.

### Implementation for User Story 1

- [X] T005 [P] [US1] Criar `src/components/ThemePicker.jsx`: componente que recebe a lista de temas
  (de `src/data/interfaceThemes.js`) e uma função `onSelectTheme(id)`, renderizando um botão/swatch
  por tema (sem indicação de tema ativo ainda — isso é US3). Depende de T001.
- [X] T006 [US1] Em `src/components/Header.jsx`, importar e renderizar `<ThemePicker />` ao lado do
  botão de alternar claro/escuro já existente, ligado a `theme`/`setTheme` recebidos via props
  (FR-003 da spec: "próximo ao botão existente de alternância entre claro e escuro"). Depende de
  T004, T005.
- [X] T007 [P] [US1] Em `src/components/Toolbar.jsx`, substituir as classes Tailwind hardcoded
  (`bg-white`, `border-gray-200`, `dark:border-gray-700`, `dark:bg-gray-800`, `border-gray-300`,
  `text-gray-700`, `hover:bg-gray-100`, `dark:border-gray-600`, `dark:text-gray-100`,
  `dark:hover:bg-gray-700`) pelos utilitários de valor arbitrário que leem as variáveis de chrome
  criadas em T002 (`bg-[var(--chrome-bg)]`, `border-[var(--chrome-border)]`,
  `text-[var(--chrome-text)]` etc.), preservando o visual atual quando `theme === 'padrao'`.
  Depende de T002.
- [X] T008 [P] [US1] Aplicar a mesma substituição de T007 em `src/components/Palette.jsx` (21
  ocorrências de `dark:` hoje) — painel lateral e todos os seus botões de ação passam a usar as
  variáveis de chrome em vez de classes de cor fixas. Depende de T002.
- [X] T009 [US1] Em `src/components/Header.jsx`, aplicar a mesma substituição de T007/T008 no
  próprio cabeçalho e nos botões de mudo/claro-escuro (hoje `border-gray-300`, `dark:border-gray-600`,
  `dark:text-gray-100`, `bg-white`, `dark:bg-gray-800`), para que o cabeçalho também reflita o tema
  selecionado. Depende de T002, T006 (edita o mesmo arquivo).
- [X] T010 [US1] Validar manualmente o Cenário 1 e o Cenário 3 (independência do claro/escuro) de
  `quickstart.md`: alternar entre os 5 temas e entre claro/escuro, confirmando que o chrome muda
  como esperado (FR-001, FR-004, FR-006) e que as cores da paleta de pintura em
  `src/data/presetColors.js` permanecem exatamente as mesmas em todos os casos (FR-002). Depende de
  T006, T007, T008, T009.

**Checkpoint**: A User Story 1 já é funcional e testável de forma independente (MVP).

---

## Phase 4: User Story 2 - Manter o tema escolhido entre sessões (Priority: P2)

**Goal**: A escolha de tema sobrevive a fechar/reabrir o navegador, com o mesmo mecanismo já usado
pelo modo escuro.

**Independent Test**: Cenário 2 de `quickstart.md` — selecionar um tema, recarregar/reabrir o
navegador e confirmar que o tema persiste; limpar o `localStorage` e confirmar volta ao tema
`padrao`.

### Implementation for User Story 2

- [X] T011 [US2] Estender `src/hooks/useInterfaceTheme.js` (criado em T003) para: (a) inicializar o
  estado `theme` lendo `localStorage.getItem('colorir:theme')`; (b) validar o valor lido contra os
  `id`s conhecidos de `src/data/interfaceThemes.js`, usando `'padrao'` como fallback quando o valor
  estiver ausente, corrompido ou não reconhecido — regra de `data-model.md`: "qualquer outro valor
  lido de `localStorage` ... é tratado como `padrao`" (FR-007); (c) persistir `theme` de volta em
  `localStorage.setItem('colorir:theme', theme)` a cada mudança, via `useEffect`, mesmo padrão já
  usado por `colorir:darkMode` em `App.jsx`. Depende de T003.

**Checkpoint**: User Stories 1 e 2 funcionando juntas — tema muda o chrome e persiste entre sessões.

---

## Phase 5: User Story 3 - Ver e alternar entre os temas a partir do cabeçalho (Priority: P3)

**Goal**: O usuário identifica facilmente o seletor de tema perto do botão de claro/escuro e vê qual
tema está ativo no momento.

**Independent Test**: Cenário 4 de `quickstart.md` — abrir o seletor de tema no cabeçalho (galeria e
editor) e confirmar que o tema ativo aparece destacado.

### Implementation for User Story 3

- [X] T012 [US3] Em `src/components/ThemePicker.jsx`, adicionar a prop `theme` (tema atualmente
  ativo) e destacar visualmente (ex.: borda/anel ou marca de seleção) o botão correspondente ao
  tema ativo (FR-008). Depende de T005, T006.
- [X] T013 [US3] Em `src/components/ThemePicker.jsx`, adicionar `aria-label`/`title` descritivos em
  cada botão de tema (ex.: `"Tema Oceano"`), seguindo o mesmo padrão já usado nos botões de
  claro/escuro e mudo em `Header.jsx` (`aria-label`/`title`). Depende de T005.

**Checkpoint**: Todas as user stories funcionando de forma independente e integrada.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Documentação (Princípio IV) e validação final (Princípio V)

- [X] T014 [P] Criar `docs/temas-de-interface.md` documentando a feature (como funciona, arquivos
  envolvidos, decisão técnica de variáveis CSS + `data-theme`), seguindo o padrão dos arquivos já
  existentes em `docs/` (ex. `docs/modo-escuro.md`).
- [X] T015 [P] Adicionar link para `docs/temas-de-interface.md` em `docs/README.md` e um item na
  lista de funcionalidades de `README.md` (seção `#funcionalidades`), conforme Princípio IV da
  constituição.
- [X] T016 Rodar `npm run build` e corrigir qualquer erro antes de prosseguir.
- [X] T017 Rodar `npm run preview` e validar manualmente TODOS os cenários de `quickstart.md` em
  viewport desktop e mobile (Princípio V — inclui a seção "Validação mobile" do quickstart, com o
  seletor de tema e a gaveta de paleta no celular).
- [X] T018 Commit na branch de trabalho e push, seguindo o fluxo de Git/PR do projeto
  (`docs/deploy.md`).

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Sem dependências — pode começar imediatamente.
- **Foundational (Phase 2)**: Depende do Setup (T001) — bloqueia todas as user stories.
- **User Story 1 (Phase 3)**: Depende do Foundational (Phase 2) e de T002 (Setup).
- **User Story 2 (Phase 4)**: Depende do Foundational (Phase 2), especificamente de T003; pode ser
  feita em paralelo à Phase 3 por outra pessoa, mas ambas tocam `useInterfaceTheme.js` em momentos
  diferentes (T003 cria, T011 estende) — na prática, mais simples fazer a Phase 4 logo após a Phase
  2, antes ou depois da Phase 3.
- **User Story 3 (Phase 5)**: Depende de T005/T006 (Phase 3) — precisa do `ThemePicker` e da sua
  integração no `Header` já existirem.
- **Polish (Phase 6)**: Depende de todas as user stories desejadas estarem completas.

### User Story Dependencies

- **User Story 1 (P1)**: Nenhuma dependência de outras stories — é o MVP.
- **User Story 2 (P2)**: Não depende de US1 para funcionar (a persistência funciona mesmo que o
  chrome ainda não reflita visualmente o tema), mas só é observável de fato depois que US1 estiver
  pronta.
- **User Story 3 (P3)**: Depende dos componentes criados em US1 (`ThemePicker`, integração no
  `Header`) — não é totalmente independente no código, mas é uma melhoria isolada sobre eles.

### Parallel Opportunities

- T001 e T002 (Setup) podem rodar em paralelo — arquivos diferentes.
- Dentro da User Story 1: T005 (novo arquivo `ThemePicker.jsx`), T007 (`Toolbar.jsx`) e T008
  (`Palette.jsx`) podem rodar em paralelo entre si.
- T014 e T015 (Polish) podem rodar em paralelo — arquivos diferentes.

---

## Parallel Example: User Story 1

```bash
# Depois do Foundational (Phase 2) completo, em paralelo:
Task: "Criar src/components/ThemePicker.jsx (T005)"
Task: "Atualizar src/components/Toolbar.jsx para usar variáveis de chrome (T007)"
Task: "Atualizar src/components/Palette.jsx para usar variáveis de chrome (T008)"
# Depois, sequencialmente (mesmo arquivo Header.jsx):
Task: "Integrar ThemePicker no Header.jsx (T006)"
Task: "Atualizar classes do próprio Header.jsx (T009)"
```

---

## Implementation Strategy

### MVP First (User Story 1 apenas)

1. Completar Phase 1: Setup (T001, T002)
2. Completar Phase 2: Foundational (T003, T004)
3. Completar Phase 3: User Story 1 (T005–T010)
4. **Parar e validar**: rodar o Cenário 1 e 3 de `quickstart.md` manualmente
5. Nesse ponto já existe uma feature demonstrável: trocar de tema muda a interface sem afetar a
   pintura (falta apenas persistência e o destaque do tema ativo)

### Incremental Delivery

1. Setup + Foundational → base pronta
2. User Story 1 → validar → já demonstrável (MVP)
3. User Story 2 → validar persistência → sem regressão na US1
4. User Story 3 → validar destaque visual do tema ativo → sem regressão nas US1/US2
5. Polish → documentação (Princípio IV) + build/preview + validação mobile (Princípio V) + commit/push

---

## Notes

- [P] = arquivos diferentes, sem dependência entre si
- [Story] mapeia a tarefa à user story correspondente para rastreabilidade
- Sem testes automatizados neste projeto — a validação de cada checkpoint é manual, via
  `quickstart.md`
- Fazer commit após cada fase/checkpoint concluído, não só no final (T018 é o commit/push final,
  mas nada impede commits intermediários por fase, se preferido)
- Nunca alterar `src/data/presetColors.js` nesta feature — é fora de escopo (paleta de pintura)
