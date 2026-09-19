# Feature Specification: Editor em Estilo de Ateliê (Cavalete + Paleta de Artista)

**Feature Branch**: `003-cavalete-paleta-artista`

**Created**: 2026-09-19

**Status**: Draft

**Input**: User description: "queria uma interfave que a imaem estivese numa especie de cavalete e a paleta de ferramentas como se fosse um paleta de cores de uma artista"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Colorir com a imagem "num cavalete" (Priority: P1)

Como usuário no editor de colorir, quero que o desenho apareça apoiado em algo parecido com um
cavalete de pintor (em vez de simplesmente flutuar sobre o fundo), para que a experiência pareça
mais com a de um artista de verdade pintando um quadro.

**Why this priority**: É a primeira metade do pedido do usuário e a parte mais visível da tela —
sem ela, a "sensação de ateliê" não existe.

**Independent Test**: Pode ser testado abrindo qualquer desenho no editor e observando visualmente
que a área de desenho tem uma moldura/apoio decorativo lembrando um cavalete, tanto em desktop
quanto em mobile.

**Acceptance Scenarios**:

1. **Given** o usuário abre um desenho para colorir, **When** a tela do editor é exibida, **Then** a
   imagem aparece dentro de uma moldura decorativa que lembra um cavalete de pintor, em vez do fundo
   simples atual.
2. **Given** o usuário está desenhando/colorindo normalmente, **When** ele usa zoom, arrasta a
   imagem ampliada ou clica para pintar, **Then** todas as interações continuam funcionando
   exatamente como antes — a moldura de cavalete é apenas visual, sem interferir na área clicável do
   desenho.

---

### User Story 2 - Escolher cores numa "paleta de artista" (Priority: P1)

Como usuário escolhendo uma cor para pintar, quero que a área de seleção de cor no painel lateral
pareça uma paleta de pintor de verdade (a peça de madeira ovalada com pingos de tinta), em vez da
grade de círculos atual, para reforçar a sensação de estar numa oficina de arte.

**Why this priority**: É a segunda metade do pedido do usuário, igualmente central à ideia de
"ateliê" — sem ela, só o cavalete não entrega a experiência completa pedida.

**Independent Test**: Pode ser testado abrindo o editor e observando que a seção de seleção de cor
no painel lateral tem a aparência de uma paleta de artista (formato/textura lembrando madeira e
pingos de tinta), mas continua permitindo escolher qualquer uma das cores/tons já disponíveis hoje.

**Acceptance Scenarios**:

1. **Given** o usuário abre o painel lateral com a ferramenta "Balde" ou "Borracha" ativa, **When**
   ele olha para a seção de cores, **Then** ela tem a aparência de uma paleta de artista (em vez da
   grade de círculos simples atual), mas continua mostrando todas as famílias/tons de cor
   disponíveis hoje.
2. **Given** a nova aparência de paleta de artista, **When** o usuário toca/clica em uma cor,
   **Then** a cor é selecionada exatamente como acontece hoje — nenhuma cor fica inacessível ou mais
   difícil de escolher por causa do novo visual.

---

### Edge Cases

- O que acontece com o restante do painel lateral (Ações, Ferramenta, Zoom, "Terminei!") quando a
  seção de cores vira uma "paleta de artista"? Eles continuam existindo com sua aparência de botões
  atual, fora da área estilizada como paleta.
- O que acontece em telas pequenas (mobile, onde a paleta abre como gaveta)? A "paleta de artista"
  se adapta ao espaço disponível na gaveta, sem cortar cores nem exigir rolagem horizontal.
- O que acontece com os adesivos (quando a ferramenta "Adesivos" está ativa)? Mantêm sua exibição
  atual (grade de adesivos) — o tratamento de "paleta de artista" é específico da seleção de cor.
- A moldura de cavalete e a paleta de artista precisam continuar legíveis nos temas de cor de
  interface já existentes (Padrão, Oceano, Flor, Floresta) e no modo claro/escuro.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O editor DEVE exibir a área de desenho apoiada visualmente sobre um cavalete de pintor
  de aparência realista — com pernas/apoio visíveis, textura lembrando madeira e sombra —, mantendo
  o desenho totalmente visível e clicável como hoje.
