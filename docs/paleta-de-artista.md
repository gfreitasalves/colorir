# Paleta de artista (formato da seleção de cor)

A seção "Paleta de Cores" do painel lateral tem um formato decorativo inspirado numa paleta de
pintor: um contorno arredondado/oval (`.studio-palette-frame`, em `src/index.css`) com um "furo de
polegar" decorativo (`PaletteThumbHole`, em `src/components/icons/StudioDecorIcons.jsx`) num canto,
e cada cor (`Swatch`, em `Palette.jsx`) em formato de "pingo de tinta" (`.studio-paint-blob`) em vez
do círculo simples original.

É puramente visual — não muda nenhuma interação de seleção de cor.

## O que mudou

- **Contorno da seção de cores**: `border-radius` assimétrico simulando o formato oval de uma
  paleta real, com fundo e borda usando as variáveis normais do tema de interface ativo
  (`--chrome-muted-bg`, `--chrome-border-strong`) — a mesma cor que já muda com os
  [temas de cor de interface](./temas-de-interface.md) (Padrão/Oceano/Flor/Floresta), sem nenhuma
  textura própria.
- **Cores como pingos de tinta**: cada `Swatch` usa `border-radius` assimétrico + sombras internas
  simulando brilho de tinta, no lugar do círculo perfeito anterior. O alvo de toque/clique continua
  do mesmo tamanho de antes.
- **Disposição**: as cores continuam na mesma grade responsiva por família de sempre — não ficam
  espalhadas livremente pelo contorno da paleta, para manter todas acessíveis e caber na gaveta
  mobile sem rolagem horizontal.
- A grade de **Adesivos** (quando essa ferramenta está ativa) não recebe esse tratamento — continua
  com a exibição simples de sempre.

## Histórico

Esse formato de paleta nasceu junto com uma ambientação de "estilo de ateliê" mais ampla (cavalete
de madeira ao redor do desenho + textura de madeira nesta mesma paleta). A textura de madeira e o
cavalete foram removidos depois por não terem agradado — só o formato da seleção de cor (contorno +
pingos de tinta) foi mantido, agora usando as cores normais da interface em vez de madeira.

## Sem novas dependências

O formato é feito só com CSS (`border-radius` orgânico, sombras) e um pequeno SVG inline para o
furo de polegar — mesmo tipo de técnica já usada nos outros ícones decorativos do app
(`src/components/icons/`). Nenhuma biblioteca nova foi adicionada.
