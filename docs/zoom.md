# Zoom no desenho

Implementado em `Canvas.jsx`, com o estado do nível de zoom (`zoom`, de `MIN_ZOOM = 1` a `MAX_ZOOM = 3`) vivendo em `App.jsx` e sendo passado tanto para o `Canvas` quanto para a `Toolbar`.

## Formas de dar zoom

- **Botões da barra de ferramentas**: 100% / 150% / 200% (`ZOOM_LEVELS` em `Toolbar.jsx`), com destaque visual (`aria-pressed`) no nível ativo (comparação com tolerância de `0.05` para lidar com valores vindos de pinça/roda do mouse que não caem exatamente em um preset).
- **`Ctrl` + roda do mouse**: incrementa/decrementa o zoom em passos de `0.15`, sempre limitado a `[MIN_ZOOM, MAX_ZOOM]`. O listener é registrado com `{ passive: false }` para poder chamar `preventDefault()` e evitar que a página role junto.
- **Pinça no toque (pinch-to-zoom)**: calculada a partir da distância entre os dois dedos (`distance`) no início do gesto (`onTouchStart`) e comparada com a distância atual a cada `touchmove`, escalando o zoom proporcionalmente.

## Por que os listeners são nativos (`addEventListener`), não JSX

Handlers sintéticos do React para toque (`onTouchMove`) são passivos por padrão — `e.preventDefault()` dentro deles não tem efeito confiável em todos os navegadores. Para garantir que o gesto de pinça não dispare o zoom nativo da página, os listeners de `wheel`/`touch*` são anexados manualmente via `useEffect` + `ref.addEventListener(..., { passive: false })`, com limpeza no cleanup do efeito.

## Ajuste de tamanho (fit) e rolagem

- Um `ResizeObserver` no contêiner de rolagem (`scrollRef`) mede o espaço disponível e calcula `fitSize`: o maior tamanho que a imagem pode ter em 100% de zoom sem sair da área visível, preservando a proporção original.
- O tamanho final exibido é `fitSize * zoom`.
- Quando o zoom muda, o scroll é recentralizado automaticamente (`el.scrollLeft`/`scrollTop` ajustados para o centro do conteúdo).
- Em zoom > 100%, a imagem passa a ultrapassar a área visível e fica navegável por rolagem (`overflow-auto` no contêiner).

## Resetando o zoom

O zoom volta para `1` (100%) automaticamente sempre que uma nova imagem é carregada, para que o usuário sempre comece uma imagem nova vendo ela inteira.
