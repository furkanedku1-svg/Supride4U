import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Cake, { buildCandles } from '../components/Cake'
import { startBlowDetector } from '../lib/mic'
import { sfx } from '../lib/audio'
import { bigShow, burst } from '../lib/effects'

// Aşama 1: Pasta üfleme. İki yöntem: mikrofonla üfle (Web Audio) · mumlara dokun / basılı tut.
export default function CakeStage({ gift, theme, onDone, testMode }) {
  const { age = 25, message = 'İyi ki doğdun!', blow = 'mic' } = gift?.birthday || {}
  const candles = useMemo(() => buildCandles(age), [age])
  const n = candles.length
  const [lit, setLit] = useState(() => Array(n).fill(true))
  const litRef = useRef(lit)
  const [mic, setMic] = useState(blow === 'mic' ? 'idle' : 'off') // idle | asking | on | denied | off
  const [level, setLevel] = useState(0)
  const [done, setDone] = useState(false)
  const wrapRef = useRef(null)
  const holding = useRef(false)
  const micLevel = useRef(0)
  const power = useRef(0)
  const flameSmooth = useRef(0)
  const order = useMemo(() => [...Array(n).keys()].sort(() => Math.random() - 0.5), [n])
  const detector = useRef(null)
  const doneRef = useRef(false)

  const snuff = useCallback((idx) => {
    if (!litRef.current[idx]) return
    const next = [...litRef.current]
    next[idx] = false
    litRef.current = next
    setLit(next)
    sfx.puff()
    if (next.every((v) => !v) && !doneRef.current) {
      doneRef.current = true
      setDone(true)
    }
  }, [])

  // Finale
  useEffect(() => {
    if (!done) return
    const t1 = setTimeout(() => {
      burst(theme.bg.concat(theme.accent, '#ffd23f', '#ffffff'))
      bigShow([theme.accent, '#ffd23f', '#ffffff', theme.box], 1600)
      sfx.chime()
    }, 500)
    const t2 = setTimeout(onDone, 4200)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [done, onDone, theme])

  // Ana döngü: üfleme gücü (mikrofon veya basılı tutma) → alev eğimi + mumların sönmesi
  useEffect(() => {
    let raf
    let last = performance.now()
    const tick = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const intensity = Math.max(micLevel.current, holding.current ? 0.85 : 0)
      flameSmooth.current += (intensity - flameSmooth.current) * 0.25
      wrapRef.current?.style.setProperty('--blow', flameSmooth.current.toFixed(3))
      if (!doneRef.current) {
        if (intensity > 0.12) power.current += intensity * dt * 0.9
        else power.current = Math.max(0, power.current - dt * 0.25)
        const target = Math.min(n, Math.floor(power.current * n * 1.05))
        const outNow = litRef.current.filter((v) => !v).length
        if (target > outNow) {
          const idx = order.find((i) => litRef.current[i])
          if (idx !== undefined) snuff(idx)
        }
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [n, order, snuff])

  const stopMic = () => {
    detector.current?.stop()
    detector.current = null
  }
  useEffect(() => stopMic, [])

  const askMic = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setMic('denied')
      return
    }
    setMic('asking')
    const d = startBlowDetector((lv) => {
      micLevel.current = lv
      setLevel((p) => (Math.abs(p - lv) > 0.04 ? lv : p))
    })
    detector.current = d
    try {
      await d.ready
      setMic('on')
    } catch {
      setMic('denied')
      detector.current = null
    }
  }

  const remaining = lit.filter(Boolean).length

  return (
    <motion.div className="stage stage-cake" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.05 }}>
      <motion.div className="cake-banner glass" initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
        <span className="cake-banner-emoji">🎉</span>
        <p>{message || 'İyi ki doğdun!'}</p>
      </motion.div>

      <div
        ref={wrapRef}
        className="cake-wrap"
        onPointerDown={() => (holding.current = true)}
        onPointerUp={() => (holding.current = false)}
        onPointerLeave={() => (holding.current = false)}
        onPointerCancel={() => (holding.current = false)}
        style={{ '--blow': 0, touchAction: 'manipulation' }}
      >
        <motion.div initial={{ y: 80, scale: 0.8, opacity: 0 }} animate={{ y: 0, scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 120, damping: 14, delay: 0.1 }}>
          <Cake age={age} lit={lit} onCandleTap={snuff} />
        </motion.div>
      </div>

      <AnimatePresence mode="wait">
        {!done ? (
          <motion.div key="help" className="cake-help" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <p className="stage-title">Dilek tut ve mumları söndür! 🕯️</p>
            <p className="stage-sub">
              {mic === 'on'
                ? 'Mikrofona doğru güçlüce üfle…'
                : 'Mumlara dokun ya da pastaya basılı tut'}
              {remaining < n ? ` · kalan: ${remaining}` : ''}
            </p>
            {blow === 'mic' && mic !== 'on' && mic !== 'denied' && (
              <button className="btn btn-primary" onClick={askMic} disabled={mic === 'asking'}>
                🎤 {mic === 'asking' ? 'İzin bekleniyor…' : 'Mikrofonla üfle'}
              </button>
            )}
            {mic === 'denied' && <p className="stage-note">Mikrofon kullanılamadı — dokunarak söndürebilirsin 👆</p>}
            {mic === 'on' && (
              <div className="mic-meter" aria-label="Üfleme şiddeti">
                <motion.i animate={{ width: `${Math.round(level * 100)}%` }} transition={{ duration: 0.08 }} />
              </div>
            )}
            {testMode && (
              <button className="btn btn-ghost btn-sm" onClick={() => candles.forEach((_, i) => snuff(i))}>
                ⏭ Hepsini söndür (test)
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div key="done" className="cake-help" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
            <p className="stage-title big">Dileğin kabul olsun! ✨</p>
            <p className="stage-sub">Şimdi sürprizin zamanı…</p>
            <button className="btn btn-primary" onClick={onDone}>
              Hediyeye geç 🎁
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
