# Feature Specification: Temas de Cor da Interface

**Feature Branch**: `001-interface-color-themes`

**Created**: 2026-09-19

**Status**: Draft

**Input**: User description: "Adicionar temas de cor para a interface do ColorirApp, além do modo claro/escuro que já existe hoje. A funcionalidade deve permitir ao usuário escolher entre algumas opções de tema visual para a interface do app (cabeçalho, barra superior, painel lateral, botões) — não confundir com as cores da paleta de pintura do desenho, que são para colorir as imagens e não devem ser afetadas. Pense em temas divertidos/coloridos apropriados para o público infantil do app (ex.: um tema com tons de azul/oceano, um com tons de rosa/roxo, um com tons verdes, além do claro e escuro padrão). A escolha do tema deve ser persistida entre sessões (mesmo padrão já usado para o modo escuro, via localStorage) e deve ficar acessível a partir do cabeçalho (Header), próximo de onde já fica o botão de alternar claro/escuro."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Escolher um tema de cor divertido para a interface (Priority: P1)

Como usuário do ColorirApp (criança ou responsável escolhendo por ela), quero poder trocar a aparência da interface do app (cabeçalho, barra superior, painel lateral, botões) por um tema de cor divertido — por exemplo, um tema de oceano, um tema rosa/roxo ou um tema verde — para deixar o app com a cara que eu gosto, sem que isso mude as cores que uso para colorir os desenhos.

**Why this priority**: É o núcleo da feature — sem a troca de tema em si, não há funcionalidade nenhuma. Entrega valor sozinho, mesmo sem persistência entre sessões.

**Independent Test**: Pode ser testado abrindo o app, selecionando um tema de cor diferente no cabeçalho e verificando visualmente que o cabeçalho, a barra superior, o painel lateral e os botões mudam de cor, enquanto a paleta de pintura do desenho permanece com as mesmas 40 cores de sempre.

**Acceptance Scenarios**:

1. **Given** o app aberto com o tema padrão (claro), **When** o usuário seleciona o tema "Oceano" no cabeçalho, **Then** o cabeçalho, a barra superior, o painel lateral e os botões passam a usar tons de azul, imediatamente e sem recarregar a página.
2. **Given** o usuário está no editor de colorir com um tema de cor selecionado, **When** o usuário observa a paleta de cores de pintura, **Then** as cores disponíveis para colorir continuam exatamente as mesmas de antes (nenhuma cor da paleta de pintura foi adicionada, removida ou alterada).

---

### User Story 2 - Manter o tema escolhido entre sessões (Priority: P2)

Como usuário que já escolheu um tema de cor, quero que o app lembre da minha escolha da próxima vez que eu abrir, do mesmo jeito que já acontece hoje com o modo escuro, para não precisar escolher o tema toda vez.

**Why this priority**: Sem persistência a feature ainda funciona (Story 1), mas fica frustrante ter que reconfigurar a cada visita — é o comportamento que os usuários já esperam por causa do modo escuro existente.

**Independent Test**: Pode ser testado selecionando um tema, fechando a aba/navegador, reabrindo o app e confirmando que o mesmo tema continua aplicado.

**Acceptance Scenarios**:

1. **Given** o usuário selecionou o tema "Floresta" (verde), **When** ele fecha e reabre o navegador no app, **Then** o tema "Floresta" continua aplicado, sem precisar selecioná-lo novamente.
2. **Given** um usuário que nunca visitou o app antes (localStorage vazio), **When** ele abre o app pela primeira vez, **Then** o app usa o tema padrão neutro (claro ou escuro, conforme a preferência de modo escuro já existente), sem nenhum tema colorido pré-selecionado.

---

### User Story 3 - Ver e alternar entre os temas disponíveis a partir do cabeçalho (Priority: P3)

Como usuário, quero encontrar facilmente o seletor de tema perto do botão de claro/escuro que já conheço, e conseguir ver qual tema está ativo no momento, para não precisar procurar essa opção em outro lugar do app.

**Why this priority**: Refina a descoberta e usabilidade da feature (Stories 1 e 2 já entregam o valor principal); sem isso a troca de tema ainda é possível, só que menos intuitiva.

**Independent Test**: Pode ser testado abrindo o cabeçalho do app e verificando que o controle de tema fica visualmente próximo ao botão de claro/escuro, e que o tema atualmente ativo é destacado/indicado no próprio controle.

**Acceptance Scenarios**:

1. **Given** o app aberto em qualquer tela (galeria ou editor), **When** o usuário olha para o cabeçalho, **Then** ele encontra o controle de seleção de tema ao lado do botão de alternar claro/escuro.
2. **Given** o tema "Flor" está ativo, **When** o usuário abre o seletor de temas, **Then** o tema "Flor" aparece visualmente marcado/destacado como o tema atual.

