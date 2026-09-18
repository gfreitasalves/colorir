# Colorir por preenchimento (balde)

A única ferramenta de desenho do app é o preenchimento por clique (flood fill) — não há pincel livre nem borracha, para manter a interface simples para crianças.

## Estrutura de canvas em duas camadas

`useCanvas.js` mantém dois elementos `<canvas>` sobrepostos (`Canvas.jsx`):

1. **Canvas base** (`baseCanvasRef`): a imagem original do desenho, carregada uma vez por `loadImageFileToCanvas` e nunca modificada depois.
2. **Canvas de desenho** (`drawCanvasRef`): transparente por padrão, recebe apenas os pixels que o usuário pintou.

Manter as camadas separadas permite "Limpar" (apagar só a coloração, sem recarregar a imagem) e faz o undo/redo operar apenas sobre os dados de coloração.

> ⚠️ **Detalhe importante**: as dimensões do canvas (`canvas.width`/`canvas.height`) são setadas **imperativamente** em JS, nunca como props React (`<canvas width={...}>`). Alterar esses atributos limpa o conteúdo do canvas por especificação do HTML — se fossem props controladas, qualquer re-render disparado por outro motivo apagaria o desenho.

## O algoritmo (`floodFill` em `drawingUtils.js`)

- Implementação *scanline*: em vez de empilhar cada pixel individualmente, para cada linha ele encontra o intervalo contíguo de pixels que combinam com a cor de origem (`west`/`east`) e empilha só uma entrada por linha acima/abaixo — bem mais rápido que flood fill pixel-a-pixel em imagens grandes.
- **Tolerância de cor** (`tolerance`, padrão 40 ao preencher): a comparação usa distância euclidiana ao quadrado em RGBA, então bordas com anti-aliasing (linhas do desenho com pixels intermediários) não impedem o preenchimento de "vazar" ligeiramente, mas ainda respeita contornos bem definidos.
- **`sampleData` vs `targetData`**: o preenchimento decide quais pixels pertencem à região usando a imagem **mesclada** (base + desenho atual, via `getMergedImageData`), mas escreve o resultado apenas na camada de desenho. Isso evita que preencher sobre uma área já colorida ignore as bordas do desenho original.

## Fluxo de um clique

1. `Canvas.jsx` captura o clique e usa `getEventPoint` para converter a posição do mouse/toque (coordenadas de tela) em coordenadas de pixel do canvas, compensando o zoom/escala atual.
2. `useCanvas.fillAt(point, colorHex)` monta os buffers de amostra e destino, roda `floodFill`, e se algo mudou:
   - escreve o resultado de volta no canvas de desenho (`putImageData`);
   - empilha um novo snapshot no histórico de undo/redo;
   - salva um rascunho (draft) em `localStorage`, permitindo continuar o desenho depois de recarregar a página.
