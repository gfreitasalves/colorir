# Instruções para sessões Claude neste projeto

Este arquivo é lido automaticamente por sessões Claude (Claude Code, Cowork etc.) que trabalham neste repositório. Ele define o processo de trabalho esperado para qualquer novo pedido de feature ou correção.

## Visão geral do projeto

ColorirApp: app web de livro de colorir infantil (React + Vite + Tailwind), publicado via GitHub Pages a partir da branch `main`. Veja [README.md](./README.md) para a visão geral e [docs/](./docs/README.md) para a documentação detalhada de cada feature existente.

## Processo: Especificar → Planejar → Implementar → Testar

Para qualquer pedido que não seja trivial (uma nova feature, uma mudança de comportamento visível, uma correção de bug não óbvia), siga as quatro etapas abaixo antes de considerar o trabalho concluído. Para pedidos pequenos e inequívocos (ajustar um texto, corrigir um typo, mudar uma cor específica), pode-se ir direto para Implementar + Testar.

### 1. Especificar

- Releia o pedido do usuário e confirme o que está sendo pedido, em que tela/fluxo, e qual o comportamento esperado (antes vs. depois).
- Se o pedido for ambíguo ou tiver mais de uma interpretação razoável (ex.: afeta mobile e desktop de formas diferentes, ou existe mais de uma abordagem técnica com trade-offs relevantes), pergunte ao usuário antes de prosseguir em vez de assumir.
- Casos que **sempre** exigem confirmação explícita do usuário antes de prosseguir:
  - Adicionar imagens à galeria (`src/assets/images/`) cuja origem/licença não esteja claramente confirmada como domínio público ou de uso livre — mesmo que o usuário diga "é só para uso pessoal": o site é público, então isso não é suficiente. Veja [docs/galeria.md](./docs/galeria.md).
  - Qualquer ação destrutiva ou difícil de reverter (force-push, deletar branch, reescrever histórico de commits já mesclados).

### 2. Planejar

- Identifique quais arquivos/componentes serão afetados (consulte a estrutura em [README.md](./README.md#estrutura-do-projeto) e os docs de feature relevantes em `docs/`).
- Para mudanças que tocam mais de um componente ou introduzem um novo padrão (novo hook, novo utilitário, nova dependência), esboce mentalmente (ou em texto curto, se a mudança for grande) os passos antes de editar código.
- Prefira reaproveitar os padrões já estabelecidos no projeto em vez de introduzir abordagens novas: hooks em `src/hooks/`, utilitários puros em `src/utils/`, dados estáticos em `src/data/`, ícones em `src/components/icons/`.

### 3. Implementar

- Siga as convenções de código já usadas no projeto (componentes funcionais, hooks customizados, Tailwind para estilo, sem bibliotecas de gerenciamento de estado externas).
- Textos de interface ficam em português, consistente com o restante do app.
- Ao alterar uma feature documentada em `docs/`, atualize o arquivo correspondente para refletir o novo comportamento.
- Commits em português, descrevendo o "porquê" da mudança, não só o "o quê" (veja o [histórico de commits](https://github.com/gfreitasalves/colorir/commits/main) para o estilo esperado).

### 4. Testar

- Rode `npm run build` e confirme que termina sem erros antes de considerar a mudança pronta.
- Para mudanças visuais ou de interação (UI, gestos, responsividade), valide de fato no navegador antes de reportar sucesso — não basta o build passar. Use `npm run preview` e, quando disponível, automação de navegador (Playwright) para tirar prints e confirmar o comportamento em desktop **e** em viewport mobile, já que várias features deste app (paleta em gaveta, zoom por toque, etc.) só existem em mobile.
- Depois de validar, siga o fluxo de Git/PR do projeto: commit na branch de trabalho, push, abrir Pull Request para `main` (a menos que instruído a não abrir PR), e só fazer merge quando o usuário confirmar. Detalhes do workflow e de como resolver divergências de histórico após squash-merge em [docs/deploy.md](./docs/deploy.md).