---

### Edge Cases

- O que acontece se o usuário limpar os dados do navegador (localStorage)? O app volta a usar o tema padrão neutro, como em uma primeira visita.
- O que acontece se o usuário alternar entre claro e escuro enquanto um tema colorido (Oceano/Flor/Floresta) está ativo? O tema colorido continua ativo e se adapta à variante clara ou escura correspondente — os dois controles (claro/escuro e tema de cor) são independentes.
- O que acontece com o tema de cor ao navegar entre a tela de galeria e a tela de editor? O tema permanece o mesmo nas duas telas, já que o cabeçalho é compartilhado.
- O que acontece se o navegador do usuário bloquear ou não suportar localStorage? O app continua funcionando normalmente, apenas sem lembrar a escolha de tema entre sessões (mesmo comportamento já aceito hoje para o modo escuro).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema DEVE oferecer ao usuário pelo menos três opções de tema de cor divertidas/coloridas além do par claro/escuro padrão já existente (por exemplo: um tema de tons de oceano/azul, um de tons de rosa/roxo, e um de tons verdes).
- **FR-002**: A seleção de tema DEVE afetar apenas os elementos de interface do app — cabeçalho (Header), barra superior (Toolbar), painel lateral (Palette) e botões de ação — e NUNCA as cores disponíveis na paleta de pintura usada para colorir os desenhos.
- **FR-003**: O sistema DEVE disponibilizar o controle de seleção de tema a partir do cabeçalho (Header), posicionado próximo ao botão existente de alternância entre claro e escuro.
- **FR-004**: O tema escolhido DEVE ser aplicado imediatamente em toda a interface, sem exigir recarregar a página.
- **FR-005**: A escolha de tema DEVE ser persistida entre sessões usando o mesmo mecanismo já usado para o modo escuro (localStorage), sendo restaurada automaticamente nas visitas seguintes.
- **FR-006**: O tema de cor DEVE funcionar de forma independente do alternador claro/escuro existente: o usuário pode alternar claro/escuro livremente e o tema de cor escolhido permanece aplicado, adaptando-se à variante clara ou escura correspondente.
- **FR-007**: Quando não houver tema de cor salvo (primeira visita, ou dado removido), o sistema DEVE usar um tema padrão neutro, equivalente ao visual atual do app (claro ou escuro, conforme a preferência de modo escuro já existente), sem nenhum tema colorido pré-selecionado.
- **FR-008**: O controle de seleção de tema DEVE indicar visualmente, de forma clara, qual tema está ativo no momento.
- **FR-009**: A seleção e a persistência de tema DEVEM funcionar de forma consistente tanto na tela de galeria quanto na tela de editor de colorir.

### Key Entities

- **Tema de interface**: um conjunto nomeado de cores (destaque, fundo, contraste) aplicado aos elementos de navegação do app — cabeçalho, barra superior, painel lateral e botões. Cada tema possui uma variante clara e uma escura, e é independente das cores de pintura disponíveis na paleta usada para colorir os desenhos.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Um usuário consegue trocar o tema de cor da interface em até 5 segundos, a partir de qualquer tela do app.
- **SC-002**: 100% das cores disponíveis na paleta de pintura usada para colorir os desenhos permanecem inalteradas após qualquer troca de tema de interface.
- **SC-003**: O tema de interface escolhido continua aplicado após o usuário fechar e reabrir o navegador, com a mesma confiabilidade já observada hoje na persistência do modo escuro.
- **SC-004**: Um usuário consegue identificar visualmente qual tema está ativo sem precisar abrir nenhuma tela ou menu adicional além do próprio controle no cabeçalho.

## Assumptions

- O app terá inicialmente 5 opções de tema: Claro (padrão atual), Escuro (padrão atual), Oceano (tons de azul), Flor (tons de rosa/roxo) e Floresta (tons de verde) — os nomes exatos e as paletas de cada tema colorido ficam a critério da etapa de planejamento/implementação.
- Cada tema de cor colorido (Oceano, Flor, Floresta) possui uma variante clara e uma escura, que se adapta ao estado atual do alternador claro/escuro já existente, em vez de substituí-lo.
- A área de desenho (canvas) e a paleta de cores de pintura (dados de `presetColors.js`) não são afetadas pelo tema de interface — o tema afeta apenas os elementos de navegação/chrome do app (Header, Toolbar, Palette panel, botões).
- A suposição de suporte a navegador já válida para o modo escuro existente (localStorage disponível na maioria dos casos, com degradação graciosa quando não disponível) também se aplica a esta feature.
