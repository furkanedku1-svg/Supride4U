import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import GiftBox from '../components/GiftBox'
import { sfx } from '../lib/audio'
import { formatDateTR, splitCountdown } from '../lib/media'

const pad = (n) => String(n).padStart(2, '0')

// Aşama 0: Zaman kilidi — zincirli kutu + canlı geri sayım
export default function LockScreen({ target, onUnlocked, testMode, onSkip, to }) {
  const [now, setNow] = useState(Date.now())
  const [wobbleKey, setWobbleKey] = useState(0)
  const [unlocking, setUnlocking] = useState(false)

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 250)
    return () => clearInterval(id)
  }, [])

  const left = target - now
  useEffect(() => {
    if (left <= 0 && !unlocking) {
      setUnlocking(true)
      sfx.unlock()
      setTimeout(onUnlocked, 1600)
    }
  }, [left, unlocking, onUnlocked])

  const t = splitCountdown(left)
  const units = [
    ['Gün', t.d],
    ['Saat', t.h],
    ['Dakika', t.m],
    ['Saniye', t.s],
  ]

  return (
    <motion.div className="stage stage-lock" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <GiftBox
        locked={!unlocking}
        wobbleKey={wobbleKey}
        onClick={() => {
          setWobbleKey((k) => k + 1)
          sfx.locked()
        }}
        className="box-lock"
        label="Kilitli hediye kutusu"
      />
      <div className="lock-info">
        <h2 className="stage-title">{unlocking ? 'Kilit açıldı! 🎉' : 'Sürprizi bozma! 🤫'}</h2>
        <p className="stage-sub">
          {to ? `${to}, ` : ''}Hediyen <strong>{formatDateTR(target)}</strong> tarihinde açılacak.
        </p>
        <div className="countdown" role="timer" aria-live="off">
          {units.map(([label, v]) => (
            <div className="cd-cell glass" key={label}>
              <motion.span key={v} className="cd-num" initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.25 }}>
                {pad(v)}
              </motion.span>
              <span className="cd-label">{label}</span>
            </div>
          ))}
        </div>
        <p className="stage-note">Kutuya dokunursan biraz sallanır ama açılmaz 😉</p>
        {testMode && (
          <button className="btn btn-ghost btn-sm" onClick={onSkip}>
            ⏭ Kilidi atla (test modu)
          </button>
        )}
      </div>
    </motion.div>
  )
}
