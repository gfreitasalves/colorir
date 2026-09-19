# Identidade visual

## Cursor em formato de pincel

Enquanto o mouse está sobre a área de desenho, o cursor padrão é substituído por um pincel desenhado em SVG (`brushCursor` em `Canvas.jsx`): cabo, férula e uma gota de tinta na ponta. A gota usa a cor atualmente selecionada na paleta, dando uma pista visual imediata de qual cor vai ser aplicada ao clicar. O SVG é convertido em `data:` URI (`encodeURIComponent`) e aplicado via `cursor: url(...) hotspotX hotspotY, pointer` — sem depender de nenhum arquivo de imagem externo.

## Ícones de paleta e pincel

`src/components/icons/PaletteBrushIcons.jsx` exporta dois componentes React (`PaletteIcon`, `BrushIcon`), desenhados em SVG inline, reaproveitados coloridos e em opacidade total em três lugares:
- no `Header` (ao lado do nome "ColorirApp");
- na `Toolbar` do editor (barra superior, agora reduzida a Voltar/Salvar);
- na `Palette` (acima da lista de cores).

## Ícones de ação (ações, ferramenta, zoom, salvar...)

`src/components/icons/ActionIcons.jsx` exporta um conjunto de ícones de linha simples (traço único, `stroke="currentColor"`, sem preenchimento) para todas as ações do editor — desfazer, refazer, limpar, balde, borracha, adesivo, zoom, "Terminei!", salvar, voltar. Ao contrário dos ícones decorativos de paleta/pincel (coloridos, estilo desenhado à mão), esses são monocromáticos e herdam a cor do texto do botão (`currentColor`), o que os deixa consistentes em qualquer estado (normal, ativo, desabilitado) e em ambos os temas (claro/escuro) sem precisar de variantes de cor separadas.

## Marca d'água do plano de fundo

`src/utils/watermark.js` usa as mesmas formas de paleta/pincel (`PALETTE_SHAPE`/`BRUSH_SHAPE`), mas repetidas em baixa opacidade (0.13–0.16) e em posições/rotações/escalas variadas dentro de um tile de 260×260px, formando `watermarkBackground` — uma string `data:image/svg+xml` pronta para uso em `background-image`. Esse valor é aplicado no contêiner raiz do `App.jsx` junto com `backgroundRepeat: 'repeat'`, criando um mosaico sutil e lúdico atrás de toda a interface, sem prejudicar a legibilidade do conteúdo (que fica por cima, sem necessidade de `z-index`, já que `background-image` sempre pinta atrás dos filhos do elemento).
