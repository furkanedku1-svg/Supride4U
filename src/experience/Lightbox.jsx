import { useEffect } from 'react'
import { motion } from 'framer-motion'
import Polaroid from '../components/Polaroid'

// Polaroid büyütülmüş detay modu
export default function Lightbox({ photos, index, onClose, onIndex }) {
  const photo = photos[index]
  const prev = () => onIndex((index - 1 + photos.length) % photos.length)
  const next = () => onIndex((index + 1) % photos.length)

  useEffect(() => {
    const on = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', on)
    return () => window.removeEventListener('keydown', on)
  })

  if (!photo) return null
  const size = Math.min(window.innerWidth * 0.82, window.innerHeight * 0.62, 460)

  return (
    <motion.div className="lightbox" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div
        key={index}
        className="lightbox-card"
        initial={{ scale: 0.6, rotate: -8, opacity: 0 }}
        animate={{ scale: 1, rotate: -2, opacity: 1 }}
        exit={{ scale: 0.7, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 220, damping: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <Polaroid photo={photo} tape style={{ '--pw': `${size}px` }} />
      </motion.div>
      {photos.length > 1 && (
        <>
          <button className="lb-nav lb-prev" aria-label="Önceki fotoğraf" onClick={(e) => (e.stopPropagation(), prev())}>
            ‹
          </button>
          <button className="lb-nav lb-next" aria-label="Sonraki fotoğraf" onClick={(e) => (e.stopPropagation(), next())}>
            ›
          </button>
        </>
      )}
      <button className="lb-close" aria-label="Kapat" onClick={onClose}>
        ✕
      </button>
      <p className="lb-count">
        {index + 1} / {photos.length}
      </p>
    </motion.div>
  )
}
