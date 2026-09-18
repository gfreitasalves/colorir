# Preenchimento com padrão (bolinhas/listras)

Além de cor sólida, o balde agora pode preencher uma região com um padrão — bolinhas ou listras — na cor selecionada.

## Generalizando o `floodFill`

Antes, `floodFill` (`drawingUtils.js`) recebia sempre um `[r,g,b,a]` fixo e escrevia esse valor em todo pixel da região encontrada. Para suportar padrões, o parâmetro `fillColor` agora aceita **ou** um array fixo (cor sólida, erase da borracha) **ou** uma função `(x, y) => [r,g,b,a]`, avaliada pixel a pixel:

```js
const getFillColor = typeof fillColor === 'function' ? fillColor : () => fillColor
```

Isso mantém 100% de compatibilidade com quem já chamava `floodFill` passando um array — inclusive o próprio "early return" que evita reprocessar quando a cor de destino já é igual à que seria pintada: em vez de comparar contra um array fixo, agora compara contra `getFillColor(x0, y0)` (a cor que seria aplicada exatamente no pixel clicado), o que funciona igual para cor sólida e para padrão.

## As funções de padrão (`patternUtils.js`)

- `dotsPatternAt(x, y, rgb)`: divide o plano em uma grade repetida (`DOT_SPACING` = 12px) e pinta um pequeno círculo (`DOT_RADIUS` = 3.5px) centralizado em cada célula, usando `(x % spacing, y % spacing)` para achar a posição relativa dentro da célula atual — fora do círculo, o pixel fica branco.
- `stripesPatternAt(x, y, rgb)`: usa `Math.floor((x + y) / STRIPE_WIDTH) % 2` para alternar entre a cor e branco em faixas diagonais de `STRIPE_WIDTH` = 7px.
- `buildFillColor(hex, pattern)`: função de composição usada por `useCanvas.fillAt` — para `'solido'` retorna o `[r,g,b,a]` de sempre (`hexToRgba`); para `'bolinhas'`/`'listras'` retorna uma função por-pixel que aplica o padrão correspondente sobre o RGB da cor escolhida.

O branco de fundo do padrão não é um acaso: é a mesma cor do papel/base do desenho, então bolinhas/listras se misturam visualmente com a área não pintada ao redor, em vez de parecerem um "furo" na ilustração.

## Escolhendo o padrão (`Palette.jsx`)

Um segundo controle (`Sólido | Bolinhas | Listras`) aparece na paleta, abaixo das famílias de cores. O padrão escolhido (`selectedPattern`, estado em `useColor.js`) é independente da cor: trocar de cor não reseta o padrão, e vice-versa — dá pra ter, por exemplo, "bolinhas azuis" e depois "bolinhas vermelhas" sem reconfigurar nada.

`useCanvas.fillAt(point, colorHex, pattern)` recebe o padrão como terceiro argumento (padrão `'solido'` quando omitido, usado pela borracha/reset que não precisam disso) e delega a `buildFillColor` antes de chamar `floodFill`.
