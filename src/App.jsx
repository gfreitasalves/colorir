import { useCallback, useEffect, useState } from 'react'
import Header from './components/Header'
import Gallery from './components/Gallery'
import Palette from './components/Palette'
import Toolbar from './components/Toolbar'
import { PaletteIcon } from './components/icons/PaletteBrushIcons'
import Canvas from './components/Canvas'
import ColorPicker from './components/ColorPicker'
import Celebration from './components/Celebration'
import { useCanvas } from './hooks/useCanvas'
import { useColor } from './hooks/useColor'
import { useSound } from './hooks/useSound'
import { loadDraft, exportImage } from './utils/imageUtils'
import { watermarkBackground } from './utils/watermark'
import { stickers } from './data/stickers'
import { photoFileToColoringPage } from './utils/edgeDetection'

export default function App() {
  const [view, setView] = useState('gallery')
  const [selectedImage, setSelectedImage] = useState(null)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [activeTool, setActiveTool] = useState('balde')
  const [selectedSticker, setSelectedSticker] = useState(stickers[0].id)
  const [importingPhoto, setImportingPhoto] = useState(false)
  const [celebrating, setCelebrating] = useState(false)
  const [darkMode, setDarkMode] = useState(() => {
    try {
      return localStorage.getItem('colorir:darkMode') === 'true'
    } catch {
      return false
    }
  })

  const canvas = useCanvas()
  const { selectedColor, selectColor, selectedPattern, setSelectedPattern, history, addCustomColor } = useColor()
  const { muted, toggleMute, playBlip, playFanfare } = useSound()

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
      setZoom(1)
      setActiveTool('balde')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, selectedImage])

  const handleImportPhoto = useCallback(
    async (file) => {
      setImportingPhoto(true)
      try {
        const dataUrl = await photoFileToColoringPage(file)
        handleSelectImage({ id: `import-${Date.now()}`, titulo: 'Minha Foto', url: dataUrl })
      } catch (err) {
        window.alert('Não foi possível processar essa foto. Tente outra imagem.')
      } finally {
        setImportingPhoto(false)
      }
    },
    [handleSelectImage]
  )

  const handleBackToGallery = useCallback(() => {
    setView('gallery')
    setSelectedImage(null)
  }, [])

  const handleSelectColorMobile = useCallback(
    (hex) => {
      selectColor(hex)
      setPaletteOpen(false)
    },
    [selectColor]
  )

  const handleSelectStickerMobile = useCallback((id) => {
    setSelectedSticker(id)
    setPaletteOpen(false)
  }, [])

  const handleCanvasClick = useCallback(
    (point) => {
      if (activeTool === 'borracha') {
        if (canvas.fillAt(point, null)) playBlip()
      } else if (activeTool === 'adesivo') {
        canvas.stampAt(point, selectedSticker).then((changed) => {
          if (changed) playBlip()
        })
      } else if (canvas.fillAt(point, selectedColor, selectedPattern)) {
        playBlip()
      }
    },
    [activeTool, canvas, playBlip, selectedColor, selectedPattern, selectedSticker]
  )

  const handleCelebrate = useCallback(() => {
    playFanfare()
    setCelebrating(true)
  }, [playFanfare])

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
    <div
      className="flex h-dvh flex-col overflow-hidden bg-gray-100 dark:bg-gray-900"
      style={{ backgroundImage: watermarkBackground, backgroundRepeat: 'repeat' }}
    >
      <div className="shrink-0">
        <Header
          view={view}
          categoryTitle={selectedImage?.categoriaNome}
          imageTitle={selectedImage?.titulo}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode((d) => !d)}
          muted={muted}
          onToggleMute={toggleMute}
        />
      </div>

      {view === 'gallery' && (
        <main className="flex-1 overflow-y-auto">
          <Gallery onSelectImage={handleSelectImage} onImportPhoto={handleImportPhoto} importing={importingPhoto} />
        </main>
      )}

      {view === 'editor' && selectedImage && (
        <>
          <div className="shrink-0">
            <Toolbar onBack={handleBackToGallery} onSave={handleSave} />
          </div>

          <div className="flex min-h-0 flex-1 overflow-hidden">
            <div className="hidden md:block">
              <Palette
                selectedColor={selectedColor}
                onSelectColor={selectColor}
                history={history}
                onOpenPicker={() => setPickerOpen(true)}
                tool={activeTool}
                onToolChange={setActiveTool}
                stickers={stickers}
                selectedSticker={selectedSticker}
                onSelectSticker={setSelectedSticker}
                selectedPattern={selectedPattern}
                onSelectPattern={setSelectedPattern}
                onUndo={canvas.undo}
                canUndo={canvas.canUndo}
                onRedo={canvas.redo}
                canRedo={canvas.canRedo}
                onReset={handleReset}
                zoom={zoom}
                onZoomChange={setZoom}
                onCelebrate={handleCelebrate}
              />
            </div>

            <div className="min-h-0 flex-1 overflow-hidden">
              <Canvas
                baseCanvasRef={canvas.baseCanvasRef}
                drawCanvasRef={canvas.drawCanvasRef}
                width={canvas.imageSize.width}
                height={canvas.imageSize.height}
                color={selectedColor}
                tool={activeTool}
                onFill={handleCanvasClick}
                zoom={zoom}
                onZoomChange={setZoom}
              />
            </div>
          </div>

          <nav className="flex h-12 shrink-0 border-t border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 md:hidden">
            <button
              type="button"
              onClick={() => setPaletteOpen((o) => !o)}
              className="flex flex-1 items-center justify-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              <PaletteIcon size={20} />
              Ferramentas
            </button>
          </nav>

          {paletteOpen && (
            <div className="fixed inset-x-0 bottom-12 z-40 max-h-[70vh] overflow-y-auto border-t border-gray-200 shadow-2xl md:hidden">
              <Palette
                selectedColor={selectedColor}
                onSelectColor={handleSelectColorMobile}
                history={history}
                onOpenPicker={() => setPickerOpen(true)}
                tool={activeTool}
                onToolChange={setActiveTool}
                stickers={stickers}
                selectedSticker={selectedSticker}
                onSelectSticker={handleSelectStickerMobile}
                selectedPattern={selectedPattern}
                onSelectPattern={setSelectedPattern}
                onUndo={canvas.undo}
                canUndo={canvas.canUndo}
                onRedo={canvas.redo}
                canRedo={canvas.canRedo}
                onReset={handleReset}
                zoom={zoom}
                onZoomChange={setZoom}
                onCelebrate={handleCelebrate}
              />
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

      {celebrating && <Celebration onClose={() => setCelebrating(false)} />}
    </div>
  )
}
