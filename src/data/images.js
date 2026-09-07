const W = 800
const H = 800
const STROKE = '#1f2937'
const SW = 5

const N = (n) => Number(n.toFixed(1))

function svgWrap(body) {
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">` +
    `<rect x="0" y="0" width="${W}" height="${H}" fill="#ffffff" />` +
    body +
    `</svg>`
  )
}

function polar(cx, cy, r, angleDeg) {
  const a = (angleDeg * Math.PI) / 180
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)]
}

function circle(cx, cy, r) {
  return `<circle cx="${N(cx)}" cy="${N(cy)}" r="${N(r)}" fill="none" stroke="${STROKE}" stroke-width="${SW}" />`
}
function dot(cx, cy, r = 6) {
  return `<circle cx="${N(cx)}" cy="${N(cy)}" r="${N(r)}" fill="${STROKE}" />`
}
function lineTag(x1, y1, x2, y2) {
  return `<line x1="${N(x1)}" y1="${N(y1)}" x2="${N(x2)}" y2="${N(y2)}" stroke="${STROKE}" stroke-width="${SW}" stroke-linecap="round" />`
}
function poly(points) {
  return `<polygon points="${points}" fill="none" stroke="${STROKE}" stroke-width="${SW}" />`
}
function pathTag(d) {
  return `<path d="${d}" fill="none" stroke="${STROKE}" stroke-width="${SW}" stroke-linecap="round" stroke-linejoin="round" />`
}
function rectTag(x, y, w, h, rx = 0) {
  return `<rect x="${N(x)}" y="${N(y)}" width="${N(w)}" height="${N(h)}" rx="${N(rx)}" fill="none" stroke="${STROKE}" stroke-width="${SW}" />`
}

function star(cx, cy, points, rOuter, rInner, rot = -90) {
  const pts = []
  for (let k = 0; k < points * 2; k++) {
    const r = k % 2 === 0 ? rOuter : rInner
    const [x, y] = polar(cx, cy, r, rot + (360 / (points * 2)) * k)
    pts.push(`${N(x)},${N(y)}`)
  }
  return poly(pts.join(' '))
}

function petal(cx, cy, angle, rInner, rOuter, spread) {
  const [x1, y1] = polar(cx, cy, rInner, angle)
  const [x2, y2] = polar(cx, cy, rOuter, angle)
  const [xc1, yc1] = polar(cx, cy, (rInner + rOuter) / 2, angle - spread)
  const [xc2, yc2] = polar(cx, cy, (rInner + rOuter) / 2, angle + spread)
  return pathTag(`M ${N(x1)} ${N(y1)} Q ${N(xc1)} ${N(yc1)} ${N(x2)} ${N(y2)} Q ${N(xc2)} ${N(yc2)} ${N(x1)} ${N(y1)} Z`)
}

function flower(cx, cy, petals, rInner, rOuter, spread, centerR) {
  let out = ''
  for (let i = 0; i < petals; i++) out += petal(cx, cy, (360 / petals) * i, rInner, rOuter, spread)
  out += circle(cx, cy, centerR)
  return out
}

function cloud(cx, cy, scale = 1) {
  return (
    circle(cx - 32 * scale, cy + 4 * scale, 22 * scale) +
    circle(cx, cy - 12 * scale, 28 * scale) +
    circle(cx + 32 * scale, cy + 4 * scale, 22 * scale) +
    pathTag(
      `M ${N(cx - 54 * scale)} ${N(cy + 10 * scale)} Q ${N(cx - 54 * scale)} ${N(cy + 30 * scale)} ${N(cx - 24 * scale)} ${N(cy + 30 * scale)} L ${N(cx + 24 * scale)} ${N(cy + 30 * scale)} Q ${N(cx + 54 * scale)} ${N(cy + 30 * scale)} ${N(cx + 54 * scale)} ${N(cy + 10 * scale)}`
    )
  )
}

function bubblesAt(list) {
  return list.map(([x, y, r]) => circle(x, y, r)).join('')
}

function seaweed(x, baseY, height, sway = 20) {
  return pathTag(
    `M ${N(x)} ${N(baseY)} Q ${N(x - sway)} ${N(baseY - height * 0.33)} ${N(x)} ${N(baseY - height * 0.66)} Q ${N(x + sway)} ${N(baseY - height * 0.85)} ${N(x)} ${N(baseY - height)}`
  )
}

function shellFan(cx, cy, r = 34) {
  let rays = ''
  for (let i = 1; i <= 4; i++) {
    const [x, y] = polar(cx, cy, r, 180 - (180 / 5) * i)
    rays += lineTag(cx, cy, x, y)
  }
  return (
    `<path d="M ${N(cx - r)} ${N(cy)} A ${N(r)} ${N(r)} 0 0 1 ${N(cx + r)} ${N(cy)}" fill="none" stroke="${STROKE}" stroke-width="${SW}" />` +
    rays
  )
}

function pineTree(cx, baseY, height = 140, width = 90) {
  const trunk = rectTag(cx - 8, baseY - 20, 16, 20)
  const layers = [0, 1, 2]
    .map((i) => {
      const y = baseY - 20 - i * height * 0.32
      const w = width * (1 - i * 0.22)
      return poly(`${N(cx)},${N(y - height * 0.42)} ${N(cx - w / 2)},${N(y)} ${N(cx + w / 2)},${N(y)}`)
    })
    .join('')
  return trunk + layers
}

function roundTree(cx, baseY, r = 55, trunkH = 40) {
  return rectTag(cx - 8, baseY - trunkH, 16, trunkH) + circle(cx, baseY - trunkH - r * 0.7, r)
}

function crownShape(cx, topY, width = 120, height = 70, points = 5) {
  const baseY = topY + height
  const step = width / (points - 1)
  let d = `M ${N(cx - width / 2)} ${N(baseY)} `
  for (let i = 0; i < points; i++) {
    const x = cx - width / 2 + step * i
    const peakY = i % 2 === 0 ? topY : topY + height * 0.45
    d += `L ${N(x)} ${N(peakY)} `
  }
  d += `L ${N(cx + width / 2)} ${N(baseY)} Z`
  return pathTag(d) + circle(cx, topY - 6, 8)
}

function heartPath(cx, cy, size = 40) {
  return pathTag(
    `M ${N(cx)} ${N(cy + size * 0.7)} C ${N(cx - size * 1.1)} ${N(cy - size * 0.2)}, ${N(cx - size * 0.5)} ${N(cy - size)}, ${N(cx)} ${N(cy - size * 0.35)} C ${N(cx + size * 0.5)} ${N(cy - size)}, ${N(cx + size * 1.1)} ${N(cy - size * 0.2)}, ${N(cx)} ${N(cy + size * 0.7)} Z`
  )
}

function zigzagWater(y, amplitude = 12, count = 8, xStart = 60, xEnd = 740) {
  const step = (xEnd - xStart) / count
  let d = `M ${N(xStart)} ${N(y)} `
  for (let i = 0; i < count; i++) {
    const x1 = xStart + step * (i + 0.5)
    const x2 = xStart + step * (i + 1)
    const yy = y + (i % 2 === 0 ? -amplitude : amplitude)
    d += `Q ${N(x1)} ${N(yy)} ${N(x2)} ${N(y)} `
  }
  return pathTag(d)
}

function tiara(cx, topY, width = 70) {
  return pathTag(
    `M ${N(cx - width / 2)} ${N(topY + 18)} L ${N(cx - width / 4)} ${N(topY)} L ${N(cx)} ${N(topY + 12)} L ${N(cx + width / 4)} ${N(topY)} L ${N(cx + width / 2)} ${N(topY + 18)}`
  )
}

// ---------- Sereias ----------

function mermaidHead(cx, cy, hair = 'long') {
  let out = circle(cx, cy, 44)
  if (hair === 'long') {
    out += pathTag(`M ${N(cx - 42)} ${N(cy - 12)} Q ${N(cx - 70)} ${N(cy + 70)} ${N(cx - 38)} ${N(cy + 170)}`)
    out += pathTag(`M ${N(cx + 42)} ${N(cy - 12)} Q ${N(cx + 70)} ${N(cy + 70)} ${N(cx + 38)} ${N(cy + 170)}`)
  } else if (hair === 'wavy') {
    out += pathTag(
      `M ${N(cx - 42)} ${N(cy - 8)} Q ${N(cx - 80)} ${N(cy + 30)} ${N(cx - 55)} ${N(cy + 75)} Q ${N(cx - 78)} ${N(cy + 115)} ${N(cx - 45)} ${N(cy + 150)}`
    )
    out += pathTag(
      `M ${N(cx + 42)} ${N(cy - 8)} Q ${N(cx + 80)} ${N(cy + 30)} ${N(cx + 55)} ${N(cy + 75)} Q ${N(cx + 78)} ${N(cy + 115)} ${N(cx + 45)} ${N(cy + 150)}`
    )
  } else {
    out += pathTag(`M ${N(cx - 42)} ${N(cy - 10)} Q ${N(cx - 58)} ${N(cy + 25)} ${N(cx - 30)} ${N(cy + 55)}`)
    out += pathTag(`M ${N(cx + 42)} ${N(cy - 10)} Q ${N(cx + 58)} ${N(cy + 25)} ${N(cx + 30)} ${N(cy + 55)}`)
  }
  out += dot(cx - 14, cy - 4, 4) + dot(cx + 14, cy - 4, 4)
  return out
}

