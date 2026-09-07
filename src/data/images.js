const W = 800
const H = 800
const CX = W / 2
const CY = H / 2
const STROKE = '#1f2937'
const SW = 5

function svgWrap(body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">` +
    `<rect x="0" y="0" width="${W}" height="${H}" fill="#ffffff" />` +
    body +
    `</svg>`
}

function polar(cx, cy, r, angleDeg) {
  const a = (angleDeg * Math.PI) / 180
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)]
}

function mandalaFlores() {
  const petals = []
  for (let i = 0; i < 8; i++) {
    const angle = (360 / 8) * i
    const [x1, y1] = polar(CX, CY, 90, angle)
    const [x2, y2] = polar(CX, CY, 260, angle)
    const [xc1, yc1] = polar(CX, CY, 170, angle - 18)
    const [xc2, yc2] = polar(CX, CY, 170, angle + 18)
    petals.push(
      `<path d="M ${x1.toFixed(1)} ${y1.toFixed(1)} Q ${xc1.toFixed(1)} ${yc1.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)} Q ${xc2.toFixed(1)} ${yc2.toFixed(1)} ${x1.toFixed(1)} ${y1.toFixed(1)} Z" fill="none" stroke="${STROKE}" stroke-width="${SW}" />`
    )
  }
  const dots = []
  for (let i = 0; i < 16; i++) {
    const [x, y] = polar(CX, CY, 330, (360 / 16) * i)
    dots.push(`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="16" fill="none" stroke="${STROKE}" stroke-width="${SW}" />`)
  }
  return svgWrap(
    `<circle cx="${CX}" cy="${CY}" r="380" fill="none" stroke="${STROKE}" stroke-width="${SW}" />` +
      `<circle cx="${CX}" cy="${CY}" r="90" fill="none" stroke="${STROKE}" stroke-width="${SW}" />` +
      `<circle cx="${CX}" cy="${CY}" r="45" fill="none" stroke="${STROKE}" stroke-width="${SW}" />` +
      petals.join('') +
      dots.join('')
  )
}

function padraoGeometrico() {
  const cells = []
  const size = 100
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const x = col * size
      const y = row * size
      if ((row + col) % 2 === 0) {
        cells.push(
          `<polygon points="${x + size / 2},${y} ${x + size},${y + size / 2} ${x + size / 2},${y + size} ${x},${y + size / 2}" fill="none" stroke="${STROKE}" stroke-width="${SW}" />`
        )
      } else {
        cells.push(`<circle cx="${x + size / 2}" cy="${y + size / 2}" r="${size / 2.6}" fill="none" stroke="${STROKE}" stroke-width="${SW}" />`)
      }
    }
  }
  return svgWrap(cells.join(''))
}

function personagemCartoon() {
  return svgWrap(`
    <circle cx="${CX}" cy="320" r="200" fill="none" stroke="${STROKE}" stroke-width="${SW}" />
    <rect x="300" y="480" width="200" height="220" rx="30" fill="none" stroke="${STROKE}" stroke-width="${SW}" />
    <circle cx="330" cy="280" r="30" fill="none" stroke="${STROKE}" stroke-width="${SW}" />
    <circle cx="470" cy="280" r="30" fill="none" stroke="${STROKE}" stroke-width="${SW}" />
    <path d="M 340 380 Q 400 430 460 380" fill="none" stroke="${STROKE}" stroke-width="${SW}" />
    <rect x="250" y="160" width="40" height="90" rx="10" fill="none" stroke="${STROKE}" stroke-width="${SW}" />
    <rect x="510" y="160" width="40" height="90" rx="10" fill="none" stroke="${STROKE}" stroke-width="${SW}" />
    <circle cx="270" cy="150" r="22" fill="none" stroke="${STROKE}" stroke-width="${SW}" />
    <circle cx="530" cy="150" r="22" fill="none" stroke="${STROKE}" stroke-width="${SW}" />
    <rect x="150" y="520" width="80" height="140" rx="20" fill="none" stroke="${STROKE}" stroke-width="${SW}" />
    <rect x="570" y="520" width="80" height="140" rx="20" fill="none" stroke="${STROKE}" stroke-width="${SW}" />
  `)
}

