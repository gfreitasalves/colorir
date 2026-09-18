# Busca/filtro na galeria

Campo de texto no topo da `Gallery`, sempre visível (tanto na grade de categorias quanto dentro de uma categoria já aberta).

## Como funciona

- **Sem categoria aberta**: a busca é feita em **todas** as imagens de **todas** as categorias ao mesmo tempo. Cada resultado mostra também o nome da categoria à qual pertence, já que os resultados podem vir de lugares diferentes.
- **Dentro de uma categoria**: a busca fica restrita apenas às imagens daquela categoria.
- A busca é por **título** da imagem (`img.titulo`, o mesmo nome "bonito" derivado do arquivo em `images.js`), comparando de forma insensível a maiúsculas/minúsculas e a acentos (`normalizeText`, novo utilitário em `src/utils/textUtils.js`, usado também por [`me-surpreenda.md`](./me-surpreenda.md) indiretamente através dos mesmos dados).
- Tudo é filtrado **no navegador**, sobre o catálogo que já é carregado inteiro em memória (50 imagens) — sem nenhuma chamada de rede.
- Sem resultados: mostra uma mensagem simples convidando a tentar outro termo, no mesmo estilo visual das mensagens de "categoria vazia" já existentes.

## Por que um `useMemo`

O filtro roda dentro de um `useMemo` (`searchResults`), dependente só de `normalizedQuery` e `selectedCategory` — evita recalcular a lista filtrada em cada re-render do componente que não tenha relação com a busca (por exemplo, um clique em outro botão da tela).