function mermaidTorso(cx, headCy, waistY) {
  const shoulderY = headCy + 50
  return pathTag(
    `M ${N(cx - 38)} ${N(shoulderY)} Q ${N(cx - 52)} ${N((shoulderY + waistY) / 2)} ${N(cx - 30)} ${N(waistY)} L ${N(cx + 30)} ${N(waistY)} Q ${N(cx + 52)} ${N((shoulderY + waistY) / 2)} ${N(cx + 38)} ${N(shoulderY)} Z`
  )
}

function mermaidTail(cx, waistY, { length = 250, width = 65, finWidth = 170 } = {}) {
  const bottomY = waistY + length
  const body = pathTag(
    `M ${N(cx - width)} ${N(waistY)} Q ${N(cx - width * 0.65)} ${N(waistY + length * 0.6)} ${N(cx - width * 0.3)} ${N(bottomY)} L ${N(cx + width * 0.3)} ${N(bottomY)} Q ${N(cx + width * 0.65)} ${N(waistY + length * 0.6)} ${N(cx + width)} ${N(waistY)} Z`
  )
  const finL = poly(`${N(cx - width * 0.3)},${N(bottomY)} ${N(cx - finWidth / 2)},${N(bottomY + 45)} ${N(cx - 8)},${N(bottomY + 12)}`)
  const finR = poly(`${N(cx + width * 0.3)},${N(bottomY)} ${N(cx + finWidth / 2)},${N(bottomY + 45)} ${N(cx + 8)},${N(bottomY + 12)}`)
  const arcs = [0.35, 0.6, 0.85]
    .map((f) => {
      const yy = waistY + length * f
      const ww = width * (1 - f * 0.6)
      return pathTag(`M ${N(cx - ww)} ${N(yy)} Q ${N(cx)} ${N(yy + 18)} ${N(cx + ww)} ${N(yy)}`)
    })
    .join('')
  return body + finL + finR + arcs
}

function dolphin(cx, cy, scale = 1, flip = false) {
  const dir = flip ? -1 : 1
  const body = pathTag(
    `M ${N(cx - 70 * scale * dir)} ${N(cy)} Q ${N(cx - 30 * scale * dir)} ${N(cy - 50 * scale)} ${N(cx + 40 * scale * dir)} ${N(cy - 20 * scale)} Q ${N(cx + 80 * scale * dir)} ${N(cy)} ${N(cx + 40 * scale * dir)} ${N(cy + 20 * scale)} Q ${N(cx - 30 * scale * dir)} ${N(cy + 40 * scale)} ${N(cx - 70 * scale * dir)} ${N(cy)} Z`
  )
  const finTop = poly(`${N(cx - 10 * scale * dir)},${N(cy - 18 * scale)} ${N(cx + 10 * scale * dir)},${N(cy - 55 * scale)} ${N(cx + 25 * scale * dir)},${N(cy - 15 * scale)}`)
  const tailFin = poly(`${N(cx - 70 * scale * dir)},${N(cy)} ${N(cx - 95 * scale * dir)},${N(cy - 18 * scale)} ${N(cx - 95 * scale * dir)},${N(cy + 18 * scale)}`)
  return body + finTop + tailFin
}

function img001() {
  const rock = poly('180,700 150,540 300,460 470,480 560,600 520,700')
  const head = mermaidHead(430, 260, 'long')
  const torso = mermaidTorso(430, 260, 380)
  const tail = mermaidTail(430, 380, { length: 230, width: 60 })
  const shell = shellFan(300, 640, 30)
  const bub = bubblesAt([
    [600, 300, 14],
    [640, 360, 10],
    [580, 230, 8],
  ])
  const algae = seaweed(680, 720, 140) + seaweed(120, 720, 100, -18)
  return svgWrap(rock + algae + tail + torso + head + shell + bub)
}

function img002() {
  const head = mermaidHead(400, 220, 'wavy')
  const torso = mermaidTorso(400, 220, 330)
  const tail = mermaidTail(400, 330, { length: 280, width: 75, finWidth: 200 })
  const rays = [300, 400, 500].map((x) => lineTag(x, 40, x - 40, 300)).join('')
  const bub = bubblesAt([
    [550, 200, 10],
    [580, 260, 14],
    [520, 150, 8],
    [600, 320, 10],
  ])
  const fish = [
    [180, 500],
    [220, 560],
  ]
    .map(([x, y]) => circle(x, y, 18) + poly(`${x - 18},${y} ${x - 32},${y - 10} ${x - 32},${y + 10}`))
    .join('')
  return svgWrap(rays + tail + torso + head + bub + fish)
}

function img003() {
  const head = mermaidHead(320, 300, 'long')
  const torso = mermaidTorso(320, 300, 410)
  const tail = mermaidTail(320, 410, { length: 220, width: 60 })
  const dol = dolphin(560, 340, 1.3, true)
  const corals = [
    [150, 650, 'a'],
    [650, 680, 'b'],
    [400, 700, 'a'],
  ]
    .map(([x, y, t]) =>
      t === 'a'
        ? poly(`${x},${y} ${x - 20},${y - 50} ${x - 5},${y - 60} ${x + 10},${y - 30} ${x + 20},${y - 55} ${x + 35},${y - 20} ${x + 15},${y}`)
        : circle(x, y - 20, 25)
    )
    .join('')
  const bub = bubblesAt([
    [500, 200, 10],
    [470, 150, 7],
    [540, 250, 12],
  ])
  const pearls = bubblesAt([
    [250, 550, 9],
    [280, 600, 7],
    [220, 600, 7],
  ])
  return svgWrap(corals + tail + torso + head + dol + bub + pearls)
}

function img004() {
  const throneL = poly('260,700 240,420 300,380 320,700')
  const throneR = poly('540,700 560,420 500,380 480,700')
  const seat = rectTag(300, 600, 200, 60, 10)
  const head = mermaidHead(400, 260, 'long')
  const crownEl = crownShape(400, 190, 90, 55)
  const torso = mermaidTorso(400, 260, 390)
  const tail = mermaidTail(400, 390, { length: 200, width: 70 })
  const jewels = bubblesAt([
    [280, 500, 10],
    [520, 500, 10],
    [240, 600, 8],
    [560, 600, 8],
  ])
  const guard1 = dolphin(150, 450, 0.8, false)
  const guard2 = dolphin(650, 450, 0.8, true)
  return svgWrap(throneL + throneR + seat + tail + torso + head + crownEl + jewels + guard1 + guard2)
}

function img005() {
  const head = mermaidHead(400, 260, 'short')
  const tiaraEl = tiara(400, 214)
  const torso = mermaidTorso(400, 260, 380)
  const tail = mermaidTail(400, 380, { length: 230, width: 55, finWidth: 150 })
  const bub = bubblesAt([
    [550, 300, 10],
    [580, 360, 8],
    [520, 240, 7],
  ])
  const plant1 = seaweed(160, 720, 120, 15)
  const plant2 = seaweed(650, 720, 90, -15)
  return svgWrap(plant1 + plant2 + tail + torso + tiaraEl + head + bub)
}

// ---------- Princesas ----------

function girlHead(cx, cy, hair = 'updo') {
  let out = circle(cx, cy, 42)
  if (hair === 'updo') {
    out += circle(cx, cy - 46, 26)
    out += pathTag(`M ${N(cx - 40)} ${N(cy - 6)} Q ${N(cx - 55)} ${N(cy + 30)} ${N(cx - 35)} ${N(cy + 55)}`)
    out += pathTag(`M ${N(cx + 40)} ${N(cy - 6)} Q ${N(cx + 55)} ${N(cy + 30)} ${N(cx + 35)} ${N(cy + 55)}`)
  } else if (hair === 'long') {
    out += pathTag(`M ${N(cx - 40)} ${N(cy - 10)} Q ${N(cx - 65)} ${N(cy + 70)} ${N(cx - 35)} ${N(cy + 160)}`)
    out += pathTag(`M ${N(cx + 40)} ${N(cy - 10)} Q ${N(cx + 65)} ${N(cy + 70)} ${N(cx + 35)} ${N(cy + 160)}`)
  } else if (hair === 'flow') {
    out += pathTag(`M ${N(cx - 40)} ${N(cy - 8)} Q ${N(cx - 90)} ${N(cy + 20)} ${N(cx - 70)} ${N(cy + 90)}`)
    out += pathTag(`M ${N(cx + 40)} ${N(cy - 8)} Q ${N(cx + 90)} ${N(cy + 20)} ${N(cx + 70)} ${N(cy + 90)}`)
  }
  out += dot(cx - 14, cy - 2, 4) + dot(cx + 14, cy - 2, 4)
  return out
}

function bodice(cx, headCy, waistY) {
  const shoulderY = headCy + 48
  return pathTag(`M ${N(cx - 36)} ${N(shoulderY)} L ${N(cx - 30)} ${N(waistY)} L ${N(cx + 30)} ${N(waistY)} L ${N(cx + 36)} ${N(shoulderY)} Z`)
}

function dress(cx, waistY, { width = 180, length = 280, poofy = false } = {}) {
  const bottomY = waistY + length
  const bottomW = poofy ? width * 1.6 : width * 1.2
  return pathTag(
    `M ${N(cx - width * 0.35)} ${N(waistY)} Q ${N(cx - bottomW / 2)} ${N(waistY + length * 0.5)} ${N(cx - bottomW / 2)} ${N(bottomY)} L ${N(cx + bottomW / 2)} ${N(bottomY)} Q ${N(cx + bottomW / 2)} ${N(waistY + length * 0.5)} ${N(cx + width * 0.35)} ${N(waistY)} Z`
  )
}

