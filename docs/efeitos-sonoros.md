# Efeitos sonoros

Um "blip" curto toca a cada preenchimento, apagada ou adesivo colocado com sucesso — sem depender de nenhum arquivo de áudio.

## Sons sintetizados via Web Audio API

`src/hooks/useSound.js` gera os sons no próprio código, com `OscillatorNode` (onda senoidal) + `GainNode` (para o volume subir e cair suavemente, evitando um "clique" seco no início/fim do som):

- **`playBlip()`**: um tom curto (0.12s) com frequência levemente aleatória (500–750Hz) a cada vez, para não soar repetitivo em cliques seguidos.
- **`playFanfare()`**: uma sequência de 4 notas (dó-mi-sol-dó, uma oitava acima) tocadas em cascata, usada pela [animação de celebração](./celebracao.md).

Essa abordagem foi escolhida deliberadamente para evitar reabrir a mesma questão de licenciamento já levantada para as imagens da galeria (veja [galeria.md](./galeria.md)) — não há nenhum arquivo de áudio de terceiros envolvido, só osciladores gerados em tempo real.

## Tocando o som só quando algo realmente mudou

`useCanvas.fillAt` e `useCanvas.stampAt` agora retornam se a ação teve efeito visual (`true`/`false`), e `App.handleCanvasClick` só chama `playBlip()` quando o retorno é `true` — clicar com a borracha numa área já vazia, por exemplo, não tem por que emitir som, já que também não gera passo de undo (veja [borracha.md](./borracha.md)).

## Botão de mudo

Um botão 🔊/🔇 no cabeçalho (`Header.jsx`) alterna `muted`, persistido em `localStorage` (`colorir:muted`) no mesmo padrão do modo escuro — a preferência sobrevive a um recarregamento de página.
