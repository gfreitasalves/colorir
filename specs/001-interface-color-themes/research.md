# Phase 0 Research: Temas de Cor da Interface

Todas as incógnitas da spec e do Technical Context já tinham uma resposta razoável com base no
código existente do projeto — nenhum `NEEDS CLARIFICATION` ficou pendente. Este documento registra
as decisões técnicas tomadas e as alternativas descartadas.

## Decisão 1: Mecanismo de aplicação do tema (CSS custom properties + atributo global)

- **Decision**: Cada tema define um pequeno conjunto de variáveis CSS de "chrome" (ex.:
  `--chrome-bg`, `--chrome-border`, `--chrome-text`, `--chrome-accent`, `--chrome-button-bg`) em um
  seletor `:root[data-theme="oceano"]` (e variantes `.dark[data-theme="oceano"]` para a versão
  escura) dentro de `src/index.css`. O atributo `data-theme` é aplicado em `document.documentElement`
  pelo novo hook `useInterfaceTheme`, do mesmo jeito que o modo escuro já aplica a classe `.dark`.
  Os componentes (`Header.jsx`, `Toolbar.jsx`, `Palette.jsx`) trocam suas classes Tailwind
  hardcoded (`bg-white`, `border-gray-200`, `dark:bg-gray-800` etc.) por utilitários de valor
  arbitrário que leem essas variáveis (`bg-[var(--chrome-bg)]`, `border-[var(--chrome-border)]`).
- **Rationale**: Reaproveita exatamente o padrão já usado pelo modo escuro (atributo/classe global
  em `<html>` + regras CSS que dependem dele), sem introduzir uma abordagem paralela de gerência de
  estilo (Princípio III da constituição). Centraliza a definição de cada tema em um único lugar
  (`index.css`), evitando duplicar `className`s de tema em cada um dos ~3 componentes afetados.
  Tailwind já suporta valores arbitrários (`bg-[var(--x)]`) nativamente, sem plugin adicional.
- **Alternatives considered**:
  - **Classes Tailwind estáticas por tema** (ex. `theme-oceano:bg-blue-100` via variantes
    customizadas do Tailwind, ou uma classe por combinação tema×claro/escuro em cada componente):
    rejeitada — o `Palette.jsx` já tem 21 ocorrências de `dark:`; multiplicar isso por 5 temas em 3
    componentes geraria dezenas de classes condicionais por elemento, difícil de manter.
  - **CSS-in-JS / styled-components**: rejeitada — introduziria uma dependência nova e um padrão de
    estilo paralelo ao Tailwind, que o projeto não usa hoje (constituição: "sem bibliotecas de
    gerenciamento de estado externas", mesma lógica se aplica a libs de estilo).
  - **Inline styles calculados em JS a partir do tema ativo**: rejeitada — foge do padrão Tailwind
    já usado em 100% do projeto e dificultaria o suporte a `hover:`/`focus:` nos botões.

## Decisão 2: Relação entre tema de cor e o alternador claro/escuro existente

- **Decision**: Os dois controles permanecem independentes. `darkMode` (boolean, já existente)
  continua controlando a classe `.dark`; o novo `theme` (string: `padrao` | `oceano` | `flor` |
  `floresta`) controla o atributo `data-theme`. Um tema colorido tem uma variante clara e uma
  escura, selecionadas automaticamente pelo `darkMode` atual via os seletores CSS combinados
  (`[data-theme="oceano"]` e `.dark[data-theme="oceano"]`).
- **Rationale**: Já registrado como suposição na spec (FR-006), derivado da frase do próprio
  pedido do usuário ("temas... **além do** modo claro/escuro que já existe hoje"). Manter os dois
  eixos ortogonais evita ter que desenhar 10 combinações como opções separadas no seletor (5 temas
  × 2 modos) — o usuário só escolhe a "cor" e o modo claro/escuro continua sendo o toggle que já
  conhece.
- **Alternatives considered**: Tema colorido substituindo o conceito de claro/escuro (cada tema já
  seria uma combinação fixa) — rejeitada por contradizer o pedido explícito do usuário de manter o
  modo claro/escuro "que já existe hoje" como está.

## Decisão 3: Onde armazenar a lista de temas

- **Decision**: `src/data/interfaceThemes.js`, exportando um array de objetos
  `{ id, nome, corDestaque }` (`corDestaque` usado apenas para renderizar o próprio seletor de
  tema, não para estilizar o restante do chrome — isso é feito via CSS).
- **Rationale**: Espelha exatamente o padrão já usado por `src/data/presetColors.js` para a paleta
  de pintura (dado estático estruturado, consumido por um componente e um hook) — Princípio III.
- **Alternatives considered**: Definir os temas apenas dentro do `ThemePicker.jsx` — rejeitado por
  fugir do padrão de "dados estáticos em `src/data/`" já estabelecido.

## Decisão 4: Persistência

- **Decision**: `localStorage.getItem('colorir:theme')` / `setItem`, com fallback para `'padrao'`
  quando ausente ou inválido — mesmo padrão de `colorir:darkMode`.
- **Rationale**: Reaproveita literalmente o mecanismo já existente (mesma chave de storage, mesmo
  hook de efeito), atendendo ao FR-005 da spec.
- **Alternatives considered**: `sessionStorage` ou cookies — rejeitados, pois o requisito explícito
  é persistir "entre sessões" como o modo escuro já faz.

**Output**: Todas as incógnitas do Technical Context foram resolvidas acima; nenhum item
`NEEDS CLARIFICATION` permanece.