function princeFigure(cx, headCy) {
  const head = circle(cx, headCy, 40) + dot(cx - 12, headCy - 2, 4) + dot(cx + 12, headCy - 2, 4)
  const hair = pathTag(`M ${N(cx - 38)} ${N(headCy - 14)} Q ${N(cx)} ${N(headCy - 50)} ${N(cx + 38)} ${N(headCy - 14)}`)
  const shoulderY = headCy + 46
  const waistY = shoulderY + 140
  const coat = pathTag(`M ${N(cx - 42)} ${N(shoulderY)} L ${N(cx - 50)} ${N(waistY)} L ${N(cx + 50)} ${N(waistY)} L ${N(cx + 42)} ${N(shoulderY)} Z`)
  const buttons = [0.3, 0.55, 0.8].map((f) => dot(cx, shoulderY + (waistY - shoulderY) * f, 4)).join('')
  const legs = lineTag(cx - 20, waistY, cx - 25, waistY + 150) + lineTag(cx + 20, waistY, cx + 25, waistY + 150)
  return head + hair + coat + buttons + legs
}

function img006() {
  const head = girlHead(400, 220, 'updo')
  const crownEl = crownShape(400, 150, 70, 40)
  const bodiceEl = bodice(400, 220, 330)
  const dressEl = dress(400, 330, { width: 170, length: 320, poofy: true })
  const foldLines = [0.3, 0.5, 0.7]
    .map((f) => {
      const y = 330 + 320 * f
      const w = 170 * (1 + f * 0.9)
      return pathTag(`M ${N(400 - w * 0.45)} ${N(y)} Q 400 ${N(y + 18)} ${N(400 + w * 0.45)} ${N(y)}`)
    })
    .join('')
  const shoe = poly('380,650 380,665 420,665 420,650')
  const flowers = [
    [140, 700],
    [660, 700],
    [200, 760],
    [600, 760],
  ]
    .map(([x, y]) => flower(x, y, 5, 6, 26, 20, 8))
    .join('')
  return svgWrap(flowers + dressEl + foldLines + bodiceEl + head + crownEl + shoe)
}

function img007() {
  const archTop = pathTag('M 220 300 Q 400 120 580 300')
  const archSides = lineTag(220, 300, 220, 680) + lineTag(580, 300, 580, 680)
  const sill = lineTag(220, 680, 580, 680)
  const head = girlHead(400, 380, 'long')
  const bodiceEl = bodice(400, 380, 470)
  const dressEl = dress(400, 470, { width: 140, length: 190 })
  const candles = [280, 520].map((x) => rectTag(x - 6, 560, 12, 60) + circle(x, 555, 10)).join('')
  const stars = [
    [260, 200],
    [540, 180],
    [300, 150],
    [500, 230],
  ]
    .map(([x, y]) => star(x, y, 5, 10, 4))
    .join('')
  const vines = seaweed(230, 680, 140, 20) + seaweed(570, 680, 140, -20)
  return svgWrap(archTop + archSides + sill + stars + vines + dressEl + bodiceEl + head + candles)
}

function img008() {
  const head = girlHead(400, 240, 'updo')
  const crownEl = crownShape(400, 172, 90, 50)
  const bodiceEl = bodice(400, 240, 350)
  const dressEl = dress(400, 350, { width: 160, length: 300 })
  const cetroX = 560
  const cetro = lineTag(cetroX, 300, cetroX, 600) + star(cetroX, 270, 5, 26, 11)
  const mantle = pathTag(`M ${N(340)} ${N(288)} Q ${N(250)} ${N(400)} ${N(280)} ${N(650)} L ${N(320)} ${N(650)} Q ${N(300)} ${N(420)} ${N(370)} ${N(300)} Z`)
  const jewels = bubblesAt([
    [400, 300, 8],
    [370, 650, 7],
    [430, 650, 7],
  ])
  return svgWrap(mantle + dressEl + bodiceEl + cetro + head + crownEl + jewels)
}

function img009() {
  const head = girlHead(400, 220, 'flow')
  const tiaraEl = tiara(400, 178, 55)
  const bodiceEl = bodice(400, 220, 330)
  const dressEl = pathTag('M 365 330 Q 260 420 220 520 Q 300 480 365 460 L 400 500 L 435 460 Q 500 480 580 520 Q 540 420 435 330 Z')
  const notes = [
    [180, 300],
    [620, 280],
    [650, 400],
    [150, 420],
  ]
    .map(([x, y]) => circle(x, y, 10) + lineTag(x + 9, y, x + 9, y - 40))
    .join('')
  const legL = lineTag(385, 500, 360, 620)
  const legR = lineTag(415, 500, 440, 620)
  return svgWrap(notes + dressEl + bodiceEl + legL + legR + head + tiaraEl)
}

function img010() {
  const castleBg = poly('250,320 250,200 300,200 300,150 340,150 340,200 460,200 460,150 500,150 500,200 550,200 550,320')
  const princessHead = girlHead(500, 380, 'long')
  const princessBody = bodice(500, 380, 480)
  const princessDress = dress(500, 480, { width: 120, length: 170 })
  const prince = princeFigure(300, 380)
  const heartEl = heartPath(400, 320, 22)
  const stars = [
    [150, 200],
    [650, 220],
    [200, 150],
  ]
    .map(([x, y]) => star(x, y, 4, 9, 4))
    .join('')
  return svgWrap(castleBg + stars + prince + princessDress + princessBody + princessHead + heartEl)
}

// ---------- Animais ----------

function img011() {
  const mane = (() => {
    let out = ''
    for (let i = 0; i < 16; i++) {
      const ang = (360 / 16) * i
      const [x1, y1] = polar(400, 380, 90, ang)
      const [x2, y2] = polar(400, 380, 190, ang)
      out += lineTag(x1, y1, x2, y2)
    }
    return out
  })()
  const face = circle(400, 380, 95)
  const ears = circle(320, 300, 30) + circle(480, 300, 30)
  const eyes = circle(370, 370, 12) + circle(430, 370, 12) + dot(370, 370, 4) + dot(430, 370, 4)
  const nose = poly('385,410 415,410 400,430')
  const mouth = pathTag('M 400 430 Q 380 450 360 440 M 400 430 Q 420 450 440 440')
  const whiskersL = [0, 1, 2].map((i) => lineTag(340, 400 + i * 15, 260, 390 + i * 20)).join('')
  const whiskersR = [0, 1, 2].map((i) => lineTag(460, 400 + i * 15, 540, 390 + i * 20)).join('')
  const body = pathTag('M 320 460 Q 300 600 340 700 L 460 700 Q 500 600 480 460 Z')
  const grass = [150, 650].map((x) => pathTag(`M ${x} 750 Q ${x + 20} 700 ${x + 10} 650`)).join('')
  return svgWrap(mane + body + grass + face + ears + eyes + nose + mouth + whiskersL + whiskersR)
}

function img012() {
  const head = circle(400, 320, 90)
  const earL = poly('330,260 310,180 380,240')
  const earR = poly('470,260 490,180 420,240')
  const eyes = circle(370, 315, 10) + circle(430, 315, 10) + dot(370, 315, 4) + dot(430, 315, 4)
  const nose = poly('390,345 410,345 400,360')
  const mouth = pathTag('M 400 360 Q 385 375 370 365 M 400 360 Q 415 375 430 365')
  const whiskers = [
    [340, 340, 260, 330],
    [340, 350, 255, 355],
    [340, 360, 260, 380],
    [460, 340, 540, 330],
    [460, 350, 545, 355],
    [460, 360, 540, 380],
  ]
    .map(([x1, y1, x2, y2]) => lineTag(x1, y1, x2, y2))
    .join('')
  const body = pathTag('M 330 400 Q 300 520 340 600 Q 400 630 460 600 Q 500 520 470 400 Z')
  const tail = pathTag('M 470 560 Q 560 580 560 500 Q 560 460 520 470')
  const ball = circle(280, 620, 45) + pathTag('M 250 600 Q 280 640 310 600 M 240 620 Q 280 660 320 620')
  const legs = lineTag(360, 600, 355, 650) + lineTag(440, 600, 445, 650)
  return svgWrap(ball + tail + body + legs + head + earL + earR + eyes + nose + mouth + whiskers)
}

function img013() {
  const branch = lineTag(120, 600, 680, 560)
  const leaves = [
    [200, 560],
    [600, 530],
  ]
    .map(([x, y]) => petal(x, y, -60, 0, 70, 20))
    .join('')
  const body = pathTag('M 350 350 Q 300 420 330 520 Q 360 580 420 580 Q 470 560 460 480 Q 500 450 480 400 Q 460 350 400 340 Z')
  const wing = pathTag('M 380 420 Q 320 440 300 500 Q 350 520 400 480 Z')
  const tailFeathers = [0, 1, 2].map((i) => pathTag(`M ${420 + i * 10} 560 Q ${480 + i * 30} 620 ${520 + i * 40} 700`)).join('')
  const head = circle(390, 340, 55)
  const beak = poly('345,340 300,355 345,365')
  const eye = dot(400, 325, 5)
  const crest = pathTag('M 380 290 Q 370 260 350 250 M 400 285 Q 400 250 400 230 M 420 290 Q 435 260 455 252')
  return svgWrap(branch + leaves + tailFeathers + body + wing + head + beak + eye + crest)
}

