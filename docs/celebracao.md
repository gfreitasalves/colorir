# Animação de "parabéns"

Botão "Terminei!" (com um ícone de check) no painel lateral do editor: comemora a conclusão do desenho com som e uma animação de confete.

## Gatilho manual, não detecção automática

Por decisão de escopo, quem decide que o desenho está pronto é a própria criança, clicando no botão — o app não tenta calcular quanto da área foi colorida para disparar isso sozinho. Detectar "terminou" automaticamente exigiria saber quanto da região colorível de cada imagem já foi preenchida, o que é mais complexo e mais propenso a acionar cedo ou tarde demais dependendo do desenho; um botão manual é simples, previsível, e dá à criança o controle de decidir quando comemorar.

## O que acontece ao clicar

`App.handleCelebrate`:
1. Toca a fanfarra (`playFanfare()` de [`useSound.js`](./efeitos-sonoros.md)).
2. Mostra o componente `Celebration` por cima de toda a tela.

## `Celebration.jsx`

Uma overlay em tela cheia (`position: fixed`, `pointer-events-none` para não bloquear cliques) com:
- 24 quadradinhos coloridos (`CONFETTI_COLORS`) caindo do topo, cada um com posição horizontal, atraso e duração de queda ligeiramente diferentes (`animationDelay`/`animationDuration` calculados a partir do índice), usando uma animação CSS (`confetti-fall`, definida em `tailwind.config.js`) que desce e gira o elemento até sair da tela.
- Uma mensagem central "🎉 Muito bem!".

O componente se fecha sozinho depois de 3 segundos (`setTimeout` dentro de um `useEffect`, com o callback `onClose` vindo de `App.jsx`), sem exigir nenhuma ação do usuário — mas não impede continuar desenhando, já que não bloqueia cliques no canvas por baixo.
