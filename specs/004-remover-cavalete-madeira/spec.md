# Feature Specification: Remover Cavalete e Textura de Madeira

**Feature Branch**: `004-remover-cavalete-madeira`

**Created**: 2026-09-19

**Status**: Draft

**Input**: User description: "Não gostei das imagens de madeira pode remover somente elas e o cavalete, a estilização da seleção de cores gostei"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Remover o cavalete e a madeira da área de desenho (Priority: P1)

Como usuário no editor de colorir, quero que a área de desenho volte a ter um fundo simples e
neutro, sem a moldura de cavalete de madeira introduzida recentemente, para não ter mais esse
visual que não agradou.

**Why this priority**: É o principal motivo do pedido — remover algo que o usuário explicitamente
não gostou.

**Independent Test**: Pode ser testado abrindo qualquer desenho no editor e confirmando que não há
mais moldura de madeira, pernas de cavalete ou barra de apoio ao redor da área de desenho, em
desktop e mobile.

**Acceptance Scenarios**:

1. **Given** o usuário abre um desenho para colorir, **When** a tela do editor é exibida, **Then**
   a área de desenho aparece com um fundo simples e neutro, sem nenhuma decoração de cavalete ou
   textura de madeira.
2. **Given** o usuário está desenhando/colorindo normalmente, **When** ele usa zoom, arrasta a
   imagem ampliada ou clica para pintar, **Then** todas as interações continuam funcionando
   exatamente como antes — a remoção do cavalete é só visual.

---

### User Story 2 - Manter a estilização da seleção de cores, sem madeira (Priority: P1)

Como usuário escolhendo uma cor para pintar, quero continuar vendo a seção de cores com o visual de
paleta de artista que gostei (formato oval, cores como pingos de tinta), mas sem a aparência de
madeira usada até agora, para ficar só com a parte do visual novo que agradou.

**Why this priority**: O usuário foi explícito ao dizer que gostou dessa parte — remover a madeira
sem preservar isso seria perder algo que ele quer manter.

**Independent Test**: Pode ser testado abrindo o painel lateral com a ferramenta "Balde"/"Borracha"
ativa e confirmando que a seção de cores continua com o formato de paleta (contorno arredondado,
cores em formato de pingo de tinta), mas sem textura ou cor de madeira — usando outra cor de fundo
neutra/consistente com o resto da interface.

**Acceptance Scenarios**:

1. **Given** o usuário abre o painel lateral com "Balde"/"Borracha" ativo, **When** ele olha para a
   seção de cores, **Then** ela mantém o formato de paleta (contorno arredondado/oval) e as cores em
   formato de pingo de tinta, mas o fundo não tem mais aparência de madeira.
2. **Given** a nova aparência sem madeira, **When** o usuário escolhe qualquer cor, usa "+ Cor
   Personalizada", confere "Atual" ou o histórico, **Then** tudo continua funcionando exatamente
   como antes — nenhuma funcionalidade de seleção de cor é afetada.

---

### Edge Cases

- O que acontece com o texto e os controles que hoje usam cores pensadas para contraste com madeira
  (rótulos, botão "+ Cor Personalizada", caixa "Atual")? Devem passar a usar cores consistentes com
  o restante da interface (tema de cor ativo), já que o fundo deixa de ser madeira.
- O que acontece com a ferramenta "Adesivos"? Não é afetada por esta mudança — já não tinha
  tratamento de madeira nem de paleta de artista.
- A remoção deve valer em todos os 4 temas de cor de interface (Padrão, Oceano, Flor, Floresta) e
  nos modos claro/escuro, sem deixar nenhum resquício de madeira em nenhuma combinação.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema DEVE remover toda a decoração de cavalete (pernas, barra de apoio/ledge) ao
  redor da área de desenho.
- **FR-002**: O sistema DEVE remover toda textura/cor de madeira da interface, tanto do cavalete
  quanto do contorno da seção de seleção de cor.
- **FR-003**: A área de desenho DEVE voltar a ter um fundo simples e neutro (sem cavalete/madeira),
  sem alterar nenhum comportamento de zoom, pan, clique para preencher, borracha ou adesivo.
- **FR-004**: A seção de seleção de cor no painel lateral DEVE manter o formato de paleta de artista
  (contorno arredondado/oval, cores em formato de pingo de tinta) introduzido anteriormente, porém
  sem nenhuma textura ou cor de madeira em seu fundo.
- **FR-005**: Os textos e controles complementares da seção de cores (rótulo "Preenchimento", botão
  "+ Cor Personalizada", caixa "Atual", título "Histórico") DEVEM usar cores legíveis e consistentes
  com o restante da interface (tema de cor ativo), já que deixam de ter um fundo de madeira como
  referência de contraste.
- **FR-006**: Nenhuma funcionalidade de seleção de cor (famílias de cor, padrão de preenchimento,
  cor personalizada, cor atual, histórico) pode ser removida ou alterada em comportamento — só a
  aparência do fundo muda.
- **FR-007**: A mudança DEVE valer em desktop e mobile, e permanecer legível nos 4 temas de cor de
  interface (Padrão/Oceano/Flor/Floresta) e nos modos claro/escuro, sem nenhum resquício visual de
  madeira em nenhuma combinação.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Nenhuma textura ou cor de madeira aparece em nenhuma tela do editor, em nenhum tema ou
  modo claro/escuro.
- **SC-002**: A área de desenho não exibe mais nenhum elemento de cavalete (pernas, apoio/ledge).
- **SC-003**: A seção de seleção de cor continua reconhecível como uma "paleta de artista" (formato
  arredondado, cores como pingos de tinta), agora sem aparência de madeira.
- **SC-004**: 100% das funcionalidades de desenho e de seleção de cor/ferramenta continuam
  funcionando exatamente como antes (zero regressões de comportamento).

## Assumptions

- "As imagens de madeira" refere-se a toda a textura/cor de madeira introduzida na feature anterior
  (cavalete e contorno da paleta de cores) — não a nenhuma outra imagem/ilustração já existente no
  app (ex.: ícones de paleta/pincel do cabeçalho, marca d'água de fundo).
- A "estilização da seleção de cores" que o usuário gostou refere-se ao formato de paleta (contorno
  arredondado/oval, furo de polegar decorativo) e ao formato de pingo de tinta das cores — não à cor
  de madeira em si, que é justamente o que deve ser removido. O novo fundo dessa seção usará cores
  neutras/consistentes com o tema de interface ativo, a critério da etapa de planejamento/implementação.
- A área de desenho, sem o cavalete, volta a um fundo simples e neutro equivalente ao que existia
  antes da feature de cavalete/paleta de artista (feature 003) — sem introduzir uma decoração nova
  no lugar.
