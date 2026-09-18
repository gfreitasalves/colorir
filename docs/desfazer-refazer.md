# Desfazer / Refazer

Implementado como um hook genérico reutilizável, `useUndo.js`, que não sabe nada sobre canvas ou cores — ele só gerencia três listas: `past`, `present` e `future`.

## `useUndo(initialPresent)`

- `set(newPresent)`: empilha o `present` atual em `past` (mantendo no máximo os últimos 20 estados) e limpa `future` — o comportamento padrão de undo/redo: qualquer ação nova descarta o "futuro" de um undo anterior.
- `undo()`: move o topo de `past` para `present`, empurrando o `present` atual para o início de `future`.
- `redo()`: o inverso — move o início de `future` de volta para `present`, empurrando o `present` atual para `past`.
- `reset(newPresent)`: zera past/future e define um novo presente (usado ao carregar uma imagem nova, para não misturar histórico de desenhos diferentes).

## Integração com o canvas (`useCanvas.js`)

- O "presente" armazenado é um `ImageData` — um snapshot bruto dos pixels da camada de desenho (não da imagem base).
- Toda vez que um preenchimento realmente muda algo, `pushSnapshot()` é chamado: lê o `ImageData` atual do canvas de desenho e chama `set(...)`.
- Um `useEffect` observa `present` e, sempre que ele muda (por causa de um `set`, `undo` ou `redo`), reaplica esse `ImageData` no canvas via `ctx.putImageData(...)` — ou seja, desfazer/refazer visualmente é só "desenhar de volta" um snapshot anterior/posterior.
- Carregar uma nova imagem chama `resetHistory(snapshot)` com o estado inicial (vazio, ou o rascunho salvo em `localStorage`, se existir).

## Atalhos de teclado

Registrados em `App.jsx` num único listener de `keydown` global, ativo apenas na tela do editor:
- `Ctrl/Cmd + Z` → desfazer
- `Ctrl/Cmd + Shift + Z` ou `Ctrl/Cmd + Y` → refazer

Os botões de desfazer/refazer (ícones de seta curva) no painel lateral (`Palette.jsx`) ficam desabilitados (`canUndo`/`canRedo`) quando não há o que desfazer/refazer.
