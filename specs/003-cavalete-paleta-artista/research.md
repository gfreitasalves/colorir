# Phase 0 Research: Editor em Estilo de Ateliê (Cavalete + Paleta de Artista)

Nenhum `NEEDS CLARIFICATION` ficou pendente no Technical Context — os dois pontos de maior impacto
(fidelidade visual e se o visual é sempre ativo) já foram confirmados diretamente com o usuário na
etapa de especificação. Este documento registra as decisões técnicas de implementação e as
alternativas descartadas.

## Decisão 1: Tudo via CSS/SVG, sem novas dependências

- **Decision**: Cavalete, veio de madeira, sombras e "pingos de tinta" são implementados com
  gradientes CSS, `border-radius` orgânico (percentuais assimétricos para simular blobs), `box-shadow`
  e SVG inline em novos componentes de `src/components/icons/`.
- **Rationale**: Mesmo padrão já usado no projeto para decoração (marca d'água em
  `src/utils/watermark.js`, ícones em `src/components/icons/`) — reaproveita convenções existentes
  (Princípio III da constituição) e evita dependência nova (constituição: "sem bibliotecas de
  gerenciamento de estado externas", mesma lógica vale para libs de estilo/ilustração como
  react-spring, three.js, etc., que seriam desproporcionais para uma decoração estática).
- **Alternatives considered**:
  - **Imagens PNG/SVG externas ilustradas** (assets prontos de cavalete/paleta): rejeitada — exigiria
    curar/licenciar imagens (mesma preocupação de licenciamento já documentada para a galeria) só
    para decoração, quando CSS/SVG gerado no código já resolve com controle total de cor/tema.
  - **Biblioteca de ilustração ou animação** (ex. Lottie, Framer Motion): rejeitada — over-engineering
    para uma decoração estática, adicionaria peso ao bundle sem necessidade.

## Decisão 2: Moldura de cavalete envolve o container de scroll do Canvas, não o substitui

- **Decision**: `Canvas.jsx` ganha uma nova camada visual (wrapper externo com o "chão do ateliê",
  as pernas do cavalete e uma barra de apoio/ledge de madeira) ao redor do `<div ref={scrollRef}>`
  existente. O `scrollRef` (zoom, pan, `onWheel`, touch/pinch) e a `<div>` com `onClick={handleClick}`
  continuam exatamente como estão — a decoração fica em elementos irmãos/externos, nunca
  interceptando eventos de clique/scroll/touch da área de desenho.
- **Rationale**: Atende FR-002 (a moldura não pode alterar nenhum comportamento existente) sem
  reescrever a lógica de zoom/pan já testada. Uma decoração puramente estrutural (wrapper + `::before`/
  elementos absolutamente posicionados fora da área clicável) é a forma mais segura de "vestir" um
  componente interativo já funcional.
- **Alternatives considered**:
  - **Redesenhar o Canvas do zero com a moldura já embutida**: rejeitada — risco desnecessário de
    regressão em zoom/pan/pinça, que já tem tratamento cuidadoso de `ResizeObserver` e eventos de
    touch.

## Decisão 3: Paleta de artista = container com forma de paleta + swatches em formato de blob, mantendo a grade responsiva por dentro

- **Decision**: A seção "Paleta de Cores" (`Palette.jsx`) passa a renderizar dentro de um novo
  container com aparência de paleta de pintor (fundo com gradiente de madeira, borda arredondada
  assimétrica lembrando o contorno oval de uma paleta real, sombra, e um "furo de polegar" decorativo
  no canto). Dentro desse container, os `Swatch` (círculos de cor) ganham um formato de blob de tinta
  (borda com `border-radius` assimétrico + leve brilho/gloss via gradiente radial), mas a
  **disposição** das cores continua a mesma grade responsiva por família já existente (linhas de 4
  tons), em vez de espalhar as 40+ cores livremente sobre um formato de paleta.
- **Rationale**: Entrega a fidelidade "totalmente imersiva" pedida (forma, textura, pingos de tinta)
  sem comprometer FR-004 (todas as cores continuam acessíveis) nem FR-007 (sem corte/rolagem
  horizontal em mobile) — uma disposição livre/espalhada de 40 blobs dentro de um contorno de paleta
  fixo não escalaria para a gaveta mobile, que já é um espaço restrito (ver `docs/responsividade-mobile.md`).
- **Alternatives considered**:
  - **Cores espalhadas livremente dentro do contorno oval da paleta** (mais parecido com uma paleta
    real, onde os pingos ficam em posições arbitrárias): rejeitada — não é responsiva por natureza
    (não há 40 dabs), fica ilegível/inacessível em mobile e não garante alvo de toque mínimo
    consistente; violaria FR-004/FR-007.
  - **Reduzir o número de cores mostradas para caber num layout de paleta mais literal**: rejeitada —
    a spec (FR-004) exige manter todas as famílias/tons já disponíveis, não é opção reduzir o
    catálogo de cores por causa do novo visual.

## Decisão 4: Textura de madeira é uma "camada" independente dos temas de cor de interface

- **Decision**: A cor de madeira do cavalete/paleta (marrom quente) é fixa e não muda com os 4 temas
  de interface (Padrão/Oceano/Flor/Floresta) nem com claro/escuro — apenas a sombra/contraste ao
  redor se ajusta (sombra mais forte no claro, brilho/realce sutil no escuro) para permanecer legível
  sobre qualquer cor de fundo do `--chrome-bg` do tema ativo (FR-008).
  Novas variáveis CSS próprias (ex. `--studio-wood-base`, `--studio-wood-dark`, `--studio-wood-shadow`)
  são definidas uma única vez em `:root`/`.dark` (não por `[data-theme]`), separadas das variáveis
  `--chrome-*` que continuam controlando só o Header/Toolbar/painel.
- **Rationale**: Um cavalete/paleta de madeira "rosa" ou "verde" (se seguisse o tema Flor/Floresta)
  quebraria a metáfora realista pedida ("totalmente imersivo") — madeira de verdade tem uma paleta de
  cor limitada e reconhecível. Mantê-la neutra também simplifica a implementação (4 temas × 2 modos
  não precisam de 8 variantes de textura de madeira).
- **Alternatives considered**: Fazer a cor da madeira variar por tema (ex. um verniz azulado no tema
  Oceano) — rejeitada por enfraquecer o realismo pedido e multiplicar o trabalho de ajuste fino de
  contraste sem ganho perceptível para o usuário.

**Output**: Todas as incógnitas do Technical Context foram resolvidas acima; nenhum item
`NEEDS CLARIFICATION` permanece.