function paisagemSimples() {
  return svgWrap(`
    <circle cx="640" cy="150" r="80" fill="none" stroke="${STROKE}" stroke-width="${SW}" />
    <path d="M 60 500 Q 200 380 340 500 Q 480 380 620 500 Q 700 440 760 500" fill="none" stroke="${STROKE}" stroke-width="${SW}" />
    <path d="M 0 620 Q 150 520 320 620 Q 480 700 650 610 Q 750 560 800 620 L 800 800 L 0 800 Z" fill="none" stroke="${STROKE}" stroke-width="${SW}" />
    <path d="M 200 620 L 200 460" fill="none" stroke="${STROKE}" stroke-width="${SW}" />
    <path d="M 200 460 Q 140 420 150 360 Q 200 390 200 340 Q 250 390 250 350 Q 270 410 200 460 Z" fill="none" stroke="${STROKE}" stroke-width="${SW}" />
    <path d="M 120 220 Q 100 200 120 180 Q 130 150 160 160 Q 180 130 210 155 Q 240 150 240 180 Q 260 190 245 215 Q 250 240 220 240 L 140 240 Q 110 245 120 220 Z" fill="none" stroke="${STROKE}" stroke-width="${SW}" />
  `)
}

function animalBorboleta() {
  return svgWrap(`
    <line x1="${CX}" y1="180" x2="${CX}" y2="620" stroke="${STROKE}" stroke-width="${SW}" />
    <path d="M ${CX} 220 Q 250 100 130 220 Q 60 340 180 400 Q 260 420 ${CX} 340 Z" fill="none" stroke="${STROKE}" stroke-width="${SW}" />
    <path d="M ${CX} 380 Q 280 400 220 500 Q 200 600 320 600 Q 420 580 ${CX} 460 Z" fill="none" stroke="${STROKE}" stroke-width="${SW}" />
    <path d="M ${CX} 220 Q 550 100 670 220 Q 740 340 620 400 Q 540 420 ${CX} 340 Z" fill="none" stroke="${STROKE}" stroke-width="${SW}" />
    <path d="M ${CX} 380 Q 520 400 580 500 Q 600 600 480 600 Q 380 580 ${CX} 460 Z" fill="none" stroke="${STROKE}" stroke-width="${SW}" />
    <circle cx="180" cy="270" r="30" fill="none" stroke="${STROKE}" stroke-width="${SW}" />
    <circle cx="620" cy="270" r="30" fill="none" stroke="${STROKE}" stroke-width="${SW}" />
    <path d="M ${CX} 190 Q 420 140 460 100" fill="none" stroke="${STROKE}" stroke-width="${SW}" />
    <path d="M ${CX} 190 Q 380 140 340 100" fill="none" stroke="${STROKE}" stroke-width="${SW}" />
  `)
}

function motivoAbstrato() {
  return svgWrap(`
    <path d="M 100 400 Q 250 150 400 400 Q 550 650 700 400" fill="none" stroke="${STROKE}" stroke-width="${SW}" />
    <path d="M 100 500 Q 250 250 400 500 Q 550 750 700 500" fill="none" stroke="${STROKE}" stroke-width="${SW}" />
    <circle cx="200" cy="200" r="70" fill="none" stroke="${STROKE}" stroke-width="${SW}" />
    <circle cx="600" cy="620" r="90" fill="none" stroke="${STROKE}" stroke-width="${SW}" />
    <polygon points="500,120 560,220 440,220" fill="none" stroke="${STROKE}" stroke-width="${SW}" />
    <polygon points="150,620 240,700 60,700" fill="none" stroke="${STROKE}" stroke-width="${SW}" />
    <rect x="620" y="150" width="110" height="110" rx="20" fill="none" stroke="${STROKE}" stroke-width="${SW}" transform="rotate(20 675 205)" />
  `)
}

