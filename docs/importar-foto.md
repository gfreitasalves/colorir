# Importar foto própria → contorno para colorir

Botão "📷 Minha foto" na tela de categorias da galeria: deixa o usuário escolher uma foto do próprio dispositivo e transformá-la em um desenho de contorno (linha preta sobre fundo branco), pronto para colorir como qualquer outra imagem do catálogo.

## Tudo acontece no navegador

Todo o processamento roda **inteiramente no dispositivo do usuário** — a foto nunca é enviada a nenhum servidor, nunca é salva em `src/assets/images/` e nunca fica disponível para outros visitantes do site. Essa foi uma decisão deliberada de escopo (veja [galeria.md](./galeria.md)): como a foto pode conter pessoas, evitar qualquer upload ou persistência compartilhada evita reabrir a mesma questão de moderação/privacidade que já existe para as imagens da galeria.

Na prática, a "imagem" que abre no editor é só uma `data:image/png` gerada localmente (`src/utils/edgeDetection.js`), com um `id` temporário (`import-<timestamp>`) — se o usuário sair e voltar à galeria, ela não aparece em lugar nenhum; só o rascunho de coloração (se ele continuar exatamente na mesma sessão) fica em `localStorage`, do mesmo jeito que qualquer outra imagem (veja [salvar-exportar.md](./salvar-exportar.md)).

## Pipeline de detecção de borda (`photoFileToColoringPage`)

1. **Ler o arquivo**: `FileReader.readAsDataURL` converte o arquivo escolhido em uma data URL.
2. **Redimensionar**: a foto é desenhada num `<canvas>` oculto, limitada a no máximo 1000px no maior lado (reaproveitando `fitDimensions` de `imageUtils.js`), para manter o processamento rápido mesmo em fotos de alta resolução de celular.
3. **Escala de cinza**: cada pixel vira um único valor de luminância (`0.299·R + 0.587·G + 0.114·B`).
4. **Operador de Sobel**: para cada pixel (exceto a borda de 1px da imagem), aplica dois kernels 3×3 (`GX_KERNEL`/`GY_KERNEL`) para estimar o gradiente horizontal e vertical de luminância; a magnitude do gradiente (`√(gx² + gy²)`) indica o quanto aquele ponto parece uma borda.
5. **Binarização**: pixels com magnitude acima de um limiar (`threshold`, padrão 60) viram preto (borda); todo o resto vira branco.

O resultado é uma imagem preto-e-branco com a mesma "forma" de um desenho de colorir, gerada a partir de qualquer foto, sem depender de nenhuma biblioteca externa de visão computacional.

## Escopo da v1

Por decisão de escopo, essa é uma detecção de borda simples e de parâmetros fixos (sem ajuste de sensibilidade pelo usuário, sem remoção de fundo) — funciona melhor com fotos de contornos bem definidos (um brinquedo, um desenho, uma folha) do que com fotos complexas ou com muito ruído visual. Enquanto a foto é processada, o botão mostra "⏳ Processando..." e fica desabilitado; se algo der errado (arquivo corrompido, formato não suportado), uma mensagem simples pede para tentar outra imagem.
