import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Envelope from '../components/Envelope'
import ScratchCard from '../components/ScratchCard'
import { sfx } from '../lib/audio'
import { hearts } from '../lib/effects'

// Zarf büyür → kapak açılır → mektup yükselir → katlı kağıt açılıp okunur (kazı alanı varsa kazınır).
export default function LetterModal({ letter, onClose }) {
  const [phase, setPhase] = useState(0) // 0 kapalı, 1 kapak açık, 2 yükseldi, 3 okuma
  const secret = letter.secretOn && letter.secret?.trim()

  useEffect(() => {
    const ts = [
      setTimeout(() => (setPhase(1), sfx.paper()), 350),
      setTimeout(() => setPhase(2), 1000),
      setTimeout(() => (setPhase(3), sfx.paper()), 1800),
    ]
    return () => ts.forEach(clearTimeout)
  }, [])

  useEffect(() => {
    const on = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', on)
    return () => window.removeEventListener('keydown', on)
  }, [onClose])

  return (
    <motion.div className="letter-modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={phase === 3 ? onClose : undefined}>
      {phase < 3 && (
        <motion.div initial={{ scale: 0.5, y: 60, opacity: 0 }} animate={{ scale: 1.25, y: 0, opacity: 1 }} exit={{ opacity: 0, scale: 1.4 }} transition={{ type: 'spring', stiffness: 140, damping: 16 }}>
          <Envelope open={phase >= 1} rise={phase >= 2} className="env-modal" />
        </motion.div>
      )}

      {phase === 3 && (
        <motion.article
          className="paper"
          initial={{ rotateX: -85, opacity: 0, y: 40, scaleY: 0.4 }}
          animate={{ rotateX: 0, opacity: 1, y: 0, scaleY: 1 }}
          transition={{ type: 'spring', stiffness: 90, damping: 15 }}
          style={{ transformPerspective: 1400, transformOrigin: 'top center' }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="paper-fold" aria-hidden="true" />
          {letter.to && <p className="paper-to">{letter.to},</p>}
          {letter.title && <h2 className="paper-title">{letter.title}</h2>}
          <div className="paper-body">{letter.body || 'Seni çok seviyorum ❤️'}</div>

          {secret && (
            <motion.div className="paper-secret" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              <p className="secret-label">🤫 Gizli not — kazıyarak oku</p>
              <ScratchCard onReveal={() => (hearts(), sfx.sparkle())}>
                <div className="secret-text">{letter.secret}</div>
              </ScratchCard>
            </motion.div>
          )}

          {letter.sign && <p className="paper-sign">{letter.sign}</p>}
          <button className="btn btn-primary paper-close" onClick={onClose}>
            Mektubu kapat
          </button>
        </motion.article>
      )}
    </motion.div>
  )
}
