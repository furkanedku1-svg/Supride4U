import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { DEFAULT_GIFT, normalizeGift } from '../data/options'
import { getTheme, themeVars } from '../data/themes'
import Experience from '../experience/Experience'
import ErrorBoundary from '../components/ErrorBoundary'
import Preview from './Preview'
import { StepFlower, StepLetter, StepMusic, StepPhotos, StepPlush, StepShare, StepTheme, StepType } from './steps'
import { stopMusic } from '../lib/music'

const STEPS = [
  { id: 'theme', emoji: '🎨', title: 'Renk Paleti & Tema', desc: 'Kutunun kaplaması, kurdelesi ve arka plan renkleri buna göre şekillenir.', C: StepTheme },
  { id: 'type', emoji: '🎂', title: 'Hediye Türü & Zaman Kilidi', desc: 'Doğum günü pastası ekle, istersen sürprizi belli bir ana kadar kilitle.', C: StepType },
  { id: 'flower', emoji: '🌷', title: 'Çiçek Seçimi', desc: 'Kutudan masaya dökülecek çiçeği seç.', C: StepFlower },
  { id: 'plush', emoji: '🧸', title: 'Peluş Oyuncak', desc: 'Kutunun içine sevimli bir peluş arkadaş ekle (isteğe bağlı).', C: StepPlush },
  { id: 'photos', emoji: '📷', title: 'Anı Galerisi', desc: 'Polaroid fotoğraflar; alıcı bunları masada sürükleyebilecek.', C: StepPhotos },
  { id: 'letter', emoji: '💌', title: 'Kişisel Not & Zarf', desc: 'El yazısı mektubun ve isteğe bağlı kazı-kazan gizli notun.', C: StepLetter },
  { id: 'music', emoji: '🎵', title: 'Müzik & Ambiyans', desc: 'Hazır bir melodi seç ya da kendi şarkını bağla.', C: StepMusic },
  { id: 'share', emoji: '🔗', title: 'Paylaşım Bağlantısı', desc: 'Test et, kopyala ve sevdiğine gönder.', C: StepShare },
]

const DRAFT_KEY = 'suprise4u:draft:v1'

function loadDraft() {
  try {
    const raw = localStorage.getItem(DRAFT_KEY)
    if (raw) return normalizeGift(JSON.parse(raw))
  } catch {
    /* yoksay */
  }
  return normalizeGift(DEFAULT_GIFT)
}

export default function Builder() {
  const [gift, setGift] = useState(loadDraft)
  const [step, setStep] = useState(1)
  const [dir, setDir] = useState(1)
  const [testOpen, setTestOpen] = useState(false)
  const [sheet, setSheet] = useState(false)
  const panelRef = useRef(null)
  const theme = getTheme(gift.theme)

  // Taslağı otomatik kaydet (depolama dolarsa sessizce vazgeç)
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(gift))
      } catch {
        /* yoksay */
      }
    }, 400)
    return () => clearTimeout(t)
  }, [gift])

  useEffect(() => {
    document.body.style.overflow = testOpen ? 'hidden' : ''
    return () => (document.body.style.overflow = '')
  }, [testOpen])

  const upd = useCallback((key, val) => setGift((g) => ({ ...g, [key]: val })), [])
  const updIn = useCallback((key, patch) => setGift((g) => ({ ...g, [key]: { ...g[key], ...patch } })), [])

  const go = (n) => {
    if (n < 1 || n > STEPS.length) return
    stopMusic()
    setDir(n > step ? 1 : -1)
    setStep(n)
    panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const reset = () => {
    if (!confirm('Tüm girdiler silinsin ve baştan başlansın mı?')) return
    setGift(normalizeGift(DEFAULT_GIFT))
    setStep(1)
  }

  const cur = STEPS[step - 1]
  const Step = cur.C
  const progress = ((step - 1) / (STEPS.length - 1)) * 100
  const style = useMemo(() => themeVars(theme), [theme])

  return (
    <div className="builder" style={style} data-dark={theme.dark ? '1' : '0'}>
      <div className="backdrop" aria-hidden="true">
        <div className="backdrop-glow g1" />
        <div className="backdrop-glow g2" />
      </div>

      <header className="b-header">
        <div className="brand">
          <span className="brand-mark">🎁</span>
          <div>
            <h1>Suprise4U</h1>
            <p>Uzaktaki sevdiklerine unutulmaz bir dijital sürpriz kutusu hazırla</p>
          </div>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={reset}>↺ Sıfırla</button>
      </header>

      <main className="b-grid">
        <section className="panel glass" ref={panelRef} aria-label="Hediye oluşturucu">
          <nav className="stepper" aria-label="Adımlar">
            <div className="stepper-track"><i style={{ width: `${progress}%` }} /></div>
            {STEPS.map((s, i) => (
              <button key={s.id} className={`step-dot ${step === i + 1 ? 'on' : ''} ${step > i + 1 ? 'done' : ''}`} onClick={() => go(i + 1)} aria-current={step === i + 1 ? 'step' : undefined} aria-label={`Adım ${i + 1}: ${s.title}`} title={s.title}>
                <span>{step > i + 1 ? '✓' : s.emoji}</span>
              </button>
            ))}
          </nav>

          <div className="step-head">
            <span className="step-count">Adım {step} / {STEPS.length}</span>
            <h2>{cur.emoji} {cur.title}</h2>
            <p>{cur.desc}</p>
          </div>

          <div className="step-body">
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div key={cur.id} initial={{ opacity: 0, x: 28 * dir }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -28 * dir }} transition={{ duration: 0.22 }}>
                <Step gift={gift} upd={upd} updIn={updIn} onTest={() => setTestOpen(true)} />
              </motion.div>
            </AnimatePresence>
          </div>

          <footer className="step-nav">
            <button className="btn btn-ghost" onClick={() => go(step - 1)} disabled={step === 1}>← Geri</button>
            {step < STEPS.length ? (
              <button className="btn btn-primary" onClick={() => go(step + 1)}>Devam →</button>
            ) : (
              <button className="btn btn-primary" onClick={() => setTestOpen(true)}>🎬 Test Et</button>
            )}
          </footer>
        </section>

        <aside className={`preview-col ${sheet ? 'open' : ''}`}>
          <button className="sheet-close" onClick={() => setSheet(false)} aria-label="Önizlemeyi kapat">✕</button>
          <Preview gift={gift} step={step} />
        </aside>
      </main>

      <button className="fab" onClick={() => setSheet(true)}>👁 Önizleme</button>
      {sheet && <div className="sheet-scrim" onClick={() => setSheet(false)} />}

      <AnimatePresence>
        {testOpen && (
          <motion.div className="test-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ErrorBoundary>
              <Experience gift={normalizeGift(gift)} testMode onExit={() => setTestOpen(false)} />
            </ErrorBoundary>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
