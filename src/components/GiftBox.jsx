import { useEffect, useId } from 'react'
import { motion, useAnimationControls } from 'framer-motion'

// Katmanlı / sahte-3D hediye kutusu. Renkler CSS değişkenlerinden (tema) gelir.
// progress: 0..2 (kurdele gevşeme seviyesi) · open: kapak fırlar · locked: zincir + asma kilit

const fillVar = (v) => ({ fill: `var(${v})` })

function Chain({ x1, y1, x2, y2 }) {
  const nx1 = Number(x1) || 0
  const ny1 = Number(y1) || 0
  const nx2 = Number(x2) || 0
  const ny2 = Number(y2) || 0
  const n = 8
  const ang = (Math.atan2(ny2 - ny1, nx2 - nx1) * 180) / Math.PI
  return (
    <g>
      {Array.from({ length: n }).map((_, i) => {
        const t = (i + 0.5) / n
        const x = (nx1 + (nx2 - nx1) * t).toFixed(2)
        const y = (ny1 + (ny2 - ny1) * t).toFixed(2)
        const flat = i % 2 === 0
        return (
          <g key={i} transform={`translate(${x}, ${y}) rotate(${ang.toFixed(2)})`}>
            <rect x={flat ? -13 : -8} y={flat ? -7 : -4.5} width={flat ? 26 : 16} height={flat ? 14 : 9} rx="5" fill="none" stroke="#2c2f3a" strokeWidth="6.5" />
            <rect x={flat ? -13 : -8} y={flat ? -7 : -4.5} width={flat ? 26 : 16} height={flat ? 14 : 9} rx="5" fill="none" stroke="#b9bfce" strokeWidth="4" />
            <rect x={flat ? -11 : -6} y={flat ? -6 : -3.5} width={flat ? 18 : 9} height="2" rx="1" fill="#fff" opacity=".7" />
          </g>
        )
      })}
    </g>
  )
}

