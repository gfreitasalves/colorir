# Paleta de cores

## 40 cores em 10 famílias

`src/data/presetColors.js` define `colorFamilies`: 10 famílias temáticas, cada uma com exatamente 4 tons (claro → escuro), inspiradas nas cores de um estojo escolar infantil:

Tons de Pele, Vermelho, Laranja, Amarelo, Verde, Azul, Roxo, Rosa, Marrom, Neutro (branco/cinza/preto).

A família de **Tons de Pele** foi adicionada especificamente para permitir colorir personagens com diferentes tons de pele. Cada cor tem um `hex` e um `nome` (usado só como `aria-label`/`title` — os rótulos de texto das famílias foram removidos da interface visual para deixá-la mais limpa, mantendo apenas as amostras de cor).

`Palette.jsx` renderiza uma linha de 4 `Swatch` por família, sem cabeçalho de texto entre elas.

## Cor selecionada e histórico (`useColor.js`)

- `selectedColor`: cor atualmente ativa (usada para preencher e para o cursor de pincel).
- `history`: as últimas 8 cores diferentes selecionadas, mais recente primeiro, sem duplicatas — persistido em `localStorage` (`saveColorHistory`/`loadColorHistory` em `imageUtils.js`) para sobreviver a reloads.
- `selectColor(hex)`: normaliza o hex (`normalizeHex`, aceita formas curtas tipo `#F00`) e atualiza cor + histórico.
- `customColors` / `addCustomColor`: cores escolhidas no seletor personalizado (ver abaixo) também entram no histórico.

## Cor personalizada (`ColorPicker.jsx`)

Modal simples com:
- um `<input type="color">` nativo do navegador (abre o seletor de cor do sistema operacional);
- um campo de texto para o valor HEX, validado com `isValidHex`/`normalizeHex` (`colorUtils.js`);
- pré-visualização do RGB calculado (`hexToRgb`).

Confirmar chama `addCustomColor`, que seleciona a cor e a registra no histórico; o modal então fecha.

## Utilitários de cor (`colorUtils.js`)

Funções puras reutilizadas em toda a paleta: `isValidHex`, `normalizeHex` (sempre retorna hex de 6 dígitos maiúsculo ou `null`), `hexToRgb`, `rgbToHex`, `colorsEqual` (usado para destacar visualmente qual swatch está selecionado).
