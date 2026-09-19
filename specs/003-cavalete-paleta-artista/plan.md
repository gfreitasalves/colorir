# Implementation Plan: Editor em Estilo de Ateliê (Cavalete + Paleta de Artista)

**Branch**: `claude/aplicar-especificacoes-lj8ye0` | **Date**: 2026-09-19 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/003-cavalete-paleta-artista/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command; its definition describes the execution workflow.

## Summary

Dar ao editor de colorir uma ambientação de ateliê totalmente imersiva/realista, sempre ativa: a
área de desenho (`Canvas.jsx`) passa a ficar visualmente apoiada sobre um cavalete de madeira (com
pernas, apoio/ledge e sombra), e a seção de seleção de cor no painel lateral (`Palette.jsx`) ganha a
aparência de uma paleta de pintor real (formato oval de madeira, textura, sombra, cores como pingos
de tinta). Abordagem técnica: tudo via CSS (gradientes, `border-radius` orgânico, sombras) e SVG
inline em novos componentes de ícone/decoração, sem novas dependências — a mesma filosofia já usada
para a marca d'água (`watermark.js`) e os ícones decorativos existentes. As interações de
zoom/pan/clique do canvas e a lógica de seleção de cor/ferramenta não mudam; apenas a "casca" visual
ao redor delas.

## Technical Context

**Language/Version**: JavaScript (ES2020+), React 18, JSX — mesmo stack já usado no projeto.

**Primary Dependencies**: Nenhuma dependência nova. Reaproveita React 18, Vite 5 e Tailwind CSS 3 já
presentes no projeto; texturas e formas orgânicas (madeira, pingos de tinta, cavalete) são feitas com
CSS (gradientes, `border-radius`, `box-shadow`) e SVG inline, como já é feito em
`src/utils/watermark.js` e `src/components/icons/`.

**Storage**: N/A — feature puramente visual, sem novo estado persistido.

**Testing**: Validação manual em navegador via `npm run build` + `npm run preview`, com verificação
visual em desktop e viewport mobile (mesmo processo já usado para as features visuais anteriores) —
não há suíte de testes automatizados no repositório.

**Target Platform**: Navegador web (mesmo alvo do restante do app), responsivo desktop + mobile.

**Performance Goals**: A decoração (CSS/SVG estático) não pode degradar a fluidez de zoom/pan/toque
já existente no canvas — sem novas re-renderizações por frame, sem animações custosas.

**Constraints**: Não pode alterar nenhum comportamento de desenho (zoom, pan, clique para preencher,
borracha, adesivo) nem de seleção de cor/ferramenta; deve caber sem cortes/rolagem horizontal em
mobile (mesmo com a fidelidade visual "totalmente imersiva"); deve permanecer legível nos 4 temas de
cor de interface (Padrão/Oceano/Flor/Floresta) e em claro/escuro; sem novas dependências de runtime.

**Scale/Scope**: Afeta 2 componentes existentes (`Canvas.jsx`, `Palette.jsx`), acrescenta decoração
em `index.css` e um novo módulo de ícones/decoração (`StudioDecorIcons.jsx`); não afeta `Header.jsx`
nem `Toolbar.jsx`, nem a paleta de pintura (`presetColors.js`).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Princípio I (Especificar → Planejar → Implementar → Testar)**: ✅ Spec já criada e validada
  (`specs/003-cavalete-paleta-artista/spec.md`, com 2 decisões de escopo confirmadas diretamente
  com o usuário); este plano é a etapa de planejamento antes da implementação.
- **Princípio II (Confirmação explícita para ações sensíveis)**: ✅ N/A — feature não envolve
  imagens novas na galeria nem ações destrutivas de git.
- **Princípio III (Reaproveitar padrões estabelecidos)**: ✅ Decoração nova em `src/components/icons/`
  (mesmo padrão de `PaletteBrushIcons.jsx`/`ActionIcons.jsx`), sem hook novo (não há estado), sem
  biblioteca de estilo/animação nova — CSS puro, como o resto do projeto.
- **Princípio IV (Documentação anda junto com o código)**: ⚠️ Pendente até a implementação — o
  plano exige criar `docs/estudio-cavalete-paleta.md` e linkar em `docs/README.md`/`README.md`, e
  atualizar `docs/painel-lateral.md` (a seção de cores muda de aparência) na mesma mudança que o
  código (registrado como tarefa em `/speckit-tasks`).
- **Princípio V (Testar de verdade)**: ✅ `quickstart.md` (Phase 1) documenta a validação manual em
  `npm run build` + `npm run preview`, cobrindo desktop e mobile, os 4 temas de interface e
  claro/escuro, e confirmando zero regressão nas interações de desenho/seleção de cor.

Nenhuma violação que exija entrada em Complexity Tracking.

## Project Structure

### Documentation (this feature)

```text
specs/003-cavalete-paleta-artista/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

Sem `contracts/`: esta feature não expõe nenhuma interface externa — é puramente uma mudança visual
dentro de uma SPA já existente.

### Source Code (repository root)

```text
src/
├── components/
│   ├── Canvas.jsx                 # Recebe a moldura de cavalete ao redor da área de scroll/zoom
│   │                               # existente, sem tocar na lógica de zoom/pan/clique
│   ├── Palette.jsx                # A seção "Paleta de Cores" passa a renderizar dentro do novo
│   │                               # wrapper de paleta de artista; Swatch vira "pingo de tinta"
│   └── icons/
│       └── StudioDecorIcons.jsx   # Novo: SVGs de decoração (pernas/ledge do cavalete, veio de
│                                   # madeira, contorno de paleta oval) — mesmo padrão de
│                                   # PaletteBrushIcons.jsx / ActionIcons.jsx
src/index.css                      # Novas classes utilitárias de decoração (textura de madeira,
                                    # formato de blob de tinta, sombras) — variáveis próprias,
                                    # independentes de `--chrome-*` (temas de interface)
docs/estudio-cavalete-paleta.md    # Novo doc da feature (Princípio IV)
docs/painel-lateral.md             # Atualizado: a seção de cores agora é uma paleta de artista
docs/README.md, README.md          # Link para o novo doc
```

**Structure Decision**: Projeto único (SPA React existente), sem separação frontend/backend. A
feature reaproveita a estrutura de pastas já estabelecida (`src/components/`,
`src/components/icons/`) em vez de introduzir uma pasta ou padrão novo; não há necessidade de novo
hook (não há estado novo) nem de novo utilitário puro em `src/utils/`.

## Complexity Tracking

> Nenhuma violação da Constitution Check acima — seção não aplicável, sem entradas.
