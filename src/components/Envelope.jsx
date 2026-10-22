import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

// Zarf: kapalı → kapak açılır → mektup yükselir. CSS 3D ile.
export default function Envelope({ open = false, rise = false, onClick, label = 'Mektup', className = '' }) {
  const [flapBehind, setFlapBehind] = useState(false)

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => setFlapBehind(true), 260)
      return () => clearTimeout(t)
    }
    setFlapBehind(false)
  }, [open])

  return (
    <div
      className={`envelope ${className}`}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={label}
      onClick={onClick}
      onKeyDown={(e) => onClick && (e.key === 'Enter' || e.key === ' ') && onClick()}
    >
      <div className="env-back" />
      <motion.div className="env-paper" animate={{ y: rise ? '-62%' : '0%' }} transition={{ duration: 0.7, ease: [0.3, 0.9, 0.4, 1] }}>
        <i /><i /><i /><i />
      </motion.div>
      <div className="env-front-left" />
      <div className="env-front-right" />
      <div className="env-front-bottom" />
      <motion.div
        className="env-flap"
        style={{ zIndex: flapBehind ? 1 : 5 }}
        initial={false}
        animate={{ rotateX: open ? 180 : 0 }}
        transition={{ duration: 0.55, ease: 'easeInOut' }}
      />
      {!open && <div className="env-seal" aria-hidden="true">❤</div>}
    </div>
  )
}