function elephant(cx, cy, scale = 1, { trunkCurl = true } = {}) {
  const ear = circle(cx - 40 * scale, cy - 10 * scale, 55 * scale)
  const head = circle(cx + 10 * scale, cy, 60 * scale)
  const trunk = pathTag(
    `M ${N(cx - 15 * scale)} ${N(cy + 50 * scale)} Q ${N(cx - 40 * scale)} ${N(cy + 120 * scale)} ${N(cx - 10 * scale)} ${N(cy + 160 * scale)} ${
      trunkCurl ? `Q ${N(cx + 10 * scale)} ${N(cy + 180 * scale)} ${N(cx + 30 * scale)} ${N(cy + 160 * scale)}` : ''
    }`
  )
  const body = pathTag(
    `M ${N(cx - 30 * scale)} ${N(cy + 40 * scale)} Q ${N(cx - 60 * scale)} ${N(cy + 140 * scale)} ${N(cx)} ${N(cy + 170 * scale)} Q ${N(cx + 90 * scale)} ${N(cy + 170 * scale)} ${N(cx + 90 * scale)} ${N(cy + 70 * scale)} Q ${N(cx + 80 * scale)} ${N(cy + 30 * scale)} ${N(cx + 50 * scale)} ${N(cy + 20 * scale)} Z`
  )
  const legs = [cx - 10 * scale, cx + 20 * scale, cx + 55 * scale, cx + 80 * scale]
    .map((x) => lineTag(x, cy + 160 * scale, x, cy + 210 * scale))
    .join('')
  const eye = dot(cx + 25 * scale, cy - 8 * scale, 4 * scale)
  const tusk = pathTag(`M ${N(cx - 5 * scale)} ${N(cy + 40 * scale)} Q ${N(cx - 25 * scale)} ${N(cy + 55 * scale)} ${N(cx - 20 * scale)} ${N(cy + 75 * scale)}`)
  return ear + body + legs + head + trunk + eye + tusk
}

function img014() {
  const mom = elephant(320, 340, 1.3)
  const baby = elephant(560, 460, 0.7, { trunkCurl: false })
  const grass = [150, 650].map((x) => pathTag(`M ${x} 750 Q ${x + 20} 700 ${x + 10} 650`)).join('')
  const sun = circle(680, 150, 50)
  return svgWrap(sun + grass + mom + baby)
}

function img015() {
  const body = lineTag(400, 220, 400, 600)
  const wingTL = petal(400, 340, -45, 20, 220, 35)
  const wingBL = petal(400, 420, -135, 20, 170, 30)
  const wingTR = petal(400, 340, 45, 20, 220, 35)
  const wingBR = petal(400, 420, 135, 20, 170, 30)
  const spotsL = bubblesAt([
    [300, 300, 14],
    [260, 380, 10],
  ])
  const spotsR = bubblesAt([
    [500, 300, 14],
    [540, 380, 10],
  ])
  const antennae = pathTag('M 400 220 Q 360 160 320 140 M 400 220 Q 440 160 480 140')
  const flower1 = flower(400, 650, 6, 10, 45, 22, 16)
  return svgWrap(flower1 + wingTL + wingBL + wingTR + wingBR + spotsL + spotsR + body + antennae)
}

// ---------- Flores ----------

function img016() {
  const petals = flower(400, 380, 20, 90, 260, 10, 90)
  const spiralDots = (() => {
    let out = ''
    for (let r = 10; r < 80; r += 14) {
      const count = Math.floor(r / 6) + 4
      for (let i = 0; i < count; i++) {
        const [x, y] = polar(400, 380, r, (360 / count) * i + r)
        out += dot(x, y, 3)
      }
    }
    return out
  })()
  const stem = lineTag(400, 640, 400, 760)
  const leaf = petal(400, 700, 180, 10, 90, 30)
  return svgWrap(petals + stem + leaf + circle(400, 380, 90) + spiralDots)
}

function img017() {
  const vase = pathTag(
    'M 320 620 L 300 750 L 500 750 L 480 620 Q 500 600 480 570 L 320 570 Q 300 600 320 620 Z'
  )
  const flowersEl = [
    [320, 420, 6, 10, 50, 20, 14],
    [420, 380, 8, 8, 55, 16, 12],
    [480, 440, 5, 10, 45, 22, 14],
    [360, 470, 7, 8, 40, 18, 10],
    [440, 500, 6, 8, 42, 20, 10],
  ]
    .map(([x, y, p, ri, ro, sp, cr]) => flower(x, y, p, ri, ro, sp, cr))
    .join('')
  const stems = [320, 420, 480, 360, 440].map((x) => lineTag(x, 530, 400, 600)).join('')
  return svgWrap(vase + stems + flowersEl)
}

function img018() {
  const leaf = pathTag('M 260 560 Q 400 500 540 560 Q 480 600 400 600 Q 320 600 260 560 Z')
  const petals = flower(400, 420, 10, 40, 160, 16, 50)
  const waterLines = [600, 640, 680].map((y) => zigzagWater(y, 10, 10)).join('')
  return svgWrap(waterLines + leaf + petals)
}

function img019() {
  const branch = pathTag('M 100 650 Q 300 600 400 500 Q 500 420 700 380')
  const twigs = [
    [250, 590, -40],
    [420, 470, 20],
    [560, 410, -30],
  ]
    .map(([x, y, dx]) => lineTag(x, y, x + dx, y - 60))
    .join('')
  const blossoms = []
  for (let i = 0; i < 10; i++) {
    const t = i / 9
    const x = 120 + t * (650 - 120)
    const y = 640 - t * (640 - 360) + (i % 2 === 0 ? -20 : 15)
    blossoms.push(flower(x, y, 5, 4, 20, 20, 6))
  }
  const petalsFalling = bubblesAt([
    [300, 700, 4],
    [500, 300, 4],
    [600, 250, 4],
  ])
  return svgWrap(branch + twigs + blossoms.join('') + petalsFalling)
}

function img020() {
  const petalsOuter = [0, 72, 144, 216, 288].map((a) => petal(400, 380, a, 20, 150, 18)).join('')
  const labelo = pathTag('M 400 420 Q 370 470 400 500 Q 430 470 400 420 Z')
  const stem = pathTag('M 400 530 Q 380 620 400 700')
  const leaves = petal(400, 700, 200, 10, 80, 25) + petal(400, 700, 160, 10, 80, 25)
  return svgWrap(stem + leaves + petalsOuter + labelo)
}

// ---------- Castelos ----------

function tower(cx, baseY, { height = 220, width = 70, roof = 'cone' } = {}) {
  const topY = baseY - height
  const body = rectTag(cx - width / 2, topY, width, height)
  let roofShape = ''
  if (roof === 'cone') {
    roofShape = poly(`${N(cx - width / 2 - 10)},${N(topY)} ${N(cx + width / 2 + 10)},${N(topY)} ${N(cx)},${N(topY - 70)}`)
  } else if (roof === 'flat') {
    roofShape = rectTag(cx - width / 2 - 8, topY - 20, width + 16, 20)
  }
  const windows = [0.3, 0.6].map((f) => rectTag(cx - 10, topY + height * f, 20, 30)).join('')
  const flag =
    roof === 'cone'
      ? lineTag(cx, topY - 70, cx, topY - 100) + poly(`${N(cx)},${N(topY - 100)} ${N(cx + 30)},${N(topY - 90)} ${N(cx)},${N(topY - 80)}`)
      : ''
  return body + roofShape + windows + flag
}

function img021() {
  const wall = rectTag(220, 480, 360, 220)
  const gate = pathTag('M 370 700 L 370 580 Q 400 550 430 580 L 430 700')
  const t1 = tower(260, 480, { height: 260, width: 70 })
  const t2 = tower(400, 480, { height: 320, width: 80 })
  const t3 = tower(540, 480, { height: 260, width: 70 })
  const mist = zigzagWater(700, 8, 14)
  const trees = [150, 650].map((x) => pineTree(x, 750, 120, 70)).join('')
  return svgWrap(mist + trees + wall + t1 + t2 + t3 + gate)
}

function img022() {
  const base = poly('250,700 250,500 400,420 550,500 550,700')
  const facets = [
    [250, 500, 400, 420],
    [400, 420, 550, 500],
    [300, 700, 400, 550],
    [500, 700, 400, 550],
  ]
    .map(([x1, y1, x2, y2]) => lineTag(x1, y1, x2, y2))
    .join('')
  const spire = poly('370,420 430,420 400,320')
  const towerL = tower(250, 500, { height: 150, width: 50, roof: 'cone' })
  const towerR = tower(550, 500, { height: 150, width: 50, roof: 'cone' })
  const stars = [
    [150, 200],
    [650, 180],
    [400, 150],
    [550, 250],
    [250, 230],
  ]
    .map(([x, y]) => star(x, y, 4, 10, 4))
    .join('')
  const cloudBase = cloud(400, 730, 1.4)
  return svgWrap(stars + cloudBase + base + facets + spire + towerL + towerR)
}

