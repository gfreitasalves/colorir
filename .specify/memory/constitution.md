# ColorirApp Constitution

## Core Principles

### I. Especificar → Planejar → Implementar → Testar

Toda mudança não-trivial (uma feature nova, uma mudança de comportamento visível, uma correção de
bug não óbvia) DEVE passar pelas quatro etapas antes de ser considerada concluída: especificar
(confirmar o que está sendo pedido e levantar ambiguidades antes de assumir), planejar (mapear
arquivos/componentes afetados, reaproveitando padrões existentes), implementar e testar. Pedidos
pequenos e inequívocos (ajustar um texto, corrigir um typo, trocar uma cor específica) podem ir
direto para implementar + testar.

### II. Confirmação explícita para ações sensíveis (NON-NEGOTIABLE)

As ações abaixo SEMPRE exigem confirmação explícita do usuário antes de prosseguir, mesmo que o
pedido pareça direto:
- Adicionar imagens à galeria (`src/assets/images/`) cuja origem/licença não esteja claramente
  confirmada como domínio público ou de uso livre — mesmo que o usuário diga "é só para uso
  pessoal": o site é público, então isso não é suficiente.
- Qualquer ação destrutiva ou difícil de reverter (force-push, deletar branch, reescrever
  histórico de commits já mesclados).

### III. Reaproveitar padrões estabelecidos

Código novo DEVE seguir a organização já existente no projeto em vez de introduzir abordagens
paralelas: hooks customizados em `src/hooks/`, utilitários puros em `src/utils/`, dados estáticos
em `src/data/`, ícones em `src/components/icons/`. Uma abordagem nova só se justifica quando
nenhum padrão existente resolve o problema.

### IV. Documentação anda junto com o código (NON-NEGOTIABLE)

Documentação e código mudam juntos, na mesma alteração — nunca como um passo separado depois:
- Feature nova (sem doc ainda) → criar um novo arquivo em `docs/`, seguindo o padrão dos arquivos
  existentes, e linkar em `docs/README.md` e na lista de funcionalidades do `README.md`.
- Comportamento de uma feature já documentada muda → atualizar o arquivo correspondente em `docs/`.
- Feature removida ou substituída → remover ou atualizar o doc correspondente; nunca deixar
  documentação de algo que não existe mais no app.

### V. Testar de verdade, não só compilar

`npm run build` sem erros NÃO é suficiente para considerar uma mudança pronta. Mudanças visuais ou
de interação (UI, gestos, responsividade) DEVEM ser validadas rodando a aplicação de fato
(`npm run preview` ou equivalente) e, quando houver automação de navegador disponível, testadas
tanto em viewport desktop quanto mobile — várias features deste app (paleta em gaveta, zoom por
toque, preenchimento por clique sem vazamento entre áreas) só se comportam de um jeito específico
em cada formato, e um build limpo não garante nada sobre esse comportamento.

## Fluxo de Git e Pull Requests

Commit na branch de trabalho → push → abrir Pull Request para `main` (a menos que instruído a não
abrir PR) → mesclar somente após confirmação do usuário, exceto quando o próprio usuário já
autorizou prosseguir sem essa confirmação a cada vez. Depois de um squash-merge, a branch local
diverge do histórico remoto; resolver isso realinhando a branch local ao `main` atualizado antes do
próximo commit, em vez de empilhar commits sobre um histórico já obsoleto.

## Stack e convenções técnicas

React 18 + Vite 5 + Tailwind CSS 3, sem bibliotecas de gerenciamento de estado externas. Textos de
interface ficam em português, consistente com o restante do app. Desenho feito com a API de
`<canvas>` do navegador. Deploy automático via GitHub Actions para o GitHub Pages a cada push em
`main`.

## Governance

Esta constituição resume, em alto nível, o processo já em vigor neste repositório — documentado em
detalhe em `CLAUDE.md` (o processo operacional do dia a dia) e em `docs/` (cada feature
individual). Em caso de conflito, `CLAUDE.md` é a fonte mais detalhada e prevalece para decisões
do dia a dia; esta constituição é o resumo usado pelas skills do Spec Kit
(`/speckit-plan`, `/speckit-tasks`, etc.). Emendas a esta constituição que afetem o processo
descrito em `CLAUDE.md` DEVEM ser refletidas de volta lá, para as duas fontes não divergirem.

**Version**: 1.0.0 | **Ratified**: 2026-09-19 | **Last Amended**: 2026-09-19
