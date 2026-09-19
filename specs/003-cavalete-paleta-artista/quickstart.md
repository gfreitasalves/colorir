# Quickstart: Validar o Editor em Estilo de Ateliê

Guia de validação manual end-to-end para esta feature, seguindo o Princípio V da constituição
("testar de verdade, não só compilar"). Não há suíte de testes automatizados neste projeto.

## Pré-requisitos

- Implementação completa desta feature (`/speckit-tasks` + `/speckit-implement`, ou implementação
  manual seguindo `plan.md`, `research.md` e `data-model.md`).
- `npm install` já executado.

## Setup

```bash
npm run build      # deve terminar sem erros
npm run preview    # serve a build de produção localmente
```

## Cenários de validação (mapeados às User Stories da spec)

### 1. Cavalete ao redor da área de desenho (User Story 1 / FR-001, FR-002)

1. Abra qualquer desenho no editor, em desktop.
2. **Esperado**: a área de desenho aparece visualmente apoiada sobre um cavalete de madeira
   (pernas/apoio visíveis, textura, sombra) — reconhecível sem explicação.
3. Use zoom (botões 100/150/200%, `Ctrl`+roda do mouse), arraste a imagem ampliada e clique para
   preencher uma área. **Esperado**: tudo funciona exatamente como antes — a decoração não interfere
   em nenhuma interação.
4. Troque para a ferramenta "Borracha" e "Adesivos" e confirme que também funcionam normalmente com
   o cavalete visível ao redor.

### 2. Paleta de artista na seleção de cor (User Story 2 / FR-003, FR-004)

1. Com a ferramenta "Balde" ou "Borracha" ativa, abra o painel lateral.
2. **Esperado**: a seção de cores tem aparência de paleta de pintor (formato oval de madeira,
   textura, cores como pingos de tinta) — reconhecível sem explicação.
3. Clique em várias cores de famílias diferentes, use "+ Cor Personalizada", confira "Atual" e o
   histórico. **Esperado**: tudo continua funcionando exatamente como antes — nenhuma cor
   inacessível ou mais difícil de escolher.
4. Troque para "Adesivos". **Esperado**: a grade de adesivos mantém a exibição atual, sem o
   tratamento de paleta de artista (FR-006).

### 3. Zero regressão nas demais seções do painel (Edge case / FR-005)

1. Confirme que "Ações" (desfazer/refazer/limpar), "Ferramenta", "Zoom" e "Terminei!" continuam
   presentes e funcionando normalmente, fora da área estilizada como paleta.

### 4. Temas de interface e claro/escuro (Edge case / FR-008)

1. Alterne entre os 4 temas de cor de interface (Padrão, Oceano, Flor, Floresta) e entre claro/escuro
   (8 combinações no total).
2. **Esperado**: o cavalete e a paleta de artista permanecem legíveis e com contraste adequado em
   todas as combinações — a cor da madeira não muda com o tema (Decisão 4 de `research.md`), mas o
   restante do chrome (Header/Toolbar/painel) continua refletindo o tema normalmente.

## Validação mobile (obrigatória — Princípio V)

Repita os cenários 1 e 2 em um viewport mobile (Playwright com `viewport: { width: 390, height: 844 }`
ou o DevTools em modo responsivo):

1. Confirme que o cavalete se adapta ao espaço disponível sem cortar a imagem nem empurrar controles
   para fora da tela (pode simplificar detalhes decorativos, mas sem perder a identidade visual —
   FR-007).
2. Abra a gaveta de paleta (bottom sheet) e confirme que a paleta de artista cabe sem rolagem
   horizontal e sem cortar nenhuma cor.

## Critério de pronto

- `npm run build` sem erros.
- Todos os cenários acima passam em desktop e mobile, nos 4 temas × 2 modos.
- Zero regressão observável em zoom/pan/clique do canvas e em seleção de cor/ferramenta.
- `docs/estudio-cavalete-paleta.md` criado e linkado em `docs/README.md`/`README.md`;
  `docs/painel-lateral.md` atualizado para refletir o novo visual da seção de cores.