function img023() {
  const sun = circle(620, 260, 60)
  const cloudsEl = cloud(200, 220, 1) + cloud(500, 180, 0.8)
  const silhouette = poly('280,650 280,480 320,480 320,440 360,440 360,480 440,480 440,420 480,420 480,480 520,480 520,650')
  const river = zigzagWater(700, 10, 14) + zigzagWater(730, 10, 14)
  const bridge = pathTag('M 320 700 Q 400 660 480 700')
  const treesEl = [180, 620].map((x) => roundTree(x, 720, 45, 30)).join('')
  return svgWrap(sun + cloudsEl + river + bridge + silhouette + treesEl)
}

function img024() {
  const cloudBase = cloud(400, 560, 2.4)
  const wall = rectTag(310, 420, 180, 140)
  const t1 = tower(340, 420, { height: 170, width: 50 })
  const t2 = tower(460, 420, { height: 200, width: 60 })
  const chains = [
    [330, 560, 260, 680],
    [470, 560, 540, 680],
  ]
    .map(([x1, y1, x2, y2]) => pathTag(`M ${x1} ${y1} Q ${(x1 + x2) / 2} ${(y1 + y2) / 2 + 30} ${x2} ${y2}`))
    .join('')
  const birds = [
    [200, 300],
    [600, 260],
    [500, 320],
  ]
    .map(([x, y]) => pathTag(`M ${x - 15} ${y} Q ${x} ${y - 15} ${x + 15} ${y} M ${x} ${y} Q ${x + 5} ${y - 8} ${x + 20} ${y - 4}`))
    .join('')
  const sun = circle(650, 150, 45)
  return svgWrap(sun + birds + chains + wall + t1 + t2 + cloudBase)
}

function img025() {
  const wallL = poly('220,700 220,450 280,420 280,700')
  const wallR = poly('520,700 520,480 580,510 580,700')
  const brokenTop = pathTag('M 280 420 L 320 460 L 350 410 L 380 450')
  const archway = pathTag('M 350 700 L 350 550 Q 400 500 450 550 L 450 700')
  const vines = seaweed(240, 700, 220, 25) + seaweed(560, 700, 200, -25) + seaweed(400, 700, 150, 15)
  const sparkles = [
    [400, 300],
    [350, 350],
    [450, 330],
  ]
    .map(([x, y]) => star(x, y, 4, 10, 4))
    .join('')
  const birds = pathTag('M 550 250 Q 560 240 570 250 M 570 250 Q 580 240 590 250')
  return svgWrap(sparkles + wallL + wallR + brokenTop + archway + vines + birds)
}

// ---------- Dinossauros ----------

function img026() {
  const body = pathTag(
    'M 330 400 Q 300 500 340 600 Q 380 650 440 630 L 460 700 L 500 700 L 470 620 Q 520 560 500 470 Q 540 450 520 400 Q 480 340 400 340 Q 350 340 330 400 Z'
  )
  const head = pathTag('M 480 380 Q 560 370 600 420 Q 580 450 540 440 Q 550 460 530 470 L 480 440 Z')
  const teeth = [0, 1, 2, 3].map((i) => lineTag(520 + i * 16, 440, 520 + i * 16, 460)).join('')
  const eye = dot(510, 400, 5)
  const armL = lineTag(400, 420, 370, 460)
  const legs = lineTag(360, 600, 350, 680) + lineTag(430, 610, 440, 690)
  const tail = pathTag('M 330 430 Q 220 440 160 480')
  const ground = lineTag(100, 700, 700, 700)
  const volcano = poly('600,700 650,550 700,700') + pathTag('M 650 550 Q 660 520 680 520')
  return svgWrap(volcano + ground + tail + body + legs + armL + head + teeth + eye)
}

function img027() {
  const body = pathTag(
    'M 280 480 Q 260 560 300 620 L 560 620 Q 600 560 580 480 Q 560 420 460 410 L 340 410 Q 300 420 280 480 Z'
  )
  const frill = pathTag('M 300 420 Q 260 360 300 300 Q 340 340 340 410 M 460 410 Q 470 340 520 300 Q 550 350 500 420')
  const hornNose = poly('380,410 400,360 420,410')
  const hornL = poly('320,400 300,320 350,395')
  const hornR = poly('480,400 500,320 450,395')
  const eye = dot(370, 400, 5)
  const legs = [330, 420, 500, 560].map((x) => lineTag(x, 610, x - 5, 680)).join('')
  const plants = petal(650, 650, 180, 10, 60, 25)
  return svgWrap(plants + frill + body + hornNose + hornL + hornR + eye + legs)
}

function img028() {
  const body = pathTag(
    'M 220 500 Q 220 560 260 590 L 560 590 Q 600 560 580 500 Q 560 460 500 460 L 300 460 Q 240 460 220 500 Z'
  )
  const plates = [260, 330, 400, 470, 540]
    .map((x, i) => poly(`${x - 25},460 ${x},${380 - (i % 2) * 20} ${x + 25},460`))
    .join('')
  const head = pathTag('M 220 500 Q 160 510 140 540 Q 170 560 220 550 Z')
  const eye = dot(175, 530, 4)
  const tailSpikes = [
    [590, 500, 630, 470],
    [610, 530, 660, 510],
  ]
    .map(([x1, y1, x2, y2]) => lineTag(x1, y1, x2, y2))
    .join('')
  const legs = [270, 340, 470, 540].map((x) => lineTag(x, 590, x, 650)).join('')
  return svgWrap(plates + body + head + eye + tailSpikes + legs)
}

function img029() {
  const body = pathTag('M 380 380 Q 360 420 380 450 Q 400 470 420 450 Q 440 420 420 380 Z')
  const head = pathTag('M 380 380 Q 340 350 300 360 Q 330 380 350 400 Z')
  const crest = pathTag('M 340 350 Q 320 320 290 310')
  const wingL = pathTag('M 380 400 Q 250 380 150 420 Q 250 440 380 430 Z')
  const wingR = pathTag('M 420 400 Q 550 380 650 420 Q 550 440 420 430 Z')
  const wingFingersL = [0.3, 0.6]
    .map((f) => lineTag(380 - 230 * f, 400 - 20 * f, 380 - 230 * f, 400 - 20 * f - 20))
    .join('')
  const tail = pathTag('M 420 450 Q 460 480 450 520')
  const cloudsEl = cloud(600, 250, 0.8) + cloud(200, 220, 0.7)
  return svgWrap(cloudsEl + wingL + wingR + tail + body + head + crest + wingFingersL)
}

function img030() {
  const bigDino = (cx) =>
    pathTag(
      `M ${cx - 60} 450 Q ${cx - 70} 550 ${cx - 20} 590 L ${cx + 60} 590 Q ${cx + 90} 540 ${cx + 70} 460 Q ${cx + 40} 410 ${cx} 410 Q ${cx - 40} 410 ${cx - 60} 450 Z`
    ) +
    circle(cx - 50, 420, 30) +
    dot(cx - 58, 412, 4) +
    lineTag(cx - 30, 590, cx - 35, 650) +
    lineTag(cx + 30, 590, cx + 35, 650)
  const dino1 = bigDino(280)
  const dino2 = bigDino(520)
  const baby =
    pathTag('M 380 550 Q 375 590 400 610 L 440 610 Q 460 590 450 555 Q 430 530 400 535 Z') +
    circle(390, 535, 18) +
    dot(384, 530, 3) +
    lineTag(400, 610, 398, 640) +
    lineTag(430, 610, 432, 640)
  const ferns = [150, 650].map((x) => petal(x, 700, 180, 10, 70, 25)).join('')
  const sun = circle(400, 150, 45)
  return svgWrap(sun + ferns + dino1 + dino2 + baby)
}

// ---------- Galaxia e Espaco ----------

function img031() {
  const helmet = circle(400, 300, 80)
  const visor = pathTag('M 350 280 Q 400 250 450 280 Q 450 320 400 330 Q 350 320 350 280 Z')
  const body = pathTag('M 330 370 Q 300 480 330 580 L 470 580 Q 500 480 470 370 Z')
  const armL = pathTag('M 330 400 Q 270 430 260 490')
  const armR = pathTag('M 470 400 Q 530 430 540 490')
  const legs = lineTag(370, 580, 360, 680) + lineTag(430, 580, 440, 680)
  const backpack = rectTag(370, 380, 60, 100, 10)
  const flagPole = lineTag(600, 700, 600, 500)
  const flag = poly('600,500 660,520 600,540')
  const craters = [
    [200, 700, 30],
    [600, 650, 25],
    [300, 730, 20],
  ]
    .map(([x, y, r]) => circle(x, y, r))
    .join('')
  const earth = circle(650, 180, 55)
  const groundLine = lineTag(80, 700, 720, 700)
  return svgWrap(earth + groundLine + craters + flagPole + flag + armL + armR + body + backpack + legs + helmet + visor)
}

function img032() {
  const sun = circle(400, 400, 55)
  const orbits = [110, 170, 230, 290, 350].map((r) => circle(400, 400, r)).join('')
  const planets = [
    [110, -30, 14],
    [170, 60, 18],
    [230, 150, 16],
    [290, -100, 22],
    [350, 200, 26],
  ]
    .map(([r, ang, pr]) => {
      const [x, y] = polar(400, 400, r, ang)
      return circle(x, y, pr)
    })
    .join('')
  const saturnRing = (() => {
    const [x, y] = polar(400, 400, 350, 200)
    return `<ellipse cx="${N(x)}" cy="${N(y)}" rx="42" ry="14" fill="none" stroke="${STROKE}" stroke-width="${SW}" />`
  })()
  const asteroids = bubblesAt([
    [150, 150, 6],
    [650, 200, 5],
    [600, 600, 7],
    [180, 600, 5],
  ])
  const stars = [
    [80, 80],
    [720, 100],
    [700, 700],
    [60, 650],
  ]
    .map(([x, y]) => star(x, y, 4, 8, 3))
    .join('')
  return svgWrap(stars + orbits + asteroids + saturnRing + planets + sun)
}

