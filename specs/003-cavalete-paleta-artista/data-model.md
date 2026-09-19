# Phase 1 Data Model: Editor em Estilo de Ateliê (Cavalete + Paleta de Artista)

Esta feature não introduz nenhum dado persistido, estado novo em React, nem entidade de negócio —
é puramente visual/decorativa. Não há "Key Entities" no sentido tradicional; o que existe são tokens
de design (valores de CSS reaproveitados em múltiplos componentes), documentados abaixo pelo mesmo
motivo que `presetColors.js`/`interfaceThemes.js` são documentados: são a "fonte da verdade" de um
conjunto de valores visuais usados em vários lugares.

## Token: Paleta de Madeira do Ateliê (`--studio-wood-*`)

Definido uma única vez em `src/index.css` (`:root` e `.dark`), independente dos 4 temas de interface
(`--chrome-*`), conforme Decisão 4 de `research.md`.

| Variável                | Descrição                                                             |
|-------------------------|------------------------------------------------------------------------|
| `--studio-wood-base`    | Tom principal de madeira usado no cavalete e no corpo da paleta.        |
| `--studio-wood-dark`    | Tom mais escuro de madeira, usado em veios/sombreamento interno.        |
| `--studio-wood-shadow`  | Cor/opacidade da sombra projetada pelo cavalete e pela paleta.          |

**Regra**: estas variáveis NÃO são redefinidas por `[data-theme="..."]` — permanecem com o mesmo
valor em Padrão/Oceano/Flor/Floresta, mudando apenas entre claro (`:root`) e escuro (`.dark`), para
preservar a metáfora realista de madeira (FR-008, Decisão 4).

## Token: Blob de Tinta (forma de `Swatch`)

Não é uma variável CSS isolada, e sim um padrão de classe/estilo aplicado ao componente `Swatch` já
existente em `Palette.jsx`: `border-radius` com percentuais assimétricos (para parecer um pingo de
tinta, não um círculo perfeito) + um gradiente radial sutil de brilho (`::after` ou `box-shadow`
interno) simulando reflexo de tinta molhada.

**Regras de validação**:
- O alvo de toque/clique do blob DEVE continuar com a mesma área mínima já usada hoje pelo `Swatch`
  circular (nenhuma redução de tamanho clicável só por causa do novo formato) — atende FR-004.
- A cor de fundo do próprio blob continua sendo o hex da cor de pintura (`family.cores[i].hex`),
  nunca influenciada pela paleta de madeira do ateliê nem pelos temas de interface — reforça o
  limite de escopo já estabelecido na feature 001 (paleta de pintura nunca é afetada por decoração
  de interface).

## Token: Contorno de Paleta de Artista

Um novo container (novo elemento em `Palette.jsx`, não um componente separado) que envolve a seção
"Paleta de Cores": fundo com gradiente de madeira (`--studio-wood-*`), `border-radius` assimétrico
lembrando o contorno oval de uma paleta real, sombra, e um "furo de polegar" decorativo (SVG ou
`::before` com `border-radius` circular vazado num canto).

**Regra**: o furo de polegar e o contorno são puramente decorativos — não recebem `onClick` nem
alteram a ordem de tabulação/leitura por teclado da seção de cores.

## Token: Cavalete (decoração de `Canvas.jsx`)

Elementos SVG/CSS novos (pernas, ledge/apoio, sombra no "chão") posicionados como wrapper externo ao
redor do container de scroll/zoom já existente em `Canvas.jsx` (ver Decisão 2 de `research.md`).

**Regra**: nenhum elemento do cavalete tem `pointer-events` habilitado sobre a área de desenho —
`pointer-events: none` nos elementos puramente decorativos que se sobrepõem visualmente ao canvas,
para garantir que cliques/toques continuem chegando exatamente onde chegam hoje (FR-002).
