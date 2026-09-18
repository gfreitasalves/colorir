import { useMemo, useRef, useState } from 'react'
import { categories } from '../data/images'
import { normalizeText } from '../utils/textUtils'

function ImageCard({ img, onSelectImage, showCategory }) {
  return (
    <button
      type="button"
      onClick={() => onSelectImage(img)}
      className="group overflow-hidden rounded-lg border border-gray-200 bg-white text-left shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
    >
      <div className="overflow-hidden bg-gray-50 dark:bg-gray-900">
        <img
          src={img.url}
          alt={img.titulo}
          loading="lazy"
          className="aspect-square w-full object-contain p-2 transition-transform duration-200 group-hover:scale-110"
        />
      </div>
      <div className="p-2">
        <p className="truncate text-sm font-medium text-gray-700 dark:text-gray-200">{img.titulo}</p>
        {showCategory && <p className="truncate text-xs text-gray-400">{img.categoriaNome}</p>}
      </div>
    </button>
  )
}

export default function Gallery({ onSelectImage, onImportPhoto, importing }) {
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [query, setQuery] = useState('')
  const fileInputRef = useRef(null)
  const normalizedQuery = normalizeText(query.trim())
  const totalImages = categories.reduce((n, c) => n + c.imagens.length, 0)

  const searchResults = useMemo(() => {
    if (!normalizedQuery) return null
    const pool = selectedCategory ? [selectedCategory] : categories
    const results = []
    for (const cat of pool) {
      for (const img of cat.imagens) {
        if (normalizeText(img.titulo).includes(normalizedQuery)) results.push(img)
      }
    }
    return results
  }, [normalizedQuery, selectedCategory])

  const handleSurprise = () => {
    const all = categories.flatMap((c) => c.imagens)
    if (all.length === 0) return
    onSelectImage(all[Math.floor(Math.random() * all.length)])
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (file) onImportPhoto(file)
  }

  return (
    <div className="mx-auto w-full max-w-5xl p-4 md:p-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          {selectedCategory ? (
            <>
              <button
                type="button"
                onClick={() => setSelectedCategory(null)}
                className="mb-1 text-sm font-medium text-brand-blue hover:underline"
              >
                ← Categorias
              </button>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                {selectedCategory.emoji} {selectedCategory.nome}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{selectedCategory.descricao}</p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Escolha uma categoria</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {categories.length} categorias · {totalImages} imagens
              </p>
            </>
          )}
        </div>

        <div className="flex gap-2">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar desenho..."
            aria-label="Buscar desenho"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 sm:w-56"
          />
          {!selectedCategory && !normalizedQuery && (
            <>
              <button
                type="button"
                onClick={handleSurprise}
                className="shrink-0 rounded-md border border-brand-blue px-3 py-2 text-sm font-medium text-brand-blue hover:bg-brand-blue hover:text-white"
              >
                🎲 Me surpreenda
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={importing}
                className="shrink-0 rounded-md border border-brand-blue px-3 py-2 text-sm font-medium text-brand-blue hover:bg-brand-blue hover:text-white disabled:cursor-wait disabled:opacity-60"
              >
                {importing ? '⏳ Processando...' : '📷 Minha foto'}
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </>
          )}
        </div>
      </div>

      {searchResults ? (
        searchResults.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500 dark:border-gray-600 dark:text-gray-400">
            Nenhum desenho encontrado para "{query}".
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {searchResults.map((img) => (
              <ImageCard key={img.id} img={img} onSelectImage={onSelectImage} showCategory={!selectedCategory} />
            ))}
          </div>
        )
      ) : !selectedCategory ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className="group flex flex-col items-center gap-2 rounded-lg border border-gray-200 bg-white p-4 text-center shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
            >
              <span className="text-4xl transition-transform group-hover:scale-110" aria-hidden="true">
                {cat.emoji}
              </span>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{cat.nome}</span>
              <span className="text-xs text-gray-400">{cat.imagens.length} imagens</span>
            </button>
          ))}
        </div>
      ) : selectedCategory.imagens.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500 dark:border-gray-600 dark:text-gray-400">
          Nenhuma imagem nesta categoria ainda. Adicione arquivos (PNG, JPG, SVG...) em{' '}
          <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs dark:bg-gray-700">
            src/assets/images/{selectedCategory.id}/
          </code>
          .
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {selectedCategory.imagens.map((img) => (
            <ImageCard key={img.id} img={img} onSelectImage={onSelectImage} showCategory={false} />
          ))}
        </div>
      )}
    </div>
  )
}
