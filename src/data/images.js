export const categoryOrder = [
  'sereias',
  'princesas',
  'animais',
  'flores',
  'castelos',
  'dinossauros',
  'galaxia_espaco',
  'fadas_magicas',
  'mandalas_padroes',
  'cidades_cenarios',
]

const categoryMeta = {
  sereias: { nome: 'Sereias', emoji: '🧜‍♀️', descricao: 'Criaturas mitológicas do oceano e cenários aquáticos.' },
  princesas: { nome: 'Princesas', emoji: '👑', descricao: 'Personagens de contos de fadas com vestidos e coroas.' },
  animais: { nome: 'Animais', emoji: '🦁', descricao: 'Fauna diversa em estilos simples e cartoon.' },
  flores: { nome: 'Flores', emoji: '🌸', descricao: 'Botânica diversa em diferentes composições.' },
  castelos: { nome: 'Castelos', emoji: '🏰', descricao: 'Arquitetura de fantasia com torres e detalhes medievais.' },
  dinossauros: { nome: 'Dinossauros', emoji: '🦕', descricao: 'Criaturas pré-históricas em diferentes ambientes.' },
  galaxia_espaco: { nome: 'Galáxia e Espaço', emoji: '🚀', descricao: 'Ficção científica e exploração espacial.' },
  fadas_magicas: { nome: 'Fadas e Criaturas Mágicas', emoji: '✨', descricao: 'Seres fantásticos com magia, asas e poderes sobrenaturais.' },
  mandalas_padroes: { nome: 'Mandalas e Padrões', emoji: '🔮', descricao: 'Geometria simétrica, padrões repetitivos e designs abstratos.' },
  cidades_cenarios: { nome: 'Cidades e Cenários', emoji: '🏙️', descricao: 'Paisagens urbanas, rurais e fantásticas.' },
}

// Cada arquivo colocado em src/assets/images/<categoria>/ aparece
// automaticamente na galeria — não precisa editar nenhum código.
const modules = import.meta.glob('/src/assets/images/*/*.{png,jpg,jpeg,jfif,webp,gif,svg,PNG,JPG,JPEG,JFIF,WEBP,GIF,SVG}', {
  eager: true,
  import: 'default',
})

function prettifyName(filename) {
  const base = filename.replace(/\.[^.]+$/, '')
  return base
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

const imagesBySlug = {}
for (const path in modules) {
  const match = path.match(/\/images\/([^/]+)\/([^/]+)$/)
  if (!match) continue
  const [, slug, filename] = match
  if (!imagesBySlug[slug]) imagesBySlug[slug] = []
  imagesBySlug[slug].push({ filename, url: modules[path] })
}

export const categories = categoryOrder.map((slug) => {
  const meta = categoryMeta[slug]
  const imagens = (imagesBySlug[slug] || [])
    .sort((a, b) => a.filename.localeCompare(b.filename))
    .map(({ filename, url }) => ({
      id: `${slug}__${filename}`,
      titulo: prettifyName(filename),
      url,
      categoriaId: slug,
      categoriaNome: meta.nome,
    }))
  return { id: slug, ...meta, imagens }
})
