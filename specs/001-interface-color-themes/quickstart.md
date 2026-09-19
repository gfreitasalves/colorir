# Quickstart: Validar Temas de Cor da Interface

Guia de validação manual end-to-end para esta feature, seguindo o Princípio V da constituição
("testar de verdade, não só compilar"). Não há suíte de testes automatizados neste projeto — a
validação é feita rodando o app de fato.

## Pré-requisitos

- Implementação completa desta feature (`/speckit-tasks` + `/speckit-implement`, ou implementação
  manual seguindo `plan.md` e `data-model.md`).
- `npm install` já executado.

## Setup

```bash
npm run build      # deve terminar sem erros
npm run preview    # serve a build de produção localmente
```

Abra a URL impressa pelo `npm run preview` (tipicamente `http://localhost:4173`).

## Cenários de validação (mapeados às User Stories da spec)

### 1. Trocar de tema muda o chrome, não a paleta de pintura (User Story 1 / FR-001, FR-002, FR-004)

1. Abra a galeria (tela inicial) em viewport desktop.
2. No cabeçalho, abra o seletor de tema e escolha "Oceano".
3. **Esperado**: cabeçalho, barra superior e (ao entrar em um desenho) o painel lateral e botões
   passam a usar tons de azul, imediatamente, sem reload.
4. Repita para "Flor" e "Floresta" — cada um deve produzir uma paleta de chrome visivelmente
   diferente.
5. Entre em qualquer desenho para colorir e confira a paleta de pintura (as 40 cores de sempre):
   **esperado**: nenhuma cor da paleta de pintura mudou, em nenhum dos temas.

### 2. Persistência entre sessões (User Story 2 / FR-005, FR-007)

1. Com o tema "Floresta" selecionado, recarregue a página (F5) e depois feche/reabra a aba.
2. **Esperado**: o tema "Floresta" continua aplicado sem nova seleção.
3. Abra o DevTools → Application → Local Storage e limpe a chave `colorir:theme` (ou todo o
   localStorage do site). Recarregue a página.
4. **Esperado**: o app volta ao tema `padrao` (visual atual claro/escuro, sem cor de tema
   adicional) — nenhum erro no console.

### 3. Independência do alternador claro/escuro (Edge case da spec / FR-006)

1. Com o tema "Oceano" selecionado, alterne o botão de modo escuro existente (🌙/☀️) algumas vezes.
2. **Esperado**: o tema "Oceano" permanece ativo em ambos os modos, cada um com sua própria
   variante de cor (mais clara / mais escura), sem voltar ao tema `padrao`.

### 4. Descoberta e indicação visual (User Story 3 / FR-003, FR-008, FR-009)

1. Verifique que o seletor de tema aparece no cabeçalho, ao lado do botão de claro/escuro, tanto na
   tela de galeria quanto na tela de editor.
2. Abra o seletor e confirme que o tema atualmente ativo aparece marcado/destacado.

## Validação mobile (obrigatória — Princípio V)

Repita os cenários 1 e 4 em um viewport mobile (Playwright com `viewport: { width: 390, height: 844 }`
ou o DevTools em modo responsivo), já que o Header e o painel lateral (`Palette.jsx`, que abre como
gaveta no mobile) têm comportamento próprio nesse formato:

1. Confirme que o seletor de tema no cabeçalho continua acessível e utilizável (alvo de toque
   adequado) em largura mobile.
2. Abra a gaveta de paleta (bottom sheet) com um tema colorido ativo e confirme que ela também
   reflete o tema (usa as mesmas variáveis CSS que o restante do chrome).

## Critério de pronto

- `npm run build` sem erros.
- Todos os cenários acima passam em desktop e mobile.
- `docs/temas-de-interface.md` criado e linkado em `docs/README.md` e `README.md` (Princípio IV).