function img033() {
  const body = pathTag('M 250 400 L 450 370 Q 560 390 560 420 Q 560 450 450 460 L 250 440 Q 220 420 250 400 Z')
  const cockpit = circle(340, 410, 30)
  const finTop = poly('420,370 440,320 470,375')
  const finBottom = poly('420,460 440,510 470,455')
  const thruster = pathTag('M 250 400 Q 180 410 140 420 Q 180 430 250 440')
  const flame = poly('140,420 100,410 100,430')
  const planet = circle(620, 600, 70)
  const stars = [
    [150, 150],
    [650, 150],
    [700, 350],
    [100, 300],
  ]
    .map(([x, y]) => star(x, y, 4, 8, 3))
    .join('')
  const windows = bubblesAt([
    [380, 410, 10],
    [280, 415, 8],
  ])
  return svgWrap(stars + planet + thruster + flame + body + finTop + finBottom + cockpit + windows)
}

function img034() {
  const head = pathTag('M 320 300 Q 320 220 400 210 Q 480 220 480 300 Q 480 360 400 380 Q 320 360 320 300 Z')
  const eyeL = circle(365, 290, 28)
  const eyeR = circle(435, 290, 28)
  const pupilL = dot(365, 290, 8)
  const pupilR = dot(435, 290, 8)
  const antennaL = lineTag(360, 215, 340, 160) + circle(340, 155, 10)
  const antennaR = lineTag(440, 215, 460, 160) + circle(460, 155, 10)
  const body = pathTag('M 350 380 Q 330 460 350 540 L 450 540 Q 470 460 450 380 Z')
  const armL = pathTag('M 350 420 Q 290 440 270 500')
  const armR = pathTag('M 450 420 Q 510 440 530 500')
  const legs = lineTag(380, 540, 375, 620) + lineTag(420, 540, 425, 620)
  const suitLines = lineTag(360, 450, 440, 450) + lineTag(360, 490, 440, 490)
  const lights = [
    [150, 300],
    [650, 250],
    [600, 500],
    [180, 550],
  ]
    .map(([x, y]) => circle(x, y, 8))
    .join('')
  return svgWrap(lights + armL + armR + body + suitLines + legs + head + eyeL + eyeR + pupilL + pupilR + antennaL + antennaR)
}

function img035() {
  const center = circle(400, 400, 50)
  const spiral = (() => {
    let d = `M 400 400 `
    let r = 60
    let ang = 0
    for (let i = 0; i < 60; i++) {
      r += 5
      ang += 18
      const [x, y] = polar(400, 400, r, ang)
      d += `L ${N(x)} ${N(y)} `
    }
    return pathTag(d)
  })()
  const rings = [90, 140, 190].map((r) => circle(400, 400, r)).join('')
  const rays = Array.from({ length: 12 })
    .map((_, i) => {
      const ang = (360 / 12) * i
      const [x1, y1] = polar(400, 400, 200, ang)
      const [x2, y2] = polar(400, 400, 260, ang)
      return lineTag(x1, y1, x2, y2)
    })
    .join('')
  const stars = [
    [100, 100],
    [700, 120],
    [650, 650],
    [120, 680],
    [400, 700],
  ]
    .map(([x, y]) => star(x, y, 4, 8, 3))
    .join('')
  return svgWrap(stars + rays + rings + spiral + center)
}

// ---------- Fadas e Criaturas Magicas ----------

function fairyWings(cx, cy, scale = 1) {
  return (
    petal(cx, cy - 20 * scale, -60, 10, 140 * scale, 30) +
    petal(cx, cy + 30 * scale, -120, 10, 110 * scale, 26) +
    petal(cx, cy - 20 * scale, 60, 10, 140 * scale, 30) +
    petal(cx, cy + 30 * scale, 120, 10, 110 * scale, 26)
  )
}

function img036() {
  const wings = fairyWings(400, 420, 1)
  const head = girlHead(400, 300, 'flow')
  const bodiceEl = bodice(400, 300, 390)
  const skirt = petal(400, 390, 90, 0, 90, 50)
  const wand = lineTag(480, 340, 560, 260) + star(566, 252, 5, 20, 8)
  const legs = lineTag(385, 440, 375, 520) + lineTag(415, 440, 425, 520)
  const sparkle = [
    [500, 200],
    [300, 180],
    [560, 350],
  ]
    .map(([x, y]) => star(x, y, 4, 8, 3))
    .join('')
  return svgWrap(wings + sparkle + skirt + bodiceEl + wand + head + legs)
}

function img037() {
  const body = pathTag(
    'M 300 460 Q 280 540 320 580 L 520 580 Q 560 540 540 460 Q 520 400 420 400 Q 340 400 300 460 Z'
  )
  const neckHead = pathTag('M 420 400 Q 460 340 520 320 Q 560 310 590 330 Q 570 350 540 350 Q 500 360 480 400 Z')
  const horn = poly('540,330 550,260 565,332')
  const mane = pathTag('M 480 330 Q 440 300 420 340 M 500 340 Q 470 310 450 350 M 460 355 Q 430 335 415 370')
  const legs = [340, 400, 460, 500].map((x) => lineTag(x, 580, x - 5, 680)).join('')
  const tail = pathTag('M 300 480 Q 240 500 230 560 Q 260 540 280 570 Q 250 580 260 610')
  const eye = dot(560, 335, 4)
  const flowers = [
    [200, 650],
    [600, 650],
  ]
    .map(([x, y]) => flower(x, y, 5, 4, 20, 20, 6))
    .join('')
  const aura = circle(400, 470, 180)
  return svgWrap(flowers + aura + tail + body + legs + neckHead + mane + horn + eye)
}

function img038() {
  const body = pathTag(
    'M 320 450 Q 300 560 350 620 L 480 620 Q 530 560 500 450 Q 480 400 400 400 Q 340 400 320 450 Z'
  )
  const head = pathTag('M 340 400 Q 300 360 260 370 Q 250 400 280 420 Q 300 410 340 420 Z')
  const hornsEl = poly('300,370 290,330 320,368') + poly('330,365 330,325 350,368')
  const eye = dot(290, 395, 4)
  const wingL = petal(360, 420, -100, 10, 190, 35)
  const wingR = petal(440, 420, -80, 10, 190, 35)
  const tail = pathTag('M 500 480 Q 600 470 640 430')
  const spikesTail = [0, 1, 2]
    .map((i) => poly(`${560 + i * 30},${450 - i * 10} ${560 + i * 30},${420 - i * 10} ${580 + i * 30},${445 - i * 10}`))
    .join('')
  const legs = [360, 420, 460].map((x) => lineTag(x, 620, x, 670)).join('')
  const flame = petal(240, 410, 180, 0, 40, 20)
  return svgWrap(wingL + wingR + tail + spikesTail + body + legs + head + hornsEl + eye + flame)
}

function img039() {
  const wings = fairyWings(400, 400, 0.85)
  const head = girlHead(400, 300, 'flow')
  const bodiceEl = bodice(400, 300, 380)
  const skirt = petal(400, 380, 90, 0, 80, 45)
  const legs = lineTag(385, 420, 378, 500) + lineTag(415, 420, 422, 500)
  const treeL = roundTree(180, 720, 70, 50)
  const treeR = roundTree(640, 720, 80, 55)
  const flowersEl = [
    [300, 650],
    [500, 650],
    [250, 700],
    [560, 700],
  ]
    .map(([x, y]) => flower(x, y, 5, 4, 18, 20, 6))
    .join('')
  const sunRays = Array.from({ length: 8 })
    .map((_, i) => {
      const ang = (360 / 8) * i
      const [x1, y1] = polar(650, 150, 60, ang)
      const [x2, y2] = polar(650, 150, 90, ang)
      return lineTag(x1, y1, x2, y2)
    })
    .join('')
  const sun = circle(650, 150, 50)
  const butterfly = petal(220, 300, -45, 5, 35, 20) + petal(220, 300, 45, 5, 35, 20)
  return svgWrap(sun + sunRays + treeL + treeR + flowersEl + butterfly + wings + skirt + bodiceEl + head + legs)
}

function img040() {
  const moon = circle(600, 180, 70)
  const moonShadow = circle(630, 160, 65)
  const stars = [
    [150, 150],
    [300, 100],
    [500, 120],
    [700, 300],
    [150, 350],
  ]
    .map(([x, y]) => star(x, y, 4, 9, 4))
    .join('')
  const wings = fairyWings(400, 420, 1.1)
  const head = girlHead(400, 300, 'updo')
  const crownEl = crownShape(400, 244, 60, 34)
  const bodiceEl = bodice(400, 300, 400)
  const gown = dress(400, 400, { width: 150, length: 260 })
  return svgWrap(moon + moonShadow + stars + wings + gown + bodiceEl + head + crownEl)
}

// ---------- Mandalas e Padroes ----------

