# Galeria de imagens

A tela inicial do app é uma galeria em dois níveis: primeiro o usuário escolhe uma **categoria**, depois uma **imagem** dentro dela.

## Como o catálogo é montado

Não existe uma lista de imagens escrita à mão no código. O catálogo é gerado automaticamente a partir das pastas em `src/assets/images/<categoria>/` usando `import.meta.glob` do Vite (`src/data/images.js`):

- Cada subpasta de `src/assets/images/` vira uma categoria.
- Cada arquivo `.png`, `.jpg`, `.jpeg`, `.jfif`, `.webp`, `.gif` ou `.svg` dentro de uma categoria vira uma imagem da galeria, com o título derivado do nome do arquivo (`prettifyName`).
- Metadados fixos de cada categoria (nome de exibição, emoji, descrição) ficam em `categoryMeta`, dentro do mesmo arquivo.

Isso significa que **adicionar uma imagem nova é só colocar o arquivo na pasta certa** — inclusive fazendo upload direto pela interface do GitHub — sem precisar tocar em nenhum componente React. Um arquivo `.gitkeep` em cada pasta garante que categorias vazias continuem existindo no Git mesmo sem imagens.

## Categorias atuais

Sereias, Princesas, Animais, Flores, Castelos, Dinossauros, Galáxia e Espaço, Fadas e Criaturas Mágicas, Mandalas e Padrões, Cidades e Cenários.

## Navegação (`Gallery.jsx`)

- Estado local `selectedCategory`: `null` mostra a grade de categorias; definido, mostra a grade de imagens daquela categoria.
- Categorias são cards com emoji, nome e contagem de imagens.
- Imagens são thumbnails (`object-contain`, carregamento `lazy`) com o título abaixo.
- Categorias sem nenhuma imagem mostram uma mensagem explicando onde adicionar arquivos.
- Ao clicar em uma imagem, `onSelectImage(img)` é chamado (prop vinda de `App.jsx`), que muda a view para `'editor'` e carrega a imagem no canvas.

## Cuidado com direitos de imagem

Como a galeria é pública, qualquer arquivo colocado nas pastas de imagens fica visível para qualquer visitante do site assim que o deploy roda. Só devem ser adicionadas imagens de domínio público ou com licença que permita redistribuição pública — arquivos com nome no padrão de bancos de imagens pagos (ex.: sufixos numéricos longos, "Freepik" no nome) são um sinal de alerta e não devem ser publicados sem confirmar a licença.
