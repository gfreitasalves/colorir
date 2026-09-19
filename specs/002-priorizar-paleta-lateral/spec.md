# Feature Specification: Priorizar a Seleção de Cor no Painel Lateral

**Feature Branch**: `002-priorizar-paleta-lateral`

**Created**: 2026-09-19

**Status**: Draft

**Input**: User description: "colocar a seleção de cor primeiro no menu lateral"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Ver a seleção de cor assim que o painel lateral abre (Priority: P1)

Como usuário colorindo um desenho, quero que a seleção de cor (a paleta de cores para pintar, ou os
adesivos quando essa ferramenta está ativa) apareça logo no topo do painel lateral, antes das outras
seções (Ações, Ferramenta, Zoom, "Terminei!"), para poder escolher uma cor imediatamente ao abrir o
painel, sem precisar rolar a tela primeiro.

**Why this priority**: É o núcleo do pedido — a única mudança necessária para entregar o valor
pedido (encontrar a cor mais rápido). Sem isso não há feature.

**Independent Test**: Pode ser testado abrindo o editor de colorir (desktop e mobile) e observando
que a seção de seleção de cor é a primeira exibida no painel lateral, acima de "Ações".

**Acceptance Scenarios**:

1. **Given** o editor de colorir aberto com a ferramenta "Balde" ou "Borracha" ativa, **When** o
   usuário olha para o painel lateral (desktop) ou abre a gaveta de ferramentas (mobile), **Then** a
   seção "Paleta de Cores" (com as famílias de cores, o botão de padrão de preenchimento, "+ Cor
   Personalizada", a cor atual e o histórico) aparece antes das seções "Ações", "Ferramenta" e
   "Zoom".
2. **Given** o editor de colorir aberto com a ferramenta "Adesivos" ativa, **When** o usuário olha
   para o painel lateral, **Then** a seção "Adesivos" (a seleção equivalente de "o que aplicar no
   desenho" nesse modo) também aparece antes de "Ações", "Ferramenta" e "Zoom", mantendo a mesma
   posição de destaque que a "Paleta de Cores" tem nos outros modos.

---

### Edge Cases

- O que acontece ao trocar de ferramenta (de "Balde"/"Borracha" para "Adesivos" e vice-versa)? A
  seção que aparece em primeiro lugar troca de conteúdo ("Paleta de Cores" ↔ "Adesivos"), mas
  continua sendo sempre a primeira seção do painel.
- O que acontece no painel lateral mobile (gaveta/bottom sheet)? A mesma reordenação vale ali, já
  que é o mesmo componente de painel lateral reaproveitado em telas menores.
- O botão "Terminei!" e os controles de desfazer/refazer/limpar continuam existindo e funcionando
  normalmente — apenas mudam de posição (para depois da seleção de cor/adesivo), sem nenhuma
  mudança de comportamento.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O painel lateral DEVE exibir a seção de seleção de cor ("Paleta de Cores", incluindo
  as famílias de cores, o seletor de padrão de preenchimento, o botão de cor personalizada, a cor
  atual e o histórico de cores) como a primeira seção visível, antes de "Ações", "Ferramenta" e
  "Zoom".
- **FR-002**: Quando a ferramenta "Adesivos" estiver ativa, o painel lateral DEVE exibir a seção
  "Adesivos" (em vez da "Paleta de Cores") também como a primeira seção, na mesma posição de
  destaque.
- **FR-003**: A reordenação DEVE valer tanto no painel lateral fixo (desktop) quanto na gaveta de
  ferramentas (mobile), já que ambos reaproveitam o mesmo componente.
- **FR-004**: Nenhuma funcionalidade existente do painel lateral (desfazer, refazer, limpar,
  seleção de ferramenta, zoom, "Terminei!", seleção de cor/adesivo, histórico) DEVE ser removida ou
  ter seu comportamento alterado — apenas a ordem de exibição das seções muda.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Ao abrir o editor de colorir, o usuário vê a seção de seleção de cor (ou adesivos)
  sem precisar rolar o painel lateral, em telas de tamanho comum de desktop e mobile.
- **SC-002**: 100% das demais funcionalidades do painel lateral (Ações, Ferramenta, Zoom,
  "Terminei!") continuam acessíveis e funcionando exatamente como antes, apenas em uma posição
  diferente.

## Assumptions

- "Seleção de cor" refere-se a todo o bloco hoje exibido condicionalmente no painel lateral
  (Paleta de Cores + Preenchimento + Cor Personalizada + Atual + Histórico quando a ferramenta é
  Balde/Borracha, ou Adesivos quando essa ferramenta está ativa) — não apenas às famílias de cores
  isoladamente — já que faz mais sentido mover o bloco inteiro de "o que vou aplicar no desenho"
  para o topo do que separar suas partes.
- A nova ordem do painel lateral passa a ser: seleção de cor/adesivo → Ações → Ferramenta → Zoom →
  "Terminei!".
- Nenhuma mudança visual é necessária além da reordenação (cores, ícones e textos de cada seção
  permanecem os mesmos).
