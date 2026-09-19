---

description: "Task list template for feature implementation"
---

# Tasks: Editor em Estilo de Ateliê (Cavalete + Paleta de Artista)

**Input**: Design documents from `/specs/003-cavalete-paleta-artista/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: Não solicitados na spec — este projeto não tem suíte de testes automatizados; a
validação é manual, via `quickstart.md` (Princípio V da constituição).

**Organization**: Tarefas agrupadas pelas 2 user stories da spec (ambas P1), permitindo implementar
e testar cada uma de forma independente.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode rodar em paralelo (arquivos diferentes, sem dependência de tarefas incompletas)
- **[Story]**: A qual user story a tarefa pertence (US1 = cavalete, US2 = paleta de artista)
- Caminhos de arquivo exatos em cada descrição

## Path Conventions

Projeto único (SPA React + Vite): `src/`, `docs/` na raiz do repositório — conforme `plan.md`.

---

## Phase 1: Setup

**Purpose**: Criar a base visual (tokens de madeira + módulo de ícones de decoração) que as duas
user stories vão consumir

- [ ] T001 [P] Em `src/index.css`, adicionar as variáveis `--studio-wood-base`, `--studio-wood-dark`
  e `--studio-wood-shadow` em `:root` e em `.dark`, seguindo o Token "Paleta de Madeira do Ateliê"
  de `data-model.md`. Regra a respeitar literalmente: "estas variáveis NÃO são redefinidas por
  `[data-theme=\"...\"]` — permanecem com o mesmo valor em Padrão/Oceano/Flor/Floresta, mudando
  apenas entre claro (`:root`) e escuro (`.dark`)".
- [ ] T002 [P] Criar `src/components/icons/StudioDecorIcons.jsx` (mesmo padrão de
  `PaletteBrushIcons.jsx`/`ActionIcons.jsx`) com um `<defs>`/pattern SVG reutilizável de veio de
  madeira (`WoodGrainPattern`), consumido tanto pela decoração do cavalete quanto pela paleta de
  artista.

**Checkpoint**: Tokens de madeira e módulo de ícones prontos para as duas user stories consumirem.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Classes utilitárias de CSS compartilhadas pelas duas user stories

**⚠️ CRITICAL**: Nenhuma user story pode começar antes desta fase estar completa

- [ ] T003 Em `src/index.css`, adicionar as classes utilitárias `.studio-wood-surface` (gradiente de
  madeira usando `--studio-wood-*` + referência ao `WoodGrainPattern` de T002 + `box-shadow` usando
  `--studio-wood-shadow`) e `.studio-paint-blob` (`border-radius` assimétrico simulando um pingo de
  tinta + gradiente radial de brilho/gloss), reutilizáveis tanto pelo cavalete (`Canvas.jsx`) quanto
  pela paleta de artista (`Palette.jsx`). Depende de T001, T002.

**Checkpoint**: Classes de decoração compartilhadas prontas — user stories podem começar.

---

## Phase 3: User Story 1 - Colorir com a imagem "num cavalete" (Priority: P1)

**Goal**: A área de desenho aparece visualmente apoiada sobre um cavalete de pintor realista, sem
nenhuma mudança de comportamento em zoom/pan/clique/ferramentas.

**Independent Test**: Cenário 1 de `quickstart.md` — abrir um desenho, ver o cavalete ao redor da
imagem, e confirmar que zoom, arraste, clique para preencher, borracha e adesivo continuam
funcionando exatamente como antes.

### Implementation for User Story 1

- [ ] T004 [US1] Em `src/components/icons/StudioDecorIcons.jsx`, adicionar os componentes
  `EaselLegs` (pernas/apoio triangular do cavalete, visíveis abaixo da área de desenho) e
  `EaselLedge` (barra de apoio/sulco de madeira logo abaixo da imagem, como a calha onde um quadro
  real se apoiaria), seguindo o padrão `size`/`className` já usado pelos ícones existentes. Depende
  de T002.
- [ ] T005 [US1] Em `src/components/Canvas.jsx`, envolver o `<div ref={scrollRef}>` existente (que
  hoje já cuida de zoom/pan/toque, linhas 124-140) com uma nova camada decorativa externa: um fundo
  de "chão de ateliê" atrás do canvas, `EaselLedge` logo abaixo da área de scroll e `EaselLegs`
  abaixo disso, usando `.studio-wood-surface` (T003). Regra de `data-model.md` a respeitar
  literalmente: "nenhum elemento do cavalete tem `pointer-events` habilitado sobre a área de
  desenho — `pointer-events: none` nos elementos puramente decorativos". O `<div ref={scrollRef}>`
  e a `<div>` com `onClick={handleClick}` internos NÃO DEVEM ser alterados (mesmas classes de
  overflow/zoom/touch de hoje). Depende de T003, T004.
- [ ] T006 [US1] Ajustar a decoração de T005 para caber em telas pequenas: simplificar/ocultar
  `EaselLegs` em viewports estreitos (ex. `hidden sm:block`) mantendo `EaselLedge` e o fundo de
  ateliê, para não cortar a imagem nem empurrar controles para fora da tela em mobile — atende
  FR-007 ("simplificando detalhes decorativos ... apenas quando necessário para caber na tela
  pequena, sem remover a identidade visual de cavalete/paleta"). Depende de T005.
- [ ] T007 [US1] Validar manualmente o Cenário 1 de `quickstart.md` em desktop e mobile: abrir um
  desenho, confirmar o cavalete visível, e testar zoom (botões, `Ctrl`+roda, pinça), arraste da
  imagem ampliada, clique para preencher, e as ferramentas "Borracha"/"Adesivos" — tudo deve
  funcionar exatamente como antes (FR-002). Depende de T005, T006.

**Checkpoint**: User Story 1 funcional e testável de forma independente.

---

## Phase 4: User Story 2 - Escolher cores numa "paleta de artista" (Priority: P1)

**Goal**: A seção de seleção de cor no painel lateral tem aparência de paleta de pintor realista,
sem perder acesso a nenhuma cor/família/histórico existente.

**Independent Test**: Cenário 2 de `quickstart.md` — abrir o painel lateral com "Balde"/"Borracha"
ativo, ver a paleta de artista, e confirmar que todas as cores, o padrão de preenchimento, a cor
personalizada, a cor atual e o histórico continuam acessíveis e funcionando.

### Implementation for User Story 2

- [ ] T008 [P] [US2] Em `src/components/icons/StudioDecorIcons.jsx`, adicionar o componente
  `PaletteThumbHole` (SVG do "furo de polegar" decorativo de uma paleta de pintor, para um canto do
  contorno). Regra de `data-model.md` a respeitar literalmente: "o furo de polegar e o contorno são
  puramente decorativos — não recebem `onClick` nem alteram a ordem de tabulação/leitura por teclado
  da seção de cores". Depende de T002.
- [ ] T009 [US2] Em `src/components/Palette.jsx`, envolver o bloco existente da seção "Paleta de
  Cores" (linhas 110-125 da versão atual: título + grade de `colorFamilies`) num novo container com
  `.studio-wood-surface` (T003), `border-radius` assimétrico lembrando o contorno oval de uma paleta
  real, e o `PaletteThumbHole` (T008) posicionado num canto. A disposição interna das cores
  CONTINUA a mesma grade responsiva por família já existente — não espalhar os swatches livremente
  (Decisão 3 de `research.md`). Depende de T003, T008.
- [ ] T010 [US2] Em `src/components/Palette.jsx`, atualizar o componente `Swatch` (linhas 6-19) para
  usar a classe `.studio-paint-blob` (T003) no lugar do círculo simples atual. Regras de
  `data-model.md` a respeitar literalmente: "o alvo de toque/clique do blob DEVE continuar com a
  mesma área mínima já usada hoje pelo `Swatch` circular" e "a cor de fundo do próprio blob continua
  sendo o hex da cor de pintura ..., nunca influenciada pela paleta de madeira do ateliê nem pelos
  temas de interface". Depende de T003.
- [ ] T011 [US2] Em `src/components/Palette.jsx`, dar um acabamento visual de ateliê aos elementos
  complementares da seção de cores — botão "Preenchimento" (padrão sólido/bolinhas/listras), "+ Cor
  Personalizada", "Atual" e "Histórico" (linhas 127-171 da versão atual) —, mantendo-os dentro ou
  visualmente conectados ao contorno de paleta de T009 (ex.: "Atual" como um pingo extra sobre a
  paleta), sem remover nenhum desses controles nem mudar seu comportamento. Depende de T009, T010.
- [ ] T012 [US2] Confirmar que a seção "Adesivos" (quando essa ferramenta está ativa, linhas 88-107
  da versão atual) mantém a exibição em grade já existente, sem nenhum tratamento de
  "paleta de artista" — verificação visual, sem mudança de código esperada (FR-006).
- [ ] T013 [US2] Validar manualmente o Cenário 2 de `quickstart.md` em desktop e mobile: escolher
  cores de famílias diferentes, usar "+ Cor Personalizada", conferir "Atual" e o histórico, e
  confirmar que a ferramenta "Adesivos" não foi afetada (FR-004, FR-006). Depende de T011, T012.

**Checkpoint**: User Stories 1 e 2 funcionando juntas — cavalete e paleta de artista completos.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Zero regressão nas demais seções, legibilidade nos temas existentes, documentação
(Princípio IV) e validação final (Princípio V)

- [ ] T014 [P] Validar manualmente o Edge Case de `quickstart.md` (Cenário 3): "Ações", "Ferramenta",
  "Zoom" e "Terminei!" continuam presentes e funcionando normalmente, fora da área estilizada como
  paleta (FR-005).
- [ ] T015 [P] Validar manualmente o Cenário 4 de `quickstart.md`: alternar entre os 4 temas de
  interface (Padrão/Oceano/Flor/Floresta) e claro/escuro (8 combinações), confirmando que o cavalete
  e a paleta permanecem legíveis e a madeira não muda de cor com o tema (FR-008, Decisão 4 de
  `research.md`).
- [ ] T016 [P] Criar `docs/estudio-cavalete-paleta.md` documentando a feature (cavalete, paleta de
  artista, decisão de manter a madeira fora dos temas de interface, decisão de manter a grade de
  cores em vez de dispersão livre), seguindo o padrão dos arquivos já existentes em `docs/`.
- [ ] T017 Atualizar `docs/painel-lateral.md` para descrever a nova aparência de paleta de artista na
  seção de cores (a ordem das seções, definida na feature 002, continua a mesma — só a aparência da
  seção de cores muda).
- [ ] T018 [P] Adicionar link para `docs/estudio-cavalete-paleta.md` em `docs/README.md` e um item na
  lista de funcionalidades de `README.md` (seção `#funcionalidades`).
- [ ] T019 Rodar `npm run build` e corrigir qualquer erro antes de prosseguir.
- [ ] T020 Rodar `npm run preview` e validar manualmente TODOS os cenários de `quickstart.md`
  (incluindo a seção "Validação mobile") em viewport desktop e mobile.
- [ ] T021 Commit na branch de trabalho e push, seguindo o fluxo de Git/PR do projeto
  (`docs/deploy.md`).

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Sem dependências — pode começar imediatamente.
- **Foundational (Phase 2)**: Depende do Setup (T001, T002) — bloqueia as duas user stories.
- **User Story 1 (Phase 3)** e **User Story 2 (Phase 4)**: Ambas dependem do Foundational (Phase 2);
  são independentes entre si (arquivos diferentes: `Canvas.jsx` vs `Palette.jsx`) e podem ser feitas
  em paralelo por pessoas diferentes, ou em qualquer ordem por uma só pessoa.
- **Polish (Phase 5)**: Depende das duas user stories estarem completas.

### User Story Dependencies

- **User Story 1 (P1 — cavalete)**: Nenhuma dependência da User Story 2.
- **User Story 2 (P1 — paleta de artista)**: Nenhuma dependência da User Story 1.

### Parallel Opportunities

- T001 e T002 (Setup) podem rodar em paralelo — arquivos diferentes.
- Depois do Foundational, a Phase 3 (US1, em `Canvas.jsx`) inteira pode rodar em paralelo à Phase 4
  (US2, em `Palette.jsx`) — nenhuma tarefa de uma depende de arquivos da outra.
- Dentro da Phase 4: T008 pode começar em paralelo a T004 (ambas mexem só em
  `StudioDecorIcons.jsx`, mas em componentes diferentes dentro do arquivo — cuidado ao mesclar).
- T014, T015, T016, T018 (Polish) podem rodar em paralelo entre si.

---

## Parallel Example: Setup + as duas User Stories

```bash
# Setup (em paralelo):
Task: "Adicionar variáveis --studio-wood-* em src/index.css (T001)"
Task: "Criar StudioDecorIcons.jsx com WoodGrainPattern (T002)"

# Depois do Foundational (T003), em paralelo:
Task: "Cavalete ao redor do Canvas.jsx (User Story 1: T004-T007)"
Task: "Paleta de artista no Palette.jsx (User Story 2: T008-T013)"
```

---

## Implementation Strategy

### Ordem sugerida

Como as duas user stories têm a mesma prioridade (P1) e são tecnicamente independentes (arquivos
diferentes), não há uma "MVP" única — as duas juntas entregam o pedido original ("cavalete" +
"paleta de artista"). Sugestão:

1. Completar Phase 1 (Setup) e Phase 2 (Foundational) — base de decoração pronta.
2. Completar Phase 3 (User Story 1 — cavalete) e validar (T007).
3. Completar Phase 4 (User Story 2 — paleta de artista) e validar (T013).
4. Completar Phase 5 (Polish) — regressões, temas, documentação, build/preview, commit/push.

### Incremental Delivery

1. Setup + Foundational → tokens de madeira e ícones prontos.
2. User Story 1 → cavalete visível e validado → já demonstrável isoladamente.
3. User Story 2 → paleta de artista visível e validada → sem regressão na US1.
4. Polish → documentação (Princípio IV) + build/preview + validação mobile/temas (Princípio V) +
   commit/push.

---

## Notes

- [P] = arquivos diferentes, sem dependência entre si
- [Story] mapeia a tarefa à user story correspondente para rastreabilidade
- Sem testes automatizados neste projeto — a validação de cada checkpoint é manual, via
  `quickstart.md`
- Nunca alterar `src/data/presetColors.js` nem os valores hex das cores de pintura nesta feature —
  é fora de escopo (a decoração de ateliê nunca influencia as cores disponíveis para colorir)
- As variáveis `--chrome-*` (temas de interface, feature 001) e `--studio-wood-*` (esta feature) são
  independentes — nunca misturar as duas nem redefinir `--studio-wood-*` dentro de um bloco
  `[data-theme="..."]`
