# Deploy e publicação

## GitHub Pages + GitHub Actions

O site é publicado em https://gfreitasalves.github.io/colorir/ via [GitHub Pages](https://pages.github.com/), com a fonte configurada como "GitHub Actions" (não o modo antigo "deploy a partir de uma branch").

O workflow [`.github/workflows/deploy-pages.yml`](../.github/workflows/deploy-pages.yml) roda em todo push para `main` (e pode ser disparado manualmente via `workflow_dispatch`):

1. **build**: faz checkout do repositório, instala Node 20, roda `npm ci` + `npm run build`, e empacota o conteúdo de `dist/` como artefato do Pages.
2. **deploy**: publica esse artefato no ambiente `github-pages`.

`concurrency: { group: pages, cancel-in-progress: true }` garante que, se vários pushes acontecerem em sequência rápida, apenas o deploy mais recente termina de rodar.

## Base path do Vite

Como o site é servido em um *project page* (`usuário.github.io/colorir/`, não a raiz do domínio), `vite.config.js` define `base: '/colorir/'`. Sem isso, os caminhos gerados para os arquivos JS/CSS de produção apontariam para a raiz do domínio e o site carregaria em branco (404 nos assets).

## Publicação de novas imagens

Como qualquer push em `main` já dispara o deploy, adicionar uma imagem a `src/assets/images/<categoria>/` — inclusive por upload direto pela interface web do GitHub — é suficiente para ela aparecer no site publicado, sem nenhum passo manual adicional. Veja [galeria.md](./galeria.md) para o aviso sobre direitos de imagem antes de publicar.

## Fluxo de trabalho com Pull Requests

O desenvolvimento acontece na branch `claude/aplicar-especificacoes-lj8ye0`; mudanças são propostas via Pull Request para `main` e mescladas (squash merge) depois de build e verificação manual. Cada squash merge "perde" a ancestralidade da branch de origem no GitHub, então o próximo commit local nessa branch normalmente diverge de `origin/main` — resolvido re-sincronizando o conteúdo antes do próximo commit (`git reset --soft origin/main` quando o conteúdo já é idêntico, ou merge + resolução manual quando há mudanças novas de ambos os lados).
