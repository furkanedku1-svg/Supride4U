import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import { sfx } from '../lib/audio'
import { hearts } from '../lib/effects'

const COLORS = [
  { id: '#1e293b', name: 'Siyah' },
  { id: '#e11d48', name: 'Kırmızı' },
  { id: '#ec4899', name: 'Pembe' },
  { id: '#a855f7', name: 'Lila' },
  { id: '#3b82f6', name: 'Mavi' },
  { id: '#10b981', name: 'Yeşil' },
  { id: '#f59e0b', name: 'Sarı' },
  { id: '#854d0e', name: 'Kahve' },
]

const BRUSHES = [
  { id: 'sm', size: 3, label: 'İnce', stampPx: 32 },
  { id: 'md', size: 7, label: 'Orta', stampPx: 48 },
  { id: 'lg', size: 14, label: 'Kalın', stampPx: 68 },
]

const STAMPS = ['❤️', '💖', '⭐', '🌸', '✨', '🎁', '💌', '🧸', '🎂', '🎉', '🦋', '🎈']

const PAPERS = [
  { id: '#ffffff', name: 'Beyaz' },
  { id: '#fefae0', name: 'Krem' },
  { id: '#fff1f5', name: 'Pudra' },
  { id: '#1e293b', name: 'Gece' },
]

