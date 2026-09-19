# Phase 1 Data Model: Temas de Cor da Interface

Esta feature não introduz nenhum dado persistido no backend (não há backend). As únicas
"entidades" são um valor de preferência do usuário (persistido no navegador) e um catálogo estático
de opções, no mesmo espírito de `presetColors.js` para a paleta de pintura.

## Entidade: Tema de Interface (`InterfaceTheme`)

Catálogo estático, definido em `src/data/interfaceThemes.js`. Não é editável pelo usuário nem
armazenado em `localStorage` — apenas o `id` do tema escolhido é persistido (ver "Preferência de
Tema" abaixo).

| Campo         | Tipo   | Descrição                                                                 |
|---------------|--------|-----------------------------------------------------------------------------|
| `id`          | string | Identificador estável usado no atributo `data-theme` e em `localStorage`. Valores: `padrao`, `oceano`, `flor`, `floresta`. |
| `nome`        | string | Nome exibido ao usuário no seletor (ex.: "Oceano", "Flor", "Floresta", "Padrão"). |
| `corDestaque` | string (hex) | Cor usada apenas para desenhar o próprio botão/swatch do tema no seletor (não estiliza o restante do chrome — isso é responsabilidade do CSS por `data-theme`). |

**Regras de validação**:
- `id` deve ser um dos 4 valores conhecidos; qualquer outro valor lido de `localStorage` (corrompido
  ou de uma versão futura) é tratado como `padrao` (FR-007 da spec).
- O tema `padrao` corresponde ao visual atual do app (sem variáveis de tema adicionais) e sempre
  deve existir como primeira opção da lista.

**Relacionamentos**: Nenhum — é uma lista estática independente de `colorFamilies` (paleta de
pintura em `presetColors.js`), sem nenhuma referência cruzada entre as duas (Princípio de escopo da
spec: FR-002).

## Preferência de Tema (estado runtime + persistência)

Não é uma entidade de dados no sentido tradicional, mas o único "estado" desta feature:

| Campo   | Tipo                                   | Onde vive                                              |
|---------|-----------------------------------------|---------------------------------------------------------|
| `theme` | string (um dos `id` de `InterfaceTheme`) | Estado React em `App.jsx` (mesmo nível que `darkMode`), inicializado a partir de `localStorage.getItem('colorir:theme')`, com fallback `'padrao'`. Persistido de volta a cada mudança via `useEffect`, e refletido no DOM via `document.documentElement.setAttribute('data-theme', theme)`. |

**Transições de estado**: Único evento é a escolha explícita de um tema pelo usuário no
`ThemePicker`; não há transições automáticas além do valor inicial (fallback para `padrao` na
ausência/corrupção do valor salvo).
