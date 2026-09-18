# Botão "Me surpreenda"

Botão 🎲 ao lado do campo de busca, na tela de categorias da `Gallery`.

## Comportamento

Ao clicar, junta as imagens de **todas** as categorias num único array (`categories.flatMap((c) => c.imagens)`), sorteia uma posição aleatória e chama `onSelectImage` diretamente com ela — pulando a navegação manual (escolher categoria → escolher imagem) e indo direto para o editor.

## Quando aparece

Só na tela raiz da galeria, e apenas enquanto não há uma busca ativa nem uma categoria aberta (`!selectedCategory && !normalizedQuery`) — dentro de uma categoria ou de um resultado de busca, "surpreender" com uma imagem de qualquer lugar do catálogo perderia o sentido do que o usuário está tentando fazer ali.
