# Temas de cor da interface

Além do modo claro/escuro (veja [modo-escuro.md](./modo-escuro.md)), o app tem 4 temas de cor para
a interface — **Padrão**, **Oceano**, **Flor** e **Floresta** — escolhidos no `Header`, ao lado do
botão de claro/escuro. Eles mudam a cor de fundo, bordas, texto e botões do "chrome" do app
(cabeçalho, barra superior, painel lateral e seus botões). **Não têm nenhuma relação com a paleta
de cores usada para colorir os desenhos** (`src/data/presetColors.js`), que continua sempre igual.

## Como funciona

- `src/data/interfaceThemes.js`: catálogo estático dos 4 temas (`id`, `nome`, `corDestaque` — essa
  última usada só para desenhar o próprio seletor, não o resto da interface).
- `src/hooks/useInterfaceTheme.js`: mantém o estado `theme`, inicializado a partir de
  `localStorage.getItem('colorir:theme')` (com um `id` desconhecido ou ausente caindo para
  `'padrao'`), aplica `document.documentElement.setAttribute('data-theme', theme)` e persiste a
  escolha de volta em `localStorage` a cada mudança — mesmo padrão já usado pelo modo escuro.
- `src/index.css` define, para cada tema, um bloco `:root[data-theme="..."]` (variante clara) e
  `.dark[data-theme="..."]` (variante escura) com as mesmas variáveis CSS de "chrome":
  `--chrome-bg`, `--chrome-border`, `--chrome-border-strong`, `--chrome-text`,
  `--chrome-text-muted`, `--chrome-muted-bg`, `--chrome-accent` e `--chrome-accent-text`.
- `Header.jsx`, `Toolbar.jsx`, `Palette.jsx` (e a barra inferior de "Ferramentas" no mobile, em
  `App.jsx`) usam essas variáveis via utilitários Tailwind de valor arbitrário
  (`bg-[var(--chrome-bg)]`, `border-[var(--chrome-border)]` etc.) em vez de classes de cor fixas —
  assim o mesmo JSX funciona para os 4 temas, sem duplicar `className`s.
- `src/components/ThemePicker.jsx`: renderiza um botão circular por tema (cor de destaque como
  fundo do próprio botão) no `Header`, destacando o tema ativo.

## Relação com o modo claro/escuro

Os dois controles são independentes: o modo claro/escuro continua alternando a classe `.dark`
normalmente, e cada tema de cor tem uma variante para cada um desses dois modos. Trocar de tema não
mexe no claro/escuro, e vice-versa.

## Fora de escopo

O canvas de desenho, a imagem sendo colorida e a paleta de 40 cores de pintura nunca são afetados
pelo tema de interface — apenas os elementos de navegação do app.