export default function DrawModal({ onSave, onClose }) {
  const canvasRef = useRef(null)
  const isDrawing = useRef(false)
  const historyRef = useRef([])
  const [color, setColor] = useState('#e11d48')
  const [brushSize, setBrushSize] = useState(7)
  const [tool, setTool] = useState('brush') // 'brush' | 'eraser' | 'stamp'
  const [selectedStamp, setSelectedStamp] = useState('❤️')
  const [paper, setPaper] = useState('#ffffff')
  const [note, setNote] = useState('')
  const [hasContent, setHasContent] = useState(false)
  const [canUndo, setCanUndo] = useState(false)

  // Damga önizleme pozisyonu
  const [stampPreview, setStampPreview] = useState(null) // { x, y }

  // Canvas ilk kurulum ve arka plan doldurma
  const initCanvas = (bg = paper) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    historyRef.current = [ctx.getImageData(0, 0, canvas.width, canvas.height)]
    setCanUndo(false)
    setHasContent(false)
  }

  useEffect(() => {
    initCanvas(paper)
  }, [])

  // Kağıt rengi değiştiğinde
  const handlePaperChange = (newPaper) => {
    setPaper(newPaper)
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = newPaper
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    historyRef.current = [ctx.getImageData(0, 0, canvas.width, canvas.height)]
    setCanUndo(false)
    setHasContent(false)
  }

  // Koordinat alma
  const getCoords = (e) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0, cssX: 0, cssY: 0 }
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
      cssX: e.clientX - rect.left,
      cssY: e.clientY - rect.top,
    }
  }

  const saveState = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    historyRef.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height))
    if (historyRef.current.length > 25) {
      historyRef.current.shift()
    }
    setCanUndo(true)
    setHasContent(true)
  }

  // Damga seçimi
  const handleSelectStamp = (stamp) => {
    setSelectedStamp(stamp)
    setTool('stamp')
    sfx.tick()
  }

  const handlePointerDown = (e) => {
    e.preventDefault()
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.setPointerCapture(e.pointerId)
    const { x, y } = getCoords(e)
    const ctx = canvas.getContext('2d')

    if (tool === 'stamp') {
      // İstediğin yere damgala!
      saveState()
      const bObj = BRUSHES.find((b) => b.size === brushSize) || BRUSHES[1]
      const stampPx = bObj.stampPx || 48
      ctx.font = `${stampPx}px 'Apple Color Emoji', 'Segoe UI Emoji', sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(selectedStamp, x, y)

      sfx.sparkle()
      hearts()
      return
    }

    // Fırça veya silgi ile çizim
    saveState()
    isDrawing.current = true

    ctx.beginPath()
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.lineWidth = tool === 'eraser' ? brushSize * 2.5 : brushSize
    ctx.strokeStyle = tool === 'eraser' ? paper : color

    ctx.moveTo(x, y)
    ctx.lineTo(x, y)
    ctx.stroke()
  }

  const handlePointerMove = (e) => {
    const coords = getCoords(e)

    // Damga aracı açıkken imleçte canlı emoji önizlemesi
    if (tool === 'stamp') {
      setStampPreview({ x: coords.cssX, y: coords.cssY })
      return
    }

    if (!isDrawing.current) return
    e.preventDefault()
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    ctx.lineTo(coords.x, coords.y)
    ctx.stroke()
  }

  const handlePointerUp = (e) => {
    if (tool === 'stamp') return
    if (!isDrawing.current) return
    isDrawing.current = false
    const canvas = canvasRef.current
    if (canvas) {
      try {
        canvas.releasePointerCapture(e.pointerId)
      } catch {
        /* yoksay */
      }
      const ctx = canvas.getContext('2d')
      ctx.closePath()
    }
  }

  const handlePointerLeave = () => {
    setStampPreview(null)
  }

  const handleUndo = () => {
    if (historyRef.current.length <= 1) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    historyRef.current.pop()
    const prev = historyRef.current[historyRef.current.length - 1]
    if (prev) {
      ctx.putImageData(prev, 0, 0)
    }
    setCanUndo(historyRef.current.length > 1)
    if (historyRef.current.length <= 1) {
      setHasContent(false)
    }
    sfx.tick()
  }

  const handleClear = () => {
    initCanvas(paper)
    sfx.rustle()
  }

  const handleSave = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const dataUrl = canvas.toDataURL('image/jpeg', 0.68)
    const caption = note.trim() || 'Kendi Çizimim 🎨'

    onSave({
      src: dataUrl,
      note: caption,
      isDrawing: true,
    })
    sfx.chime()
    hearts()
    onClose()
  }

  const currentBrushObj = BRUSHES.find((b) => b.size === brushSize) || BRUSHES[1]

  const modalContent = (
    <motion.div
      className="draw-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="draw-modal-panel glass"
        initial={{ scale: 0.92, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.92, y: 20, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 240, damping: 22 }}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="draw-header">
          <div className="draw-title-row">
            <span className="draw-icon">🎨</span>
            <div>
              <h3>Kendi Çizimini Yap</h3>
              <p>Çiz veya emojileri tuvalde istediğin yere dokunarak yerleştir</p>
            </div>
          </div>
          <button type="button" className="draw-close-btn" onClick={onClose} aria-label="Kapat">
            ✕
          </button>
        </header>

        <div className="draw-body">
          {/* Polaroid Çerçevesi İçinde Tuval */}
          <div className="draw-polaroid-frame">
            <div className="draw-tape" aria-hidden="true" />
            <div
              className={`draw-canvas-wrap ${tool === 'stamp' ? 'is-stamping' : ''}`}
              onPointerLeave={handlePointerLeave}
            >
              <canvas
                ref={canvasRef}
                width={400}
                height={400}
                className="draw-canvas"
                style={{ backgroundColor: paper, touchAction: 'none' }}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
              />
              {/* Damga imleç önizlemesi */}
              {tool === 'stamp' && stampPreview && (
                <div
                  className="draw-stamp-cursor-preview"
                  style={{
                    left: stampPreview.x,
                    top: stampPreview.y,
                    fontSize: `${currentBrushObj.stampPx * 0.75}px`,
                  }}
                  aria-hidden="true"
                >
                  {selectedStamp}
                </div>
              )}
            </div>

            {/* Polaroid Alt Notu */}
            <div className="draw-caption-field">
              <input
                type="text"
                maxLength="40"
                placeholder="Polaroid altı notu… (örn: Sana özel çizdim ❤️)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          </div>

          {/* Çizim & Damga Araçları */}
          <div className="draw-tools-col">
            {/* Araç Seçimi & Geri Al / Temizle */}
            <div className="draw-tool-row">
              <button
                type="button"
                className={`draw-tool-btn ${tool === 'brush' ? 'on' : ''}`}
                onClick={() => setTool('brush')}
                title="Fırça / Kalem"
              >
                🖌️ Fırça
              </button>
              <button
                type="button"
                className={`draw-tool-btn ${tool === 'eraser' ? 'on' : ''}`}
                onClick={() => setTool('eraser')}
                title="Silgi"
              >
                🧹 Silgi
              </button>
              <button
                type="button"
                className={`draw-tool-btn ${tool === 'stamp' ? 'on' : ''}`}
                onClick={() => setTool('stamp')}
                title="Emoji Damgası Modu"
              >
                <span>{selectedStamp} Damga</span>
              </button>
              <button
                type="button"
                className="draw-tool-btn"
                onClick={handleUndo}
                disabled={!canUndo}
                title="Geri Al"
              >
                ↩️ Geri
              </button>
              <button
                type="button"
                className="draw-tool-btn danger"
                onClick={handleClear}
                title="Tümünü Temizle"
              >
                🗑️ Sil
              </button>
            </div>

            {/* Damga aktif bildirimi */}
            {tool === 'stamp' && (
              <div className="draw-stamp-tip">
                <span>📍</span>
                <span>Tuvalde dokunduğun yere <strong>{selectedStamp}</strong> eklenir.</span>
              </div>
            )}

            {/* Boyut Seçimi */}
            <div className="draw-section">
              <span className="draw-label">Boyut ({tool === 'stamp' ? 'Damga Büyüklüğü' : 'Fırça Kalınlığı'})</span>
              <div className="draw-brush-sizes">
                {BRUSHES.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    className={`brush-size-btn ${brushSize === b.size ? 'on' : ''}`}
                    onClick={() => setBrushSize(b.size)}
                  >
                    <i style={{ width: b.size * 1.4, height: b.size * 1.4 }} />
                    <span>{b.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Damgalar / Emojiler */}
            <div className="draw-section">
              <span className="draw-label">Damgalanacak Emojiyi Seç (İstediğin Yere Dokun)</span>
              <div className="draw-stamps-row">
                {STAMPS.map((s) => {
                  const isSelected = tool === 'stamp' && selectedStamp === s
                  return (
                    <button
                      key={s}
                      type="button"
                      className={`stamp-btn ${isSelected ? 'on' : ''}`}
                      onClick={() => handleSelectStamp(s)}
                      title={`${s} damgasını seç ve tuvale dokun`}
                    >
                      {s}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Renk Paleti (Fırça modundayken) */}
            {tool === 'brush' && (
              <div className="draw-section">
                <span className="draw-label">Mürekkep Rengi</span>
                <div className="draw-colors-grid">
                  {COLORS.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      className={`color-swatch ${color === c.id ? 'on' : ''}`}
                      style={{ background: c.id }}
                      onClick={() => setColor(c.id)}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Kağıt Zemin Rengi */}
            <div className="draw-section">
              <span className="draw-label">Kağıt Rengi</span>
              <div className="draw-papers-row">
                {PAPERS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    className={`paper-swatch ${paper === p.id ? 'on' : ''}`}
                    style={{ background: p.id }}
                    onClick={() => handlePaperChange(p.id)}
                    title={p.name}
                  >
                    <span>{p.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <footer className="draw-footer">
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Vazgeç
          </button>
          <button
            type="button"
            className="btn btn-primary btn-save-draw"
            onClick={handleSave}
            disabled={!hasContent}
          >
            📸 Polaroid Olarak Ekle
          </button>
        </footer>
      </motion.div>
    </motion.div>
  )

  // createPortal ile doğrudan document.body'ye bağlanarak taşma ve yarım görünme sorununu tamamen çözer
  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent
}
