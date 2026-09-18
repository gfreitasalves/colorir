# Prompt-base para gerar imagens da galeria (ColorirApp)

Este arquivo **não é uma imagem** e não aparece na galeria do app (o catálogo só reconhece `.png/.jpg/.jpeg/.jfif/.webp/.gif/.svg` — veja [`docs/galeria.md`](../../../docs/galeria.md)). Ele fica aqui só como referência de trabalho: um "prompt de configuração" para colar em qualquer ferramenta de geração de imagens por IA, com as regras técnicas que uma imagem precisa seguir para funcionar bem neste app.

## Por que essas regras existem

O ColorirApp colore por **preenchimento por clique** (flood fill — veja [`docs/colorir-preenchimento.md`](../../../docs/colorir-preenchimento.md)): ao tocar numa área, o app pinta tudo que está contíguo àquele ponto, até esbarrar num contorno. Isso tem três implicações diretas para a arte:

- Qualquer **quebra/abertura no contorno** deixa a cor vazar para fora da área pretendida.
- Duas áreas que **se tocam sem uma linha preta separando-as** viram uma única região contígua aos olhos do algoritmo — colorir uma pinta a outra junto.
- Traços **finos demais** somem ou ficam inconsistentes dependendo do tamanho/zoom da imagem, aumentando o risco de vazamento.
- Áreas **minúsculas demais** (frestas, detalhes muito pequenos) são difíceis de tocar com precisão, principalmente no celular.

## Prompt-base (cole isto primeiro, na ferramenta de IA)

```
Create a black and white children's coloring book page illustration.

STYLE:
- Pure black outlines (#000000) on a pure white background (#FFFFFF) — no gray, no color, no shading, no gradients, no cross-hatching, no textures.
- Flat, cartoon-style line art (not photorealistic, not a rough sketch).
- No text, no letters, no watermark, no signature anywhere in the image.

LINE WORK (critical — this image will be filled by tapping regions in an app):
- Every outline must be a single continuous, fully closed line with zero gaps or breaks — each enclosed shape must be 100% sealed, since any opening lets color leak out when that area is filled.
- Adjacent shapes must NEVER touch directly or share an edge without a black outline between them — always separate distinct fillable areas with a clear black line.
- Use a consistent, medium-thick line weight throughout the whole image (not hairline-thin, not overly bold) — thick enough to stay solid and unbroken at different sizes.
- Avoid very thin slivers, tiny gaps, or narrow enclosed areas (like single blades of grass, fine whiskers, or thin jewelry chains) — simplify small details into larger, easily tappable shapes.

COMPOSITION:
- Single subject, centered, filling most of the frame, with a clear margin from the edges (nothing cropped or touching the border).
- Plain white background — no scenery clutter or small background shapes that create extra tiny fillable regions, unless the scene itself is the subject (in that case keep background elements large and simple).
- Moderate level of detail: recognizable and fun, but not so intricate that it creates dozens of tiny compartments — appropriate for young children to color.
- Square (1:1) orientation preferred — the gallery displays thumbnails in a square crop, so a square image fills the card with no wasted whitespace. Portrait (3:4) is fine for tall subjects (a full-body character, for example); the app centers it either way without cropping.
- High resolution: 1500–2000px on the longest side. The app caps every image at 1400px internally, so anything in this range gives it a sharp source to downscale from — generating at exactly the app's cap (or below) risks blurry, anti-aliased lines once the user zooms in, which is exactly what can make color leak across a thin outline.

SUBJECT:
```

## Como usar

1. Copie o bloco acima **ou** use direto um dos prompts já prontos (base + assunto combinados) em `src/assets/images/<categoria>/PROMPTS.md` — um arquivo por categoria, com 4 a 10 prompts cada.
2. Se for montar um prompt novo (personagem/cena que não está nos arquivos prontos), cole o assunto específico logo depois de `SUBJECT:`.
3. Gere a imagem numa ferramenta com licenciamento compatível com uso público (ver comparativo já discutido — Google Gemini, ChatGPT free e Canva são as opções mais seguras).
4. Confira visualmente antes de usar: contornos fechados, nenhuma área grudada na vizinha, sem vazamento óbvio de linha.
5. Teste o preenchimento de fato no app antes de considerar aprovada (abra a imagem no editor e clique em algumas áreas) — a checagem visual sozinha não garante que não há vazamento.
6. Salve como PNG e coloque na pasta da categoria correspondente em `src/assets/images/<categoria>/`.
