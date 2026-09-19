# Painel lateral (ações + ferramenta + zoom + paleta)

Todas as ações relacionadas a alterar o desenho — desfazer, refazer, limpar, trocar de ferramenta, zoom, "Terminei!", e a própria paleta de cores/adesivos — vivem juntas num único painel: `Palette.jsx`. No desktop é a barra lateral fixa; no celular é a mesma componente dentro da gaveta inferior aberta pelo botão "Ferramentas".

## Por que consolidar

Antes, essas ações ficavam espalhadas na `Toolbar` (barra superior), que crescia e quebrava em várias linhas no celular (a barra chegava a ocupar 3 linhas de altura, competindo por espaço com o próprio desenho). Consolidar tudo num único painel — o mesmo que já continha a paleta de cores — deixa a barra superior enxuta (só "Voltar" e "Salvar", que não são ações de edição) e concentra toda a superfície de edição num só lugar prancheta-like: primeiro as ações que afetam o desenho, depois o que aplicar com elas (cor, padrão ou adesivo).

## Ordem das seções em `Palette.jsx`

1. **Paleta de Cores** (com o seletor de padrão de preenchimento, "+ Cor Personalizada", a cor atual e o histórico) **ou** a grade de **Adesivos**, dependendo da ferramenta ativa — vem primeiro para o usuário escolher a cor (ou adesivo) assim que abre o painel, sem precisar rolar. A "Paleta de Cores" tem [formato de paleta de artista](./paleta-de-artista.md) (contorno oval, cores como pingos de tinta); a grade de Adesivos mantém a exibição simples de sempre.
2. Uma linha divisória.
3. **Ações**: desfazer, refazer, limpar (ícones de seta curva e lixeira).
4. **Ferramenta**: balde, borracha, adesivo (ícones de balde, borracha e estrela — o mesmo grupo que antes ficava na `Toolbar`, veja [borracha.md](./borracha.md) e [adesivos.md](./adesivos.md)).
5. **Zoom**: 100% / 150% / 200% (ícone de lupa — veja [zoom.md](./zoom.md)).
6. **Terminei!**: dispara a animação de celebração (veja [celebracao.md](./celebracao.md)).

## Ícones (`ActionIcons.jsx`)

Ver [identidade-visual.md](./identidade-visual.md#ícones-de-ação-ações-ferramenta-zoom-salvar) para o porquê desses ícones serem de linha simples (monocromáticos, `currentColor`) em vez do estilo colorido usado nos ícones decorativos de paleta/pincel.

## Impacto no mobile

A `Toolbar` (topo) ficou fixa em uma única linha em qualquer tamanho de tela, já que só tem dois botões. Em compensação, no celular, ações como desfazer/refazer passam a exigir abrir a gaveta "Ferramentas" — antes elas apareciam na barra superior (embora espremidas em várias linhas). O botão da gaveta (`nav` inferior) usa um rótulo fixo "Ferramentas" com o ícone de paleta, em vez do rótulo que antes alternava entre "Cores"/"Adesivos", já que a gaveta agora mostra muito mais do que só a paleta.
