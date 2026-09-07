import { useCallback, useEffect, useState } from 'react'
import Header from './components/Header'
import Gallery from './components/Gallery'
import Palette from './components/Palette'
import Toolbar from './components/Toolbar'
import Canvas from './components/Canvas'
import ColorPicker from './components/ColorPicker'
import { useCanvas } from './hooks/useCanvas'
import { useColor } from './hooks/useColor'
import { loadDraft, exportImage } from './utils/imageUtils'

export default function App() {
  const [view, setView] = useState('gallery')
  const [selectedImage, setSelectedImage] = useState(null)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(() => {
    try {
      return localStorage.getItem('colorir:darkMode') === 'true'
    } catch {
      return false
    }
  })

  const canvas = useCanvas()
  const { selectedColor, selectColor, history, addCustomColor } = useColor()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    try {
      localStorage.setItem('colorir:darkMode', String(darkMode))
    } catch {
      // ignore persistence failures
    }
  }, [darkMode])

  const handleSelectImage = useCallback((image) => {
    setSelectedImage(image)
    setView('editor')
  }, [])

  useEffect(() => {
    if (view === 'editor' && selectedImage) {
      const draft = loadDraft(selectedImage.id)
      canvas.loadImageToCanvas(selectedImage, draft)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, selectedImage])

  const handleBackToGallery = useCallback(() => {
    setView('gallery')
    setSelectedImage(null)
  }, [])

  const handleSave = useCallback(() => {
    if (!selectedImage) return
    exportImage(canvas.baseCanvasRef.current, canvas.drawCanvasRef.current, selectedImage.titulo, 'png')
  }, [canvas, selectedImage])

  const handleReset = useCallback(() => {
    if (window.confirm('Restaurar a imagem original? Isso apagará toda a coloração atual.')) {
      canvas.resetCanvas()
    }
  }, [canvas])

  useEffect(() => {
    function onKeyDown(e) {
      if (view !== 'editor') return
      const ctrlOrCmd = e.ctrlKey || e.metaKey
      if (!ctrlOrCmd) return
      if (e.key.toLowerCase() === 'z' && e.shiftKey) {
        e.preventDefault()
        canvas.redo()
      } else if (e.key.toLowerCase() === 'z') {
        e.preventDefault()
        canvas.undo()
      } else if (e.key.toLowerCase() === 'y') {
        e.preventDefault()
        canvas.redo()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [view, canvas])

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-gray-100 dark:bg-gray-900">
      <div className="shrink-0">
        <Header view={view} imageTitle={selectedImage?.titulo} darkMode={darkMode} onToggleDarkMode={() => setDarkMode((d) => !d)} />
      </div>

      {view === 'gallery' && (
        <main className="flex-1 overflow-y-auto">
          <Gallery onSelectImage={handleSelectImage} />
        </main>
      )}

      {view === 'editor' && selectedImage && (
        <>
          <div className="shrink-0">
            <Toolbar
              onBack={handleBackToGallery}
              onUndo={canvas.undo}
              canUndo={canvas.canUndo}
              onRedo={canvas.redo}
              canRedo={canvas.canRedo}
              onReset={handleReset}
              onSave={handleSave}
            />
          </div>

          <div className="flex min-h-0 flex-1 overflow-hidden">
            <div className="hidden md:block">
              <Palette selectedColor={selectedColor} onSelectColor={selectColor} history={history} onOpenPicker={() => setPickerOpen(true)} />
            </div>

            <div className="min-h-0 flex-1 overflow-hidden">
              <Canvas
                baseCanvasRef={canvas.baseCanvasRef}
                drawCanvasRef={canvas.drawCanvasRef}
                width={selectedImage.largura}
                height={selectedImage.altura}
                onFill={(p) => canvas.fillAt(p, selectedColor)}
              />
            </div>
          </div>

          <nav className="flex h-12 shrink-0 border-t border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 md:hidden">
            <button
              type="button"
              onClick={() => setPaletteOpen((o) => !o)}
              className="flex flex-1 items-center justify-center text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              🎨 Cores
            </button>
          </nav>

          {paletteOpen && (
            <div className="fixed inset-x-0 bottom-12 z-40 max-h-[60vh] overflow-y-auto border-t border-gray-200 shadow-2xl md:hidden">
              <Palette selectedColor={selectedColor} onSelectColor={selectColor} history={history} onOpenPicker={() => setPickerOpen(true)} />
            </div>
          )}
        </>
      )}

      {pickerOpen && (
        <ColorPicker
          initialColor={selectedColor}
          onCancel={() => setPickerOpen(false)}
          onConfirm={(hex) => {
            addCustomColor(hex)
            setPickerOpen(false)
          }}
        />
      )}
    </div>
  )
}
