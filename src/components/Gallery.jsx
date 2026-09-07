import { useState } from 'react'
import { categories } from '../data/images'

export default function Gallery({ onSelectImage }) {
  const [selectedCategory, setSelectedCategory] = useState(null)

  if (!selectedCategory) {
    const totalImages = categories.reduce((n, c) => n + c.imagens.length, 0)
    return (
      <div className="mx-auto w-full max-w-5xl p-4 md:p-8">
        <h2 className="mb-1 text-2xl font-bold text-gray-800 dark:text-gray-100">Escolha uma categoria</h2>
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
          {categories.length} categorias · {totalImages} imagens
        </p>
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
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-5xl p-4 md:p-8">
      <button
        type="button"
        onClick={() => setSelectedCategory(null)}
        className="mb-4 text-sm font-medium text-brand-blue hover:underline"
      >
        ← Categorias
      </button>
      <h2 className="mb-1 text-2xl font-bold text-gray-800 dark:text-gray-100">
        {selectedCategory.emoji} {selectedCategory.nome}
      </h2>
      <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">{selectedCategory.descricao}</p>

      {selectedCategory.imagens.length === 0 ? (
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
            <button
              key={img.id}
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
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