export default function GiftBox({
  progress = 0,
  open = false,
  hidden = false,
  locked = false,
  wobbleKey = 0,
  onClick,
  className = '',
  label = 'Hediye kutusu',
}) {
  const uid = useId().replace(/:/g, '')
  const wobble = useAnimationControls()

  useEffect(() => {
    if (!wobbleKey) return
    if (locked) wobble.start({ x: [0, -8, 8, -6, 6, -2, 0], transition: { duration: 0.5 } })
    else wobble.start({ rotate: [0, -7, 6, -4, 3, 0], scaleY: [1, 0.95, 1.03, 0.99, 1], transition: { duration: 0.55 } })
  }, [wobbleKey, locked, wobble])

  const loose = Math.min(progress, 2)
  const bowFall = open

  return (
    <motion.div
      className={`giftbox ${className}`}
      animate={hidden ? { opacity: 0, y: 70, scale: 0.85 } : { opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
      style={{ pointerEvents: hidden ? 'none' : 'auto' }}
    >
      <motion.svg
        viewBox="0 0 300 300"
        role="button"
        aria-label={label}
        tabIndex={0}
        onClick={onClick}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick?.()}
        animate={wobble}
        style={{ overflow: 'visible', cursor: onClick ? 'pointer' : 'default', originX: '50%', originY: '90%', touchAction: 'manipulation' }}
      >
        <defs>
          <linearGradient id={`front${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" style={{ stopColor: 'var(--box)' }} />
            <stop offset="1" style={{ stopColor: 'var(--box-dark)' }} />
          </linearGradient>
          <linearGradient id={`lid${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" style={{ stopColor: 'var(--box-light)' }} />
            <stop offset="1" style={{ stopColor: 'var(--box)' }} />
          </linearGradient>
          <linearGradient id={`rib${uid}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" style={{ stopColor: 'var(--ribbon-dark)' }} />
            <stop offset=".35" style={{ stopColor: 'var(--ribbon)' }} />
            <stop offset=".7" style={{ stopColor: 'var(--ribbon)' }} />
            <stop offset="1" style={{ stopColor: 'var(--ribbon-dark)' }} />
          </linearGradient>
          <linearGradient id={`side${uid}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#000" stopOpacity=".18" />
            <stop offset="1" stopColor="#000" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={`inner${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#000" stopOpacity=".55" />
            <stop offset="1" stopColor="#000" stopOpacity=".15" />
          </linearGradient>
          <radialGradient id={`glow${uid}`}>
            <stop offset="0" stopColor="#fff" stopOpacity=".95" />
            <stop offset=".4" style={{ stopColor: 'var(--accent-soft)' }} stopOpacity=".7" />
            <stop offset="1" style={{ stopColor: 'var(--accent-soft)' }} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* zemin gölgesi */}
        <ellipse cx="150" cy="276" rx="108" ry="11" style={{ fill: 'rgba(var(--shadow-rgb),.28)', filter: 'blur(5px)' }} />

        {/* iç taraf (kapak açılınca görünür) */}
        <polygon points="62,150 238,150 222,130 78,130" style={fillVar('--box-dark')} />
        <polygon points="62,150 238,150 222,130 78,130" fill={`url(#inner${uid})`} />

        {/* ışık huzmesi */}
        <motion.ellipse
          cx="150"
          cy="130"
          rx="95"
          ry="60"
          fill={`url(#glow${uid})`}
          initial={{ opacity: 0 }}
          animate={open ? { opacity: [0, 1, 0.6], ry: [20, 90, 70] } : { opacity: 0 }}
          transition={{ duration: 1.2, delay: 0.1 }}
        />

        {/* gövde */}
        <rect x="62" y="150" width="176" height="120" rx="7" fill={`url(#front${uid})`} />
        <rect x="62" y="150" width="60" height="120" rx="7" fill={`url(#side${uid})`} />
        <rect x="62" y="150" width="176" height="6" fill="#000" opacity=".12" />
        {/* gövde kurdelesi */}
        <motion.g
          animate={open ? { opacity: 0, y: 24 } : { opacity: 1, y: 0, skewX: loose * 1.5 }}
          transition={{ duration: 0.45, delay: open ? 0.05 : 0 }}
        >
          <rect x="138" y="150" width="24" height="120" fill={`url(#rib${uid})`} />
          <rect x="138" y="262" width="24" height="8" fill="#000" opacity=".07" />
        </motion.g>

        {/* kapak */}
        <motion.g
          animate={open ? { y: -240, x: 70, rotate: -22, opacity: [1, 1, 0] } : { y: 0, x: 0, rotate: 0, opacity: 1 }}
          transition={open ? { duration: 1.1, delay: 0.2, ease: [0.2, 0.9, 0.35, 1] } : { duration: 0.3 }}
          style={{ originX: '50%', originY: '60%' }}
        >
          <rect x="52" y="118" width="196" height="40" rx="7" fill={`url(#lid${uid})`} />
          <polygon points="52,118 248,118 230,96 70,96" style={fillVar('--box-light')} />
          <polygon points="52,118 248,118 230,96 70,96" fill="#fff" opacity=".18" />
          <rect x="52" y="150" width="196" height="8" rx="3" fill="#000" opacity=".15" />
          <rect x="138" y="118" width="24" height="40" fill={`url(#rib${uid})`} />
          <polygon points="138,118 162,118 160,96 140,96" style={fillVar('--ribbon')} />
        </motion.g>

        {/* fiyonk */}
        <motion.g
          animate={bowFall ? { y: 70, rotate: 35, opacity: 0, scale: 0.8 } : { y: loose * 5, rotate: 0, opacity: 1, scale: 1 - loose * 0.04 }}
          transition={{ duration: bowFall ? 0.55 : 0.4, ease: 'easeOut' }}
        >
          <motion.g animate={{ rotate: -loose * 9, y: loose * 3 }} style={{ originX: 1, originY: 1 }}>
            <path d="M150 98 C108 44 70 74 108 100 C126 110 142 104 150 98Z" style={fillVar('--ribbon')} />
            <path d="M146 98 C118 62 94 78 116 98 C128 104 138 102 146 98Z" style={fillVar('--ribbon-dark')} opacity=".7" />
          </motion.g>
          <motion.g animate={{ rotate: loose * 9, y: loose * 3 }} style={{ originX: 0, originY: 1 }}>
            <path d="M150 98 C192 44 230 74 192 100 C174 110 158 104 150 98Z" style={fillVar('--ribbon')} />
            <path d="M154 98 C182 62 206 78 184 98 C172 104 162 102 154 98Z" style={fillVar('--ribbon-dark')} opacity=".7" />
          </motion.g>
          <motion.path
            d="M146 104 C138 128 126 142 108 156 L120 162 C136 150 146 130 150 108Z"
            style={fillVar('--ribbon-dark')}
            animate={{ rotate: loose * 8 }}
            transition={{ duration: 0.4 }}
          />
          <motion.path
            d="M154 104 C162 128 174 142 192 156 L180 162 C164 150 154 130 150 108Z"
            style={fillVar('--ribbon')}
            animate={{ rotate: -loose * 8 }}
            transition={{ duration: 0.4 }}
          />
          <ellipse cx="150" cy="100" rx="13" ry="11" style={fillVar('--ribbon')} />
          <ellipse cx="150" cy="100" rx="13" ry="11" fill="none" stroke="#000" strokeOpacity=".1" strokeWidth="2" />
        </motion.g>

        {/* zincir & kilit */}
        {locked && (
          <g>
            <Chain x1="56" y1="112" x2="244" y2="264" />
            <Chain x1="244" y1="112" x2="56" y2="264" />
            <g transform="translate(150 188)">
              <path d="M-14 -14 V-24 a14 14 0 0 1 28 0 V-14" fill="none" stroke="#8d93a6" strokeWidth="7" strokeLinecap="round" />
              <rect x="-24" y="-16" width="48" height="38" rx="8" fill="#f2c14e" stroke="#b8892a" strokeWidth="3" />
              <rect x="-24" y="-16" width="48" height="12" rx="6" fill="#fff" opacity=".35" />
              <circle cx="0" cy="0" r="5.5" fill="#6b4a12" />
              <rect x="-2.2" y="2" width="4.4" height="10" rx="2" fill="#6b4a12" />
            </g>
          </g>
        )}
      </motion.svg>
    </motion.div>
  )
}
