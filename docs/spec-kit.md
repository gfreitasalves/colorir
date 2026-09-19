# GitHub Spec Kit

Este repositório tem o [GitHub Spec Kit](https://github.com/github/spec-kit) instalado — um toolkit de código aberto para "Spec-Driven Development" (specify → plan → tasks → implement), com integração nativa para o Claude Code via skills.

## O que foi instalado

- `.specify/`: templates, scripts (`scripts/bash/`) e a constituição do projeto (`memory/constitution.md`).
- `.claude/skills/speckit-*/`: as skills que o Claude Code usa para rodar os comandos do Spec Kit nesta sessão (`/speckit-constitution`, `/speckit-specify`, `/speckit-clarify`, `/speckit-plan`, `/speckit-tasks`, `/speckit-implement`, `/speckit-analyze`, `/speckit-checklist`, `/speckit-converge`, `/speckit-taskstoissues`).

Instalado com:
```bash
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git
specify init --here --force --non-interactive --integration claude
```

## Relação com o `CLAUDE.md` já existente

Este projeto já seguia um processo de **especificar → planejar → implementar → testar** documentado em [`CLAUDE.md`](../CLAUDE.md), escrito à mão antes do Spec Kit existir aqui. Em vez de duplicar esse processo do zero, a constituição do Spec Kit (`.specify/memory/constitution.md`) foi escrita resumindo os mesmos princípios já em vigor:

- Especificar → Planejar → Implementar → Testar como processo padrão.
- Confirmação explícita do usuário para licenciamento de imagens e ações destrutivas.
- Reaproveitar padrões de pasta já estabelecidos (`src/hooks/`, `src/utils/`, `src/data/`, `src/components/icons/`).
- Documentação e código andando juntos na mesma mudança.
- Testar de fato (build + navegador), não só compilar.
- O fluxo de Git/PR do projeto.

**`CLAUDE.md` continua sendo a fonte mais detalhada** e prevalece em caso de conflito — a constituição é o resumo de alto nível que as skills do Spec Kit (`/speckit-plan`, `/speckit-tasks` etc.) consultam. Usar as skills do Spec Kit é opcional: elas formalizam o mesmo processo com specs versionadas em arquivo (uma pasta por feature, criada por `/speckit-specify`) em vez de só uma conversa; nenhum fluxo de trabalho anterior deixou de funcionar.

## Quando usar

Para uma feature grande/ambígua onde vale ter uma spec escrita e versionada antes de planejar (em vez de só a conversa), rode `/speckit-specify` para começar. Para pedidos pequenos ou já bem definidos, o fluxo de conversa normal seguindo o `CLAUDE.md` continua sendo mais direto.
