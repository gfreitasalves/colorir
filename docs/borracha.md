# Borracha (apagar por região)

Segunda ferramenta de desenho do app, ao lado do balde: em vez de pintar uma área com uma cor, a borracha remove a coloração de uma área já pintada.

## Ferramenta ativa

`App.jsx` mantém um estado `activeTool` (`'balde' | 'borracha'`), compartilhado entre `Toolbar` (onde o usuário escolhe a ferramenta, num grupo de botões 🪣/🧽) e `Canvas` (que usa a ferramenta ativa só para trocar o cursor). O estado volta para `'balde'` automaticamente sempre que uma nova imagem é carregada.

## Reaproveitando o `floodFill`

A borracha não é um algoritmo novo — é o mesmo `floodFill` scanline usado pelo balde (veja [colorir-preenchimento.md](./colorir-preenchimento.md)), só que a cor de preenchimento passada é transparente (`[0, 0, 0, 0]`) em vez da cor selecionada na paleta. `useCanvas.fillAt(point, colorHex)` agora aceita `colorHex` como `null` para indicar "apagar": nesse caso o algoritmo de flood fill encontra a mesma "ilha" contígua de pixels que seria preenchida por uma cor, e em vez de pintar, limpa (torna transparente) a camada de desenho ali.

## Evitando um "apagar" sem efeito

Diferente do balde — onde clicar numa área branca/sem cor sempre faz sentido (vai pintar) — clicar com a borracha numa área que nunca foi colorida não deveria fazer nada. Por isso, antes de rodar o flood fill, `fillAt` verifica o canal alfa do pixel clicado **na camada de desenho** (não na imagem mesclada): se já está transparente (`alpha === 0`), a função retorna sem processar nada — sem gerar um passo de undo vazio nem regravar o rascunho em `localStorage` à toa.

## Cursor

Enquanto a borracha está ativa, o cursor sobre o canvas muda para um ícone de borracha em SVG (`eraserCursor` em `Canvas.jsx`), no mesmo esquema do cursor de pincel já existente — um `data:image/svg+xml` aplicado via `cursor: url(...)`, sem depender de nenhum arquivo externo.

## Desfazer/Refazer

Como a borracha só chama `pushSnapshot()` através do mesmo `fillAt`, ela já participa do histórico de undo/redo existente sem nenhuma mudança em `useUndo.js` — apagar uma área é só mais um passo no histórico, como qualquer preenchimento.
