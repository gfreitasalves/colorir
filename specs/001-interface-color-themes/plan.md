# Implementation Plan: Temas de Cor da Interface

**Branch**: `claude/aplicar-especificacoes-lj8ye0` | **Date**: 2026-09-19 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-interface-color-themes/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command; its definition describes the execution workflow.

## Summary

Adicionar um seletor de tema de cor da interface (Oceano, Flor, Floresta, além de Claro/Escuro já
existentes), acessível no cabeçalho perto do botão de claro/escuro, persistido em `localStorage`
como o modo escuro, e aplicado apenas aos elementos de chrome do app (Header, Toolbar, Palette,
botões) — nunca à paleta de cores de pintura. Abordagem técnica: variáveis CSS por tema (definidas
por um atributo `data-theme` em `<html>`, do mesmo jeito que o modo escuro já usa a classe `.dark`),
consumidas pelos componentes existentes via utilitários Tailwind com valores arbitrários
(`bg-[var(--chrome-bg)]` etc.), evitando duplicar `className`s de tema em cada componente.

## Technical Context

**Language/Version**: JavaScript (ES2020+), React 18, JSX — mesmo stack já usado no projeto.

**Primary Dependencies**: Nenhuma dependência nova. Reaproveita React 18, Vite 5 e Tailwind CSS 3
já presentes no projeto.

**Storage**: `localStorage` do navegador (chave nova `colorir:theme`), no mesmo padrão já usado por
`colorir:darkMode`.

**Testing**: Validação manual em navegador via `npm run build` + `npm run preview`, com verificação
visual em desktop e viewport mobile (mesmo processo já usado para outras features visuais deste
projeto — não há suíte de testes automatizados no repositório).

**Target Platform**: Navegador web (mesmo alvo do restante do app), responsivo desktop + mobile.

**Project Type**: Aplicação web single-page existente (React + Vite), frontend puro sem backend.

**Performance Goals**: Troca de tema deve ser instantânea (percebida pelo usuário como imediata,
sem recarregar a página) — não há requisito de performance além do já esperado para uma SPA React
pequena.

**Constraints**: Não pode alterar as cores disponíveis na paleta de pintura (`src/data/presetColors.js`);
deve reaproveitar o mecanismo de persistência e o padrão de estado já usados pelo modo escuro; sem
novas dependências de runtime.

**Scale/Scope**: 5 temas de interface no total (Claro, Escuro, Oceano, Flor, Floresta), cada um com
variante clara e escura; afeta 3 componentes existentes (`Header.jsx`, `Toolbar.jsx`, `Palette.jsx`)
mais os botões de ação já presentes neles, e o estado global de tema em `App.jsx`.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Princípio I (Especificar → Planejar → Implementar → Testar)**: ✅ Spec já criada e validada
  (`specs/001-interface-color-themes/spec.md`); este plano é a etapa de planejamento antes da
  implementação.
- **Princípio II (Confirmação explícita para ações sensíveis)**: ✅ N/A — feature não envolve
  imagens novas na galeria nem ações destrutivas de git.
- **Princípio III (Reaproveitar padrões estabelecidos)**: ✅ Novo hook em `src/hooks/`
  (`useInterfaceTheme.js`, espelhando `useColor.js`), dados estáticos dos temas em `src/data/`
  (`interfaceThemes.js`, espelhando `presetColors.js`), sem biblioteca nova de estado/estilo — a
  troca de tema usa o mesmo mecanismo de atributo global + CSS que o modo escuro (`class` →
  `data-theme`), não uma abordagem paralela.
- **Princípio IV (Documentação anda junto com o código)**: ⚠️ Pendente até a implementação — o
  plano exige criar `docs/temas-de-interface.md` e linkar em `docs/README.md` e `README.md` na
  mesma mudança que o código (registrado como tarefa em `/speckit-tasks`).
- **Princípio V (Testar de verdade)**: ✅ `quickstart.md` (Phase 1) documenta a validação manual em
  `npm run build` + `npm run preview`, cobrindo desktop e mobile, claro e escuro, para os 5 temas.

Nenhuma violação que exija entrada em Complexity Tracking.

## Project Structure

### Documentation (this feature)

```text
specs/001-interface-color-themes/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

Sem `contracts/`: esta feature não expõe nenhuma interface externa (API, CLI, etc.) — é puramente
uma mudança de UI dentro de uma SPA já existente.

### Source Code (repository root)

```text
src/
├── App.jsx                        # Estado global de tema (novo, ao lado do já existente darkMode)
├── components/
│   ├── Header.jsx                 # Adiciona o novo ThemePicker perto do botão claro/escuro
│   ├── Toolbar.jsx                # Passa a usar classes de chrome baseadas em variáveis de tema
│   ├── Palette.jsx                # Idem — botões/painel lateral usam variáveis de tema
│   └── ThemePicker.jsx            # Novo componente: seletor visual dos 5 temas
├── hooks/
│   └── useInterfaceTheme.js       # Novo hook: estado do tema + persistência em localStorage
└── data/
    └── interfaceThemes.js         # Novo: lista estática dos 5 temas (id, nome, cores de destaque)

src/index.css                      # Novas regras `[data-theme="..."]` definindo variáveis CSS de chrome
tailwind.config.js                 # Sem mudança estrutural (continua darkMode: 'class');
                                    # variáveis de tema consumidas via valores arbitrários do Tailwind
docs/temas-de-interface.md         # Novo doc da feature (Princípio IV)
docs/README.md, README.md          # Link para o novo doc
```

**Structure Decision**: Projeto único (SPA React existente), sem separação frontend/backend. A
feature reaproveita a estrutura de pastas já estabelecida (`src/hooks/`, `src/data/`,
`src/components/`, `src/components/icons/` se algum ícone novo for necessário para o `ThemePicker`)
em vez de introduzir uma pasta ou padrão novo.

## Complexity Tracking

> Nenhuma violação da Constitution Check acima — seção não aplicável, sem entradas.
