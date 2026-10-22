import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

const COLS = 24
const ROWS = 8

// Kazı-kazan: gümüş folyo canvas'ı; parmak/fare ile kazınır. Çoğu alan açılınca otomatik tamamen açılır.
export default function ScratchCard({ children, onReveal, label = 'Kazı ✨' }) {
  const wrapRef = useRef(null)
  const canvasRef = useRef(null)
  const touched = useRef(false)
  const drawing = useRef(false)
  const last = useRef(null)
  const cells = useRef(new Set())
  const [revealed, setRevealed] = useState(false)

  const paintFoil = useCallback(() => {
    const wrap = wrapRef.current
    const cv = canvasRef.current
    if (!wrap || !cv) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const w = wrap.clientWidth
    const h = wrap.clientHeight
    cv.width = w * dpr
    cv.height = h * dpr
    cv.style.width = w + 'px'
    cv.style.height = h + 'px'
    const ctx = cv.getContext('2d')
    ctx.scale(dpr, dpr)
    const g = ctx.createLinearGradient(0, 0, w, h)
    g.addColorStop(0, '#c9ccd6')
    g.addColorStop(0.3, '#eef0f6')
    g.addColorStop(0.55, '#b9bdca')
    g.addColorStop(0.8, '#e7e9f1')
    g.addColorStop(1, '#bfc3d0')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, w, h)
    for (let i = 0; i < w * h * 0.012; i++) {
      ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255,255,255,.35)' : 'rgba(110,115,135,.18)'
      ctx.fillRect(Math.random() * w, Math.random() * h, 1.6, 1.6)
    }
    ctx.fillStyle = 'rgba(90,96,120,.55)'
    ctx.font = '600 15px Outfit, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('✦  ' + label + '  ✦', w / 2, h / 2)
  }, [label])

  useEffect(() => {
    paintFoil()
    const ro = new ResizeObserver(() => {
      if (!touched.current) paintFoil()
    })
    if (wrapRef.current) ro.observe(wrapRef.current)
    return () => ro.disconnect()
  }, [paintFoil])

  const pos = (e) => {
    const r = canvasRef.current.getBoundingClientRect()
    return { x: e.clientX - r.left, y: e.clientY - r.top, w: r.width, h: r.height }
  }

  const scratch = (e) => {
    const cv = canvasRef.current
    const ctx = cv.getContext('2d')
    const p = pos(e)
    ctx.save()
    ctx.globalCompositeOperation = 'destination-out'
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.lineWidth = 38
    ctx.beginPath()
    const from = last.current || p
    ctx.moveTo(from.x, from.y)
    ctx.lineTo(p.x, p.y)
    ctx.stroke()
    ctx.restore()
    last.current = p

    // kaba ızgara ile ilerleme takibi
    const cx = Math.floor((p.x / p.w) * COLS)
    const cy = Math.floor((p.y / p.h) * ROWS)
    const rx = Math.ceil((19 / p.w) * COLS)
    const ry = Math.ceil((19 / p.h) * ROWS)
    for (let i = cx - rx; i <= cx + rx; i++)
      for (let j = cy - ry; j <= cy + ry; j++) if (i >= 0 && j >= 0 && i < COLS && j < ROWS) cells.current.add(j * COLS + i)
    if (cells.current.size / (COLS * ROWS) > 0.55 && !revealed) {
      setRevealed(true)
      onReveal?.()
    }
  }

  return (
    <div className="scratch" ref={wrapRef}>
      <div className="scratch-under">{children}</div>
      <motion.canvas
        ref={canvasRef}
        className="scratch-canvas"
        animate={{ opacity: revealed ? 0 : 1 }}
        transition={{ duration: 0.7 }}
        style={{ pointerEvents: revealed ? 'none' : 'auto', touchAction: 'none' }}
        onPointerDown={(e) => {
          touched.current = true
          drawing.current = true
          last.current = null
          e.currentTarget.setPointerCapture(e.pointerId)
          scratch(e)
        }}
        onPointerMove={(e) => drawing.current && scratch(e)}
        onPointerUp={() => {
          drawing.current = false
          last.current = null
        }}
        onPointerCancel={() => {
          drawing.current = false
          last.current = null
        }}
      />
    </div>
  )
}
