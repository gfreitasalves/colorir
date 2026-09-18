# Salvar e exportar

## Rascunho automático (draft)

Enquanto o usuário desenha, cada preenchimento chama `saveDraft(imageId, drawCanvas)` (`imageUtils.js`), que serializa só a camada de desenho como PNG (`toDataURL`) e grava em `localStorage` sob a chave `colorir:draft:<imageId>`. Ao reabrir a mesma imagem depois, `loadDraft(imageId)` recupera esse PNG e ele é redesenhado sobre a camada de desenho antes de qualquer interação — o progresso não é perdido ao trocar de imagem ou fechar a aba.

O botão "Limpar" (restaurar imagem original) chama `clearDraft(imageId)` além de limpar o canvas, então o rascunho salvo também é descartado.

## Exportar como imagem (`exportImage`)

Ao clicar em "Salvar" na barra de ferramentas:

1. As camadas base (imagem original) e de desenho (coloração) são combinadas em um canvas temporário único (`mergedCanvas`), na ordem base → desenho.
2. Para PNG, o canvas mesclado é exportado diretamente (`toDataURL('image/png')`), preservando transparência onde o usuário não preencheu.
3. Para JPG (a função também suporta esse formato, embora o botão atual só exponha PNG), é desenhado primeiro um fundo branco opaco antes da imagem mesclada, já que JPEG não tem canal alfa.
4. O nome do arquivo é gerado a partir do título da imagem (normalizado para minúsculas, sem acentos, com `_` no lugar de espaços) mais um timestamp (`titulo_2026-09-12_14-30.png`), evitando sobrescrever exportações anteriores.
5. O download é disparado criando um `<a download>` temporário e simulando um clique — sem precisar de nenhuma biblioteca externa.