- **FR-002**: A moldura de cavalete NÃO DEVE alterar nenhum comportamento existente da área de
  desenho (zoom, pan/arraste, clique para preencher, ferramentas de borracha/adesivo).
- **FR-003**: O painel lateral DEVE exibir a seção de seleção de cor com uma aparência realista de
  paleta de artista — formato oval de madeira, textura, sombra, e as cores dispostas como "pingos de
  tinta" sobre a paleta —, no lugar da grade de círculos simples usada hoje.
- **FR-004**: A nova aparência de paleta de artista DEVE continuar dando acesso a todas as
  famílias/tons de cor, ao seletor de padrão de preenchimento, ao botão de cor personalizada, à cor
  atual e ao histórico — nenhuma funcionalidade de seleção de cor pode ser removida.
- **FR-005**: As seções "Ações", "Ferramenta", "Zoom" e "Terminei!" do painel lateral DEVEM
  continuar existindo e funcionando como hoje, podendo ganhar elementos decorativos condizentes com
  o ateliê (ex.: apoiados perto de pincéis ilustrados), mas sem perder clareza de uso.
- **FR-006**: Quando a ferramenta "Adesivos" estiver ativa, a seção de adesivos DEVE manter sua
  exibição atual (grade de adesivos), sem o tratamento visual de "paleta de artista".
- **FR-007**: O novo visual (cavalete e paleta de artista) DEVE se adaptar corretamente tanto ao
  painel lateral fixo (desktop) quanto à gaveta de ferramentas (mobile), sem cortar conteúdo nem
  exigir rolagem horizontal para ver as cores — inclusive a versão realista/imersiva, simplificando
  detalhes decorativos (sombras, espessura da textura) apenas quando necessário para caber na tela
  pequena, sem remover a identidade visual de cavalete/paleta.
- **FR-008**: O novo visual DEVE permanecer legível e com contraste adequado em todos os 4 temas de
  cor de interface existentes (Padrão, Oceano, Flor, Floresta) e nos modos claro e escuro.
- **FR-009**: O visual de cavalete e paleta de artista DEVE ser a aparência padrão do editor de
  colorir para todos os usuários, sempre ativa — não é um tema opcional adicional aos temas de cor
  de interface já existentes (Padrão/Oceano/Flor/Floresta), que continuam controlando apenas as
  cores do "chrome" (Header/Toolbar/Palette), agora aplicadas sobre a nova ambientação de ateliê.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Ao abrir o editor de colorir, o usuário reconhece visualmente a área de desenho como
  "apoiada" em algo parecido com um cavalete, sem qualquer explicação adicional.
- **SC-002**: O usuário consegue escolher qualquer cor da paleta de artista no mesmo tempo/com o
  mesmo número de toques que levava com a grade de círculos atual (nenhuma cor fica mais difícil de
  alcançar).
- **SC-003**: 100% das funcionalidades de desenho e de seleção de cor/ferramenta continuam
  funcionando exatamente como antes após o novo visual (zero regressões de comportamento).
- **SC-004**: O novo visual funciona sem cortes ou rolagem horizontal em telas de tamanho comum de
  desktop e mobile.

## Assumptions

- O pedido é sobre a **aparência visual** do cavalete e da paleta de artista (moldura, formato,
  textura, cores, sombras) — não sobre novas interações (por exemplo, não inclui misturar tintas ou
  arrastar/soltar cores).
- Fidelidade visual: **totalmente imersiva/realista** (confirmado com o usuário) — cavalete com
  pernas e apoio visíveis, textura de madeira, sombras; paleta de artista com formato oval real,
  textura de madeira e cores como pingos de tinta — tudo via CSS/SVG, sem novas bibliotecas visuais.
- Escopo: esse visual **sempre ativo** (confirmado com o usuário) — é a nova aparência padrão do
  editor de colorir para todos os usuários, não um tema opcional/alternável como os temas de cor de
  interface existentes.
- A moldura de cavalete é aplicada em torno da área de desenho existente (`Canvas.jsx`), sem mudar
  onde ou como o usuário clica para colorir.
- A "paleta de artista" reorganiza visualmente a mesma seção de seleção de cor que já existe hoje no
  painel lateral (famílias de cores, padrão de preenchimento, cor personalizada, cor atual,
  histórico) — não adiciona nem remove cores.
