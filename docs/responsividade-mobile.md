# Responsividade e mobile

## Altura da tela (`100dvh` em vez de `100vh`)

O contêiner raiz do app usa a classe `h-dvh` (altura dinâmica de viewport), não `h-screen` (`100vh`). Em navegadores mobile, `100vh` conta a altura *incluindo* a área ocupada pela barra de endereço, mesmo quando ela está visível — isso empurrava a paleta de cores e sua gaveta inferior para fora da área realmente visível, sem nenhuma forma de rolar até elas. `100dvh` acompanha a altura visível real, que muda conforme o navegador mostra/esconde sua UI.

## Canvas que respeita o espaço disponível

A cadeia de contêineres flex entre a raiz e o canvas usa `min-h-0` em cada nível. Por padrão, itens flex têm `min-height: auto`, o que impede um item de encolher além do tamanho do seu conteúdo — sem isso, o canvas "vazava" para fora da tela em vez de se ajustar à área realmente disponível. O tamanho final do canvas é calculado em JavaScript (via `ResizeObserver`, ver [zoom.md](./zoom.md)), já que os dois `<canvas>` internos são `position: absolute` e não contribuem para o tamanho intrínseco do seu contêiner pai.

## Paleta como gaveta (bottom sheet) no celular

Em telas pequenas (abaixo do breakpoint `md` do Tailwind), a paleta lateral fica oculta e é substituída por:
- um botão fixo "🎨 Cores" na parte inferior da tela;
- ao tocar nele, a mesma `Palette` aparece como uma gaveta (`position: fixed`, `bottom-12`, `max-h-[60vh]`) sobre o canvas.

## Fechamento automático da paleta ao escolher uma cor

A instância **mobile** da `Palette` recebe um `onSelectColor` diferente da instância de desktop: `handleSelectColorMobile` (em `App.jsx`), que chama `selectColor(hex)` e em seguida `setPaletteOpen(false)`. Assim, assim que o usuário toca em uma cor, a gaveta fecha sozinha e ele já vê o resultado do preenchimento no desenho, sem precisar fechar a paleta manualmente. A paleta de desktop (barra lateral fixa) continua sempre visível e não fecha, já que lá ela não cobre o desenho.

## Zoom e gestos de toque

Pinça para zoom (pinch-to-zoom) e rolagem para navegar em zoom ampliado — ver [zoom.md](./zoom.md) para os detalhes de implementação dos listeners de toque nativos.

## Cursor de pincel

O cursor customizado (ver [identidade-visual.md](./identidade-visual.md)) só faz sentido com mouse; em telas de toque o navegador simplesmente o ignora, sem efeito colateral.
