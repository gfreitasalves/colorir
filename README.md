# ColorirApp 🎨

Aplicativo web de livro de colorir infantil, feito em React. O usuário escolhe uma categoria e um desenho, colore clicando com a ferramenta de balde (preenchimento), e pode salvar o resultado como imagem.

Site publicado: https://gfreitasalves.github.io/colorir/

> 🤖 Trabalhando neste repo com Claude (Cowork ou Claude Code)? Veja [CLAUDE.md](./CLAUDE.md) para o processo de especificar → planejar → implementar → testar adotado neste projeto.

## Funcionalidades

- **[Galeria em categorias](docs/galeria.md)**: 10 categorias temáticas (Sereias, Princesas, Animais, Flores, Castelos, Dinossauros, Galáxia e Espaço, Fadas e Criaturas Mágicas, Mandalas e Padrões, Cidades e Cenários), cada uma com suas imagens.
- **[Busca na galeria](docs/busca-galeria.md)** por título, e um botão **["Me surpreenda"](docs/me-surpreenda.md)** que abre uma imagem aleatória.
- **[Colorir por preenchimento (balde)](docs/colorir-preenchimento.md)**: clique em uma área do desenho para preenchê-la com a cor selecionada (flood fill com tolerância de cor).
- **[Borracha](docs/borracha.md)**: apaga a coloração de uma área já pintada, sem afetar o resto do desenho.
- **[Adesivos/carimbos](docs/adesivos.md)**: carimba estrela, coração ou brilho sobre o desenho, em tamanho fixo.
- **[Paleta de 40 cores](docs/paleta-de-cores.md)**: 10 famílias de tons (incluindo tons de pele) com 4 variações cada, no estilo de um estojo escolar infantil, além de um seletor de cor personalizada e histórico de cores usadas recentemente.
- **[Zoom no desenho](docs/zoom.md)**: botões de 100% / 150% / 200%, `Ctrl` + roda do mouse, e pinça (pinch-to-zoom) no toque, com rolagem para navegar pela imagem ampliada.
- **[Desfazer / Refazer](docs/desfazer-refazer.md)**: histórico de até 20 passos, com atalhos de teclado (`Ctrl+Z` / `Ctrl+Shift+Z`).
- **[Restaurar imagem original e salvar/exportar](docs/salvar-exportar.md)** o desenho colorido como PNG.
- **[Modo escuro](docs/modo-escuro.md)** com preferência salva no navegador.
- **[Totalmente responsivo](docs/responsividade-mobile.md)**: no celular a paleta de cores abre como uma gaveta (bottom sheet) e fecha automaticamente assim que uma cor é escolhida; a altura da tela se ajusta corretamente (sem cortar a paleta atrás da barra de endereço do navegador).
- **[Identidade visual](docs/identidade-visual.md)**: cursor personalizado em formato de pincel, marca d'água decorativa de paletas e pincéis no plano de fundo, e os mesmos ícones coloridos no cabeçalho, na barra de ferramentas e na paleta.

📄 Veja a [documentação detalhada de cada feature em `docs/`](docs/README.md).

## Tecnologias