function florGrande() {
  const petals = []
  for (let i = 0; i < 6; i++) {
    const angle = (360 / 6) * i
    const [x1, y1] = polar(CX, CY, 60, angle)
    const [x2, y2] = polar(CX, CY, 300, angle)
    const [xc1, yc1] = polar(CX, CY, 190, angle - 28)
    const [xc2, yc2] = polar(CX, CY, 190, angle + 28)
    petals.push(
      `<path d="M ${x1.toFixed(1)} ${y1.toFixed(1)} Q ${xc1.toFixed(1)} ${yc1.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)} Q ${xc2.toFixed(1)} ${yc2.toFixed(1)} ${x1.toFixed(1)} ${y1.toFixed(1)} Z" fill="none" stroke="${STROKE}" stroke-width="${SW}" />`
    )
  }
  return svgWrap(
    petals.join('') +
      `<circle cx="${CX}" cy="${CY}" r="60" fill="none" stroke="${STROKE}" stroke-width="${SW}" />` +
      `<path d="M ${CX} 700 L ${CX} 780" fill="none" stroke="${STROKE}" stroke-width="${SW}" />` +
      `<path d="M ${CX} 740 Q 300 760 260 700 Q 320 680 ${CX} 740 Z" fill="none" stroke="${STROKE}" stroke-width="${SW}" />` +
      `<path d="M ${CX} 740 Q 500 760 540 700 Q 480 680 ${CX} 740 Z" fill="none" stroke="${STROKE}" stroke-width="${SW}" />`
  )
}

function iconesDiversos() {
  const icons = []
  const positions = [
    [200, 200], [400, 200], [600, 200],
    [200, 400], [400, 400], [600, 400],
    [200, 600], [400, 600], [600, 600],
  ]
  const shapes = ['star', 'heart', 'circle', 'square', 'triangle', 'circle', 'star', 'square', 'heart']
  positions.forEach(([x, y], i) => {
    const shape = shapes[i]
    if (shape === 'circle') {
      icons.push(`<circle cx="${x}" cy="${y}" r="70" fill="none" stroke="${STROKE}" stroke-width="${SW}" />`)
    } else if (shape === 'square') {
      icons.push(`<rect x="${x - 60}" y="${y - 60}" width="120" height="120" rx="14" fill="none" stroke="${STROKE}" stroke-width="${SW}" />`)
    } else if (shape === 'triangle') {
      icons.push(`<polygon points="${x},${y - 70} ${x + 70},${y + 60} ${x - 70},${y + 60}" fill="none" stroke="${STROKE}" stroke-width="${SW}" />`)
    } else if (shape === 'star') {
      const pts = []
      for (let k = 0; k < 10; k++) {
        const r = k % 2 === 0 ? 70 : 30
        const [px, py] = polar(x, y, r, k * 36 - 90)
        pts.push(`${px.toFixed(1)},${py.toFixed(1)}`)
      }
      icons.push(`<polygon points="${pts.join(' ')}" fill="none" stroke="${STROKE}" stroke-width="${SW}" />`)
    } else if (shape === 'heart') {
      icons.push(
        `<path d="M ${x} ${y + 55} C ${x - 90} ${y - 10}, ${x - 40} ${y - 90}, ${x} ${y - 30} C ${x + 40} ${y - 90}, ${x + 90} ${y - 10}, ${x} ${y + 55} Z" fill="none" stroke="${STROKE}" stroke-width="${SW}" />`
      )
    }
  })
  return svgWrap(icons.join(''))
}

export const images = [
  { id: 'img_001', titulo: 'Mandala Flores', largura: W, altura: H, formato: 'svg', svg: mandalaFlores() },
  { id: 'img_002', titulo: 'Padrão Geométrico', largura: W, altura: H, formato: 'svg', svg: padraoGeometrico() },
  { id: 'img_003', titulo: 'Personagem Cartoon', largura: W, altura: H, formato: 'svg', svg: personagemCartoon() },
  { id: 'img_004', titulo: 'Paisagem Simples', largura: W, altura: H, formato: 'svg', svg: paisagemSimples() },
  { id: 'img_005', titulo: 'Borboleta', largura: W, altura: H, formato: 'svg', svg: animalBorboleta() },
  { id: 'img_006', titulo: 'Motivo Abstrato', largura: W, altura: H, formato: 'svg', svg: motivoAbstrato() },
  { id: 'img_007', titulo: 'Flor Grande', largura: W, altura: H, formato: 'svg', svg: florGrande() },
  { id: 'img_008', titulo: 'Ícones Diversos', largura: W, altura: H, formato: 'svg', svg: iconesDiversos() },
]
