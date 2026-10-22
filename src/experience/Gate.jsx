import { motion } from 'framer-motion'
import GiftBox from '../components/GiftBox'

// Açılış ekranı: ses izni / müzik başlatma uyarısı (kullanıcı etkileşimi autoplay için gerekli)
export default function Gate({ gift, onStart, hasMusic }) {
  const to = gift?.letter?.to?.trim() || ''
  return (
    <motion.div className="stage stage-gate" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.05 }}>
      <motion.div className="gate-box" animate={{ y: [0, -10, 0], rotate: [-2, 2, -2] }} transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}>
        <GiftBox className="box-gate" label="Hediye" />
      </motion.div>
      <motion.div className="gate-card glass" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
        <h1 className="gate-title">{to ? `${to}, sana bir sürprizim var!` : 'Sana özel bir sürpriz var!'}</h1>
        <p className="gate-sub">
          {gift?.from ? <>{gift.from} senin için küçük bir hediye hazırladı. </> : 'Biri senin için küçük bir hediye hazırladı. '}
          {hasMusic ? 'Hafif bir müzik eşlik edecek; sesi açmanı öneririm 🎧' : 'Hazır olduğunda başlayalım.'}
        </p>
        <div className="gate-actions">
          <button className="btn btn-primary btn-lg" onClick={() => onStart(true)}>
            {hasMusic ? '🔊 Müzikle başla' : '🎁 Başla'}
          </button>
          {hasMusic && (
            <button className="btn btn-ghost" onClick={() => onStart(false)}>
              🔇 Sessiz devam et
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
