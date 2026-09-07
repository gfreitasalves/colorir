import { images } from '../data/images'
import { svgToDataUri } from '../utils/imageUtils'

export default function Gallery({ onSelectImage }) {
  return (
    <div className="mx-auto w-full max-w-5xl p-4 md:p-8">
      <h2 className="mb-1 text-2xl font-bold text-gray-800 dark:text-gray-100">Escolha uma imagem para colorir</h2>
      <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">{images.length} imagens disponíveis</p>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {images.map((img) => (
          <button
            key={img.id}
            type="button"
            onClick={() => onSelectImage(img)}
            className="group overflow-hidden rounded-lg border border-gray-200 bg-white text-left shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
          >
            <div className="overflow-hidden bg-gray-50 dark:bg-gray-900">
              <img
                src={svgToDataUri(img.svg)}
                alt={img.titulo}
                loading="lazy"
                className="aspect-square w-full object-contain p-2 transition-transform duration-200 group-hover:scale-110"
              />
            </div>
            <div className="p-2">
              <p className="truncate text-sm font-medium text-gray-700 dark:text-gray-200">{img.titulo}</p>
              <p className="text-xs text-gray-400">
                {img.largura}×{img.altura}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