function img041() {
  const rings = [120, 220, 320].map((r) => circle(400, 400, r)).join('')
  const petalsOuter = flower(400, 400, 12, 150, 300, 12, 0)
  const petalsInner = flower(400, 400, 8, 60, 140, 16, 50)
  return svgWrap(rings + petalsOuter + petalsInner)
}

function img042() {
  const cells = []
  const size = 80
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {
      const x = col * size
      const y = row * size
      if ((row + col) % 3 === 0) cells.push(poly(`${x + size / 2},${y} ${x + size},${y + size / 2} ${x + size / 2},${y + size} ${x},${y + size / 2}`))
      else if ((row + col) % 3 === 1) cells.push(circle(x + size / 2, y + size / 2, size / 2.6))
      else cells.push(rectTag(x + 10, y + 10, size - 20, size - 20))
    }
  }
  return svgWrap(cells.join(''))
}

function img043() {
  const spiral = (() => {
    let d = `M 400 400 `
    let r = 20
    let ang = 0
    for (let i = 0; i < 80; i++) {
      r += 4.5
      ang += 15
      const [x, y] = polar(400, 400, r, ang)
      d += `L ${N(x)} ${N(y)} `
    }
    return pathTag(d)
  })()
  const decor = Array.from({ length: 10 })
    .map((_, i) => {
      const r = 60 + i * 30
      const ang = i * 40
      const [x, y] = polar(400, 400, r, ang)
      return circle(x, y, 14)
    })
    .join('')
  return svgWrap(spiral + decor)
}

function img044() {
  const starsBig = [
    [400, 400],
    [200, 200],
    [600, 200],
    [200, 600],
    [600, 600],
  ]
    .map(([x, y]) => star(x, y, 8, 80, 40))
    .join('')
  const linesEl = Array.from({ length: 8 })
    .map((_, i) => {
      const ang = (360 / 8) * i
      const [x1, y1] = polar(400, 400, 40, ang)
      const [x2, y2] = polar(400, 400, 380, ang)
      return lineTag(x1, y1, x2, y2)
    })
    .join('')
  const outerRing = circle(400, 400, 380)
  return svgWrap(outerRing + linesEl + starsBig)
}

function img045() {
  const rings = [100, 200, 300].map((r) => circle(400, 400, r)).join('')
  const flowersRing = Array.from({ length: 8 })
    .map((_, i) => {
      const ang = (360 / 8) * i
      const [x, y] = polar(400, 400, 250, ang)
      return flower(x, y, 5, 4, 26, 20, 10)
    })
    .join('')
  const leavesRing = Array.from({ length: 8 })
    .map((_, i) => {
      const ang = (360 / 8) * i + 22.5
      const [x, y] = polar(400, 400, 150, ang)
      return petal(x, y, ang, 4, 30, 16)
    })
    .join('')
  return svgWrap(rings + flowersRing + leavesRing + circle(400, 400, 50))
}

// ---------- Cidades e Cenarios ----------

function building(cx, baseY, { width = 100, height = 220, roofStyle = 'pitched' } = {}) {
  const topY = baseY - height
  const body = rectTag(cx - width / 2, topY, width, height)
  const roofEl =
    roofStyle === 'pitched'
      ? poly(`${N(cx - width / 2 - 8)},${N(topY)} ${N(cx + width / 2 + 8)},${N(topY)} ${N(cx)},${N(topY - 50)}`)
      : rectTag(cx - width / 2 - 6, topY - 14, width + 12, 14)
  const windows = []
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 2; c++) {
      windows.push(rectTag(cx - width / 2 + 16 + c * (width - 64), topY + 30 + r * 60, 28, 36))
    }
  }
  const door = rectTag(cx - 18, baseY - 50, 36, 50)
  return body + roofEl + windows.join('') + door
}

function img046() {
  const b1 = building(180, 650, { width: 140, height: 260 })
  const b2 = building(340, 650, { width: 120, height: 200, roofStyle: 'flat' })
  const b3 = building(480, 650, { width: 130, height: 240 })
  const b4 = building(630, 650, { width: 120, height: 190, roofStyle: 'flat' })
  const ground = lineTag(60, 650, 740, 650)
  const cloudsEl = cloud(150, 120, 0.8) + cloud(600, 100, 0.9)
  const treeEl = roundTree(400, 650, 35, 30)
  return svgWrap(cloudsEl + ground + b1 + b2 + b3 + treeEl + b4)
}

function img047() {
  const sea = zigzagWater(400, 14, 12) + zigzagWater(440, 10, 12)
  const shoreLine = pathTag('M 60 500 Q 400 460 740 500')
  const sun = circle(650, 150, 55)
  const palm = (cx) => {
    const trunk = pathTag(`M ${cx} 650 Q ${cx - 20} 560 ${cx} 500`)
    const leaves = [0, 72, 144, 216, 288].map((a) => petal(cx, 500, a, 0, 80, 25)).join('')
    return trunk + leaves
  }
  const umbrella = poly('300,560 380,560 340,500') + lineTag(340, 560, 340, 650)
  const wave2 = zigzagWater(520, 8, 16)
  return svgWrap(sun + sea + shoreLine + palm(150) + palm(620) + umbrella + wave2)
}

function img048() {
  const mountains = poly('60,500 200,320 320,480 420,300 560,480 740,380 740,500')
  const barn = rectTag(250, 500, 160, 140) + poly('230,500 420,500 325,420')
  const barnDoor = poly('305,640 305,560 345,560 345,640')
  const fence =
    Array.from({ length: 8 })
      .map((_, i) => lineTag(80 + i * 40, 650, 80 + i * 40, 600))
      .join('') + lineTag(80, 620, 400, 620)
  const cow = circle(600, 600, 40) + circle(650, 600, 30) + lineTag(590, 635, 585, 670) + lineTag(620, 635, 618, 670)
  const cloudsEl = cloud(200, 150, 0.9) + cloud(550, 120, 0.7)
  return svgWrap(mountains + cloudsEl + fence + barn + barnDoor + cow)
}

function img049() {
  const b1 = building(200, 650, { width: 100, height: 320, roofStyle: 'flat' })
  const b2 = building(340, 650, { width: 140, height: 400, roofStyle: 'flat' })
  const b3 = building(500, 650, { width: 110, height: 280, roofStyle: 'flat' })
  const b4 = building(630, 650, { width: 90, height: 220, roofStyle: 'flat' })
  const antenna = lineTag(340, 250, 340, 190) + circle(340, 180, 10)
  const car = pathTag('M 150 400 Q 180 380 220 400 Q 250 380 280 400 L 280 420 L 150 420 Z') + circle(180, 425, 10) + circle(250, 425, 10)
  const moon = circle(680, 150, 50)
  const bridge = pathTag('M 260 650 Q 400 600 540 650')
  return svgWrap(moon + car + b1 + b2 + b3 + b4 + antenna + bridge)
}

function fairyHouse(cx, baseY, { width = 110, height = 140 } = {}) {
  const topY = baseY - height
  const body = rectTag(cx - width / 2, topY, width, height)
  const roof = pathTag(`M ${N(cx - width / 2 - 14)} ${N(topY)} Q ${N(cx)} ${N(topY - 80)} ${N(cx + width / 2 + 14)} ${N(topY)} Z`)
  const door = pathTag(`M ${N(cx - 20)} ${N(baseY)} L ${N(cx - 20)} ${N(baseY - 50)} Q ${N(cx)} ${N(baseY - 80)} ${N(cx + 20)} ${N(baseY - 50)} L ${N(cx + 20)} ${N(baseY)}`)
  const windowEl = circle(cx - width / 2 + 20, topY + 40, 16) + circle(cx + width / 2 - 20, topY + 40, 16)
  return body + roof + door + windowEl
}

function img050() {
  const h1 = fairyHouse(220, 650, { width: 110, height: 130 })
  const h2 = fairyHouse(400, 660, { width: 140, height: 160 })
  const h3 = fairyHouse(580, 650, { width: 110, height: 130 })
  const treeEl = roundTree(120, 680, 50, 40) + roundTree(680, 680, 50, 40)
  const fence = Array.from({ length: 6 }).map((_, i) => lineTag(300 + i * 25, 700, 300 + i * 25, 660)).join('') + lineTag(300, 680, 450, 680)
  const flowersEl = [
    [180, 700],
    [620, 700],
    [350, 710],
    [450, 710],
  ]
    .map(([x, y]) => flower(x, y, 5, 3, 14, 20, 5))
    .join('')
  const cloudsEl = cloud(200, 150, 0.9) + cloud(550, 120, 0.8)
  const gnome = circle(500, 700, 15) + poly('490,700 510,700 500,670')
  return svgWrap(cloudsEl + treeEl + h1 + h2 + h3 + fence + flowersEl + gnome)
}