- [React 18](https://react.dev/) + [Vite 5](https://vitejs.dev/)
- [Tailwind CSS 3](https://tailwindcss.com/)
- Desenho feito com a API de `<canvas>` do navegador (duas camadas: imagem base + camada de coloração do usuário)
- Deploy automático via [GitHub Actions](.github/workflows/deploy-pages.yml) para o [GitHub Pages](https://pages.github.com/)

## Estrutura do projeto

```
src/
├── App.jsx                    # Composição da tela (galeria/editor) e estado global da UI
├── components/
│   ├── Gallery.jsx            # Navegação por categorias e imagens
│   ├── Header.jsx             # Cabeçalho com breadcrumb e alternância de tema
│   ├── Toolbar.jsx            # Barra de ferramentas do editor (desfazer, zoom, salvar...)
│   ├── Canvas.jsx             # Área de desenho: zoom, pan, clique para preencher
│   ├── Palette.jsx            # Paleta de cores e histórico
│   ├── ColorPicker.jsx        # Seletor de cor personalizada
│   └── icons/PaletteBrushIcons.jsx
├── hooks/
│   ├── useCanvas.js           # Carregamento de imagem, preenchimento, desfazer/refazer
│   ├── useColor.js            # Cor selecionada + histórico
│   └── useUndo.js             # Hook genérico de undo/redo (passado/presente/futuro)
├── utils/
│   ├── drawingUtils.js        # Algoritmo de flood fill e leitura de eventos do canvas
│   ├── imageUtils.js          # Carregar/ajustar/exportar imagens e rascunhos
│   ├── colorUtils.js          # Comparação e conversão de cores
│   └── watermark.js           # Padrão de marca d'água do plano de fundo
├── data/
│   ├── images.js              # Catálogo de categorias/imagens (gerado via import.meta.glob)
│   └── presetColors.js        # As 10 famílias de cores (40 tons)
└── assets/images/<categoria>/ # Pastas de imagens da galeria (uma por categoria)
```

### Adicionando novas imagens à galeria

Basta colocar o arquivo (`.png`, `.jpg`, `.jpeg`, `.jfif`, `.webp`, `.gif` ou `.svg`) dentro da pasta da categoria correspondente em `src/assets/images/`. A galeria é gerada automaticamente a partir dessas pastas — não é necessário alterar nenhum código. Qualquer push para `main` (inclusive upload direto pela interface do GitHub) já publica a imagem no site.

> ⚠️ **Atenção com direitos de imagem**: como o site é público, só devem ser adicionadas imagens de domínio público ou com licença que permita redistribuição — mesmo para "uso pessoal" o app fica acessível a qualquer pessoa na internet.

## Rodando localmente

```bash
npm install
npm run dev       # ambiente de desenvolvimento
npm run build     # gera a versão de produção em dist/
npm run preview   # serve a build de produção localmente
```

## Deploy

O deploy é automático: qualquer push na branch `main` dispara o workflow [`deploy-pages.yml`](.github/workflows/deploy-pages.yml), que builda o projeto e publica o conteúdo de `dist/` no GitHub Pages. Detalhes em [docs/deploy.md](docs/deploy.md).

---

## Histórico de desenvolvimento

Resumo cronológico do que foi construído nesta aplicação:

1. **Base do app** — estrutura inicial em React + Vite + Tailwind: galeria, canvas de colorir, paleta de cores, desfazer/refazer e exportação de imagem.
2. **Publicação no GitHub Pages** — workflow do GitHub Actions para build e deploy automático a cada push em `main`.
3. **Interface simplificada** — redução para apenas a ferramenta de balde (preenchimento), com a paleta reorganizada em famílias de tons.
4. **Correções de mobile** — ajuste do container principal para `100dvh` (evitando que a barra de endereço do navegador escondesse a paleta) e correção do dimensionamento do canvas via `ResizeObserver`, permitindo rolagem quando necessário.
5. **Galeria em categorias** — reorganização em 10 categorias temáticas com 50 imagens.
6. **Upload de imagens por pastas** — a galeria passou a ser gerada automaticamente a partir de pastas em `src/assets/images/`, permitindo adicionar imagens direto pelo GitHub sem editar código. Também corrigido um bug em que o React limpava o conteúdo do canvas ao recarregar imagens de tamanhos diferentes.
7. **Cursor de pincel** — cursor customizado em SVG na área de desenho, com a cor selecionada na ponta.
8. **Paleta ampliada** — expansão para 10 famílias de cores × 4 tons cada (incluindo tons de pele), inspirada em um estojo escolar infantil; depois os rótulos de texto das famílias foram removidos para deixar a paleta mais limpa.
9. **Identidade visual lúdica** — marca d'água discreta de paletas e pincéis no plano de fundo geral, e os mesmos ícones em versão colorida no cabeçalho, na barra de ferramentas e na paleta lateral.
10. **Zoom e paleta mobile** — zoom no desenho (botões de 100/150/200%, `Ctrl`+roda do mouse e pinça no toque) e fechamento automático da paleta de cores no celular assim que uma cor é selecionada.

Cada etapa acima corresponde a um ou mais *pull requests* mesclados na branch `main` — veja o [histórico de commits](https://github.com/gfreitasalves/colorir/commits/main) para o detalhe técnico de cada mudança.
