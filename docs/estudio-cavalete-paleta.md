# Estilo de ateliê (cavalete + paleta de artista)

O editor de colorir tem uma ambientação de ateliê **sempre ativa**: a área de desenho fica
visualmente apoiada sobre um cavalete de pintor, e a seção de seleção de cor no painel lateral tem
aparência de paleta de artista (madeira, formato oval, cores como pingos de tinta). É puramente
visual — não é um tema opcional como os [temas de cor de interface](./temas-de-interface.md), nem
muda nenhuma interação de desenho ou de seleção de cor/ferramenta.

## Cavalete (`Canvas.jsx`)

A área de desenho (o container de scroll/zoom/toque que já existia) passa a ficar dentro de uma
moldura de madeira (`.studio-wood-surface`), com uma barra de apoio (`EaselLedge`) logo abaixo e
pernas de cavalete (`EaselLegs`) mais abaixo ainda — ambas em `src/components/icons/StudioDecorIcons.jsx`.

- O container que realmente cuida de zoom, pan (arraste), pinça e clique para preencher **não foi
  alterado** — a decoração é só um wrapper por fora dele, com `pointer-events: none` nos elementos
  puramente visuais, para nunca interceptar clique/toque.
- Em telas pequenas, a barra de apoio e as pernas do cavalete somem (`hidden sm:block` /
  `hidden md:block`) para não cortar espaço vertical da imagem — só a moldura ao redor continua
  visível.

## Paleta de artista (`Palette.jsx`)

A seção "Paleta de Cores" (famílias de cores, padrão de preenchimento, "+ Cor Personalizada", cor
atual e histórico) passa a renderizar dentro de um contorno com aparência de paleta de pintor:
fundo de madeira, formato oval assimétrico (`.studio-palette-frame`) e um "furo de polegar"
decorativo (`PaletteThumbHole`) num canto. Cada cor (`Swatch`) ganha um formato de "pingo de tinta"
(`.studio-paint-blob`) no lugar do círculo simples anterior.

- A disposição das cores continua a mesma grade responsiva por família de sempre — as cores não
  ficam espalhadas livremente pelo formato da paleta. Isso é proposital: uma disposição "realista"
  de 40 pingos soltos não escalaria para a gaveta mobile nem garantiria um alvo de toque
  consistente para todas as cores.
- A grade de **Adesivos** (quando essa ferramenta está ativa) não recebe esse tratamento — continua
  com a exibição simples de sempre.

## Por que a madeira não muda com o tema de interface

Os [4 temas de cor de interface](./temas-de-interface.md) (Padrão, Oceano, Flor, Floresta)
continuam controlando só o Header/Toolbar/painel (`--chrome-*`). A cor da madeira do
cavalete/paleta usa variáveis próprias (`--studio-wood-base`, `--studio-wood-dark`,
`--studio-wood-shadow`, `--studio-wood-text`, em `src/index.css`), que só mudam entre claro e
escuro — nunca por tema de cor. Um cavalete "rosa" ou "verde" quebraria a metáfora de madeira real
que o visual pretende passar.

## Sem novas dependências

Toda a decoração (textura de madeira, formato de pingo de tinta, pernas de cavalete) é feita com
gradientes CSS, `border-radius` orgânico e SVG inline — o mesmo tipo de técnica já usada na marca
d'água do plano de fundo (`src/utils/watermark.js`) e nos ícones decorativos existentes
(`src/components/icons/`). Nenhuma biblioteca nova foi adicionada.