const categoryDefs = [
  {
    id: 'sereias',
    nome: 'Sereias',
    emoji: '🧜‍♀️',
    descricao: 'Criaturas mitológicas do oceano e cenários aquáticos.',
    paleta: ['#0EA5E9', '#14B8A6', '#8B5CF6', '#F5D0FE'],
    imagens: [
      { id: 'img_001_sereia_rocha', titulo: 'Sereia na Rocha', complexidade: 'Média', svg: img001() },
      { id: 'img_002_sereia_cauda', titulo: 'Sereia com Cauda Brilhante', complexidade: 'Média-Alta', svg: img002() },
      { id: 'img_003_sereia_golfinho', titulo: 'Sereia e Golfinho', complexidade: 'Média', svg: img003() },
      { id: 'img_004_rainha_sereia', titulo: 'Rainha Sereia no Trono', complexidade: 'Alta', svg: img004() },
      { id: 'img_005_sereia_jovem', titulo: 'Sereia Jovem com Cauda Rosa', complexidade: 'Média', svg: img005() },
    ],
  },
  {
    id: 'princesas',
    nome: 'Princesas',
    emoji: '👑',
    descricao: 'Personagens de contos de fadas com vestidos e coroas.',
    paleta: ['#EC4899', '#8B5CF6', '#3B82F6', '#FDE68A'],
    imagens: [
      { id: 'img_006_princesa_baile', titulo: 'Princesa com Vestido de Baile', complexidade: 'Alta', svg: img006() },
      { id: 'img_007_princesa_castelo', titulo: 'Princesa no Castelo', complexidade: 'Média-Alta', svg: img007() },
      { id: 'img_008_princesa_coroa', titulo: 'Princesa com Coroa e Cetro', complexidade: 'Média', svg: img008() },
      { id: 'img_009_princesa_danca', titulo: 'Princesa Dançarina', complexidade: 'Média', svg: img009() },
      { id: 'img_010_princesa_principe', titulo: 'Princesa e Príncipe', complexidade: 'Alta', svg: img010() },
    ],
  },
  {
    id: 'animais',
    nome: 'Animais',
    emoji: '🦁',
    descricao: 'Fauna diversa em estilos simples e cartoon.',
    paleta: ['#92400E', '#F97316', '#22C55E', '#FACC15'],
    imagens: [
      { id: 'img_011_leao_majestoso', titulo: 'Leão Majestoso', complexidade: 'Média', svg: img011() },
      { id: 'img_012_gato_brincalhao', titulo: 'Gato Brincalhão', complexidade: 'Baixa', svg: img012() },
      { id: 'img_013_passaro_tropical', titulo: 'Pássaro Tropical', complexidade: 'Média-Alta', svg: img013() },
      { id: 'img_014_elefante_filhote', titulo: 'Elefante e Filhote', complexidade: 'Média', svg: img014() },
      { id: 'img_015_borboleta_colorida', titulo: 'Borboleta Colorida', complexidade: 'Média-Alta', svg: img015() },
    ],
  },
  {
    id: 'flores',
    nome: 'Flores',
    emoji: '🌸',
    descricao: 'Botânica diversa em diferentes composições.',
    paleta: ['#EC4899', '#8B5CF6', '#EF4444', '#22C55E'],
    imagens: [
      { id: 'img_016_girassol_grande', titulo: 'Girassol Grande', complexidade: 'Média', svg: img016() },
      { id: 'img_017_buque_flores', titulo: 'Buquê de Flores', complexidade: 'Alta', svg: img017() },
      { id: 'img_018_lotus_agua', titulo: 'Lótus na Água', complexidade: 'Média-Alta', svg: img018() },
      { id: 'img_019_cerejeira', titulo: 'Ramo de Cerejeira', complexidade: 'Média-Alta', svg: img019() },
      { id: 'img_020_orquidea_exotica', titulo: 'Orquídea Exótica', complexidade: 'Alta', svg: img020() },
    ],
  },
  {
    id: 'castelos',
    nome: 'Castelos',
    emoji: '🏰',
    descricao: 'Arquitetura de fantasia com torres e detalhes medievais.',
    paleta: ['#6B7280', '#92400E', '#3B82F6', '#FACC15'],
    imagens: [
      { id: 'img_021_castelo_misterioso', titulo: 'Castelo Misterioso', complexidade: 'Alta', svg: img021() },
      { id: 'img_022_palacio_cristal', titulo: 'Palácio de Cristal', complexidade: 'Alta', svg: img022() },
      { id: 'img_023_castelo_amanhecer', titulo: 'Castelo ao Amanhecer', complexidade: 'Média-Alta', svg: img023() },
      { id: 'img_024_fortaleza_flutuante', titulo: 'Fortaleza Flutuante', complexidade: 'Alta', svg: img024() },
      { id: 'img_025_ruinas_encantadas', titulo: 'Ruínas Encantadas', complexidade: 'Média-Alta', svg: img025() },
    ],
  },
  {
    id: 'dinossauros',
    nome: 'Dinossauros',
    emoji: '🦕',
    descricao: 'Criaturas pré-históricas em diferentes ambientes.',
    paleta: ['#22C55E', '#92400E', '#6B7280', '#F97316'],
    imagens: [
      { id: 'img_026_trex', titulo: 'Tiranossauro Rex', complexidade: 'Média', svg: img026() },
      { id: 'img_027_triceratops', titulo: 'Triceratops Amigável', complexidade: 'Média', svg: img027() },
      { id: 'img_028_estegossauro', titulo: 'Estegossauro com Placas', complexidade: 'Média-Alta', svg: img028() },
      { id: 'img_029_pterodactilo', titulo: 'Pterodáctilo Voador', complexidade: 'Média-Alta', svg: img029() },
      { id: 'img_030_familia_dinossauros', titulo: 'Família de Dinossauros', complexidade: 'Alta', svg: img030() },
    ],
  },
  {
    id: 'galaxia_espaco',
    nome: 'Galáxia e Espaço',
    emoji: '🚀',
    descricao: 'Ficção científica e exploração espacial.',
    paleta: ['#1E1B4B', '#8B5CF6', '#F97316', '#38BDF8'],
    imagens: [
      { id: 'img_031_astronauta_lua', titulo: 'Astronauta na Lua', complexidade: 'Média', svg: img031() },
      { id: 'img_032_sistema_solar', titulo: 'Sistema Solar', complexidade: 'Média-Alta', svg: img032() },
      { id: 'img_033_nave_espacial', titulo: 'Nave Espacial Futurista', complexidade: 'Média-Alta', svg: img033() },
      { id: 'img_034_alienigena_amigavel', titulo: 'Alienígena Amigável', complexidade: 'Média', svg: img034() },
      { id: 'img_035_buraco_negro', titulo: 'Buraco Negro com Matéria', complexidade: 'Alta', svg: img035() },
    ],
  },
  {
    id: 'fadas_magicas',
    nome: 'Fadas e Criaturas Mágicas',
    emoji: '✨',
    descricao: 'Seres fantásticos com magia, asas e poderes sobrenaturais.',
    paleta: ['#EC4899', '#8B5CF6', '#3B82F6', '#BEF264'],
    imagens: [
      { id: 'img_036_fada_asas', titulo: 'Fada com Asas de Borboleta', complexidade: 'Média', svg: img036() },
      { id: 'img_037_unicornio_magico', titulo: 'Unicórnio Mágico', complexidade: 'Média-Alta', svg: img037() },
      { id: 'img_038_dragao_protetor', titulo: 'Dragão Protetor', complexidade: 'Alta', svg: img038() },
      { id: 'img_039_fada_bosque', titulo: 'Fada do Bosque', complexidade: 'Média-Alta', svg: img039() },
      { id: 'img_040_fada_rainha_noite', titulo: 'Fada Rainha da Noite', complexidade: 'Alta', svg: img040() },
    ],
  },
  {
    id: 'mandalas_padroes',
    nome: 'Mandalas e Padrões',
    emoji: '🔮',
    descricao: 'Geometria simétrica, padrões repetitivos e designs abstratos.',
    paleta: ['#EF4444', '#F97316', '#FACC15', '#22C55E', '#3B82F6', '#8B5CF6'],
    imagens: [
      { id: 'img_041_mandala_floral', titulo: 'Mandala Floral Simétrica', complexidade: 'Alta', svg: img041() },
      { id: 'img_042_padrao_geometrico', titulo: 'Padrão Geométrico Intricado', complexidade: 'Alta', svg: img042() },
      { id: 'img_043_mandala_espiral', titulo: 'Mandala Espiral', complexidade: 'Média-Alta', svg: img043() },
      { id: 'img_044_padrao_islamico', titulo: 'Padrão Islâmico Tradicional', complexidade: 'Alta', svg: img044() },
      { id: 'img_045_mandala_vida', titulo: 'Mandala da Vida', complexidade: 'Alta', svg: img045() },
    ],
  },
  {
    id: 'cidades_cenarios',
    nome: 'Cidades e Cenários',
    emoji: '🏙️',
    descricao: 'Paisagens urbanas, rurais e fantásticas.',
    paleta: ['#6B7280', '#3B82F6', '#22C55E', '#F97316'],
    imagens: [
      { id: 'img_046_rua_europeia', titulo: 'Rua Histórica Europeia', complexidade: 'Alta', svg: img046() },
      { id: 'img_047_praia_paradisiaca', titulo: 'Praia Paradisíaca', complexidade: 'Média-Alta', svg: img047() },
      { id: 'img_048_paisagem_rural', titulo: 'Paisagem Rural Campestre', complexidade: 'Média-Alta', svg: img048() },
      { id: 'img_049_cidade_futurista', titulo: 'Cidade Fantástica Futurista', complexidade: 'Alta', svg: img049() },
      { id: 'img_050_aldeia_contos', titulo: 'Aldeia Conto de Fadas', complexidade: 'Média-Alta', svg: img050() },
    ],
  },
]

categoryDefs.forEach((cat) => {
  cat.imagens.forEach((img) => {
    img.largura = W
    img.altura = H
    img.formato = 'svg'
    img.categoriaId = cat.id
    img.categoriaNome = cat.nome
  })
})

export const categories = categoryDefs
