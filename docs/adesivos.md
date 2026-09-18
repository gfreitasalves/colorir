# Adesivos/carimbos

Terceira ferramenta de desenho, ao lado do balde e da borracha: em vez de colorir, carimba um pequeno elemento decorativo (estrela, coração, brilho) sobre o desenho.

## Ferramenta ativa e seleção do adesivo

A ferramenta `'adesivo'` se soma a `'balde'`/`'borracha'` no estado `activeTool` já existente (veja [borracha.md](./borracha.md)). Um segundo estado, `selectedSticker`, guarda qual adesivo está escolhido. Quando `activeTool === 'adesivo'`, a `Palette` troca inteiramente o que mostra: em vez das famílias de cores, exibe uma grade com os adesivos disponíveis (`src/data/stickers.js`) para escolher.

## Conjunto de adesivos

`src/data/stickers.js` exporta um array de `{ id, nome, svg }`, com o SVG de cada adesivo desenhado por nós (mesmo padrão dos ícones em `PaletteBrushIcons.jsx`) — evitando reabrir a questão de licenciamento de imagens externas (veja [galeria.md](./galeria.md)).

## Carimbando no canvas (`stampAt`)

`useCanvas.stampAt(point, stickerId)`:
1. Garante que o SVG do adesivo escolhido esteja carregado como `Image` (cache em `stickerImageCache`, indexado por `stickerId`, guardando a própria *promise* de carregamento para não recarregar a mesma imagem se o usuário carimbar várias vezes rápido antes do primeiro carregamento terminar).
2. Desenha essa imagem centralizada no ponto tocado, em um tamanho fixo proporcional ao menor lado do canvas (12% do menor lado, com um mínimo de 28px).
3. Chama `pushSnapshot()` — cada carimbada vira um passo normal de undo/redo, sem nenhuma mudança no `useUndo.js`.

Diferente do balde/borracha, aqui não existe algoritmo de preenchimento: é um `drawImage` direto na camada de desenho (`drawCanvas`), a mesma camada onde o balde pinta e a borracha apaga — então adesivos também aparecem na exportação final (`exportImage`) e são apagados junto se o usuário usar "Limpar".

## Interação (v1)

Por decisão de escopo, o adesivo é carimbado em **tamanho e rotação fixos** com um toque simples — não há arrastar para reposicionar nem pinça para redimensionar/rotacionar depois de colocado. Cursor específico (`stickerCursor` em `Canvas.jsx`) mostra uma estrela pequena enquanto essa ferramenta está ativa, dando a mesma pista visual que o cursor de pincel/borracha já davam para as outras ferramentas.
