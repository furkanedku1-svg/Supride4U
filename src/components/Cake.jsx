import { motion } from 'framer-motion'

const CANDLE_COLORS = [
  ['#ff9bb5', '#ffffff'],
  ['#8fd0ff', '#ffffff'],
  ['#ffe08a', '#ffffff'],
  ['#b8e6b0', '#ffffff'],
  ['#d1b3ff', '#ffffff'],
]
const SPRINKLES = ['#ff6b9a', '#6bc5ff', '#ffd23f', '#7be0a6', '#b794ff', '#ff9a56']

// Deterministik "rastgele" — her render'da aynı damla/şeker deseni
const rnd = (i, s = 1) => {
  const x = Math.sin(i * 12.9898 * s) * 43758.5453
  return x - Math.floor(x)
}

function Flame({ x, y, scale = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <g className="flame-lean">
        <g className="flame-flick">
          <circle cx="0" cy="-12" r="16" fill="#ffb347" opacity=".35" style={{ filter: 'blur(5px)' }} />
          <path d="M0 0 C-7 -8 -6 -18 0 -27 C6 -18 7 -8 0 0Z" fill="#ff9d2e" />
          <path d="M0 -1 C-4 -7 -3.5 -13 0 -19 C3.5 -13 4 -7 0 -1Z" fill="#ffe27a" />
          <path d="M0 -1 C-2 -4 -1.6 -7 0 -10 C1.6 -7 2 -4 0 -1Z" fill="#fff8e0" />
        </g>
      </g>
    </g>
  )
}

function Smoke({ x, y }) {
  return (
    <g>
      {[0, 1, 2].map((k) => (
        <motion.circle
          key={k}
          cx={x}
          cy={y}
          r={3}
          fill="#e8e8ee"
          initial={{ opacity: 0.6, cy: y, cx: x, r: 3 }}
          animate={{ opacity: 0, cy: y - 60 - k * 12, cx: x + (k - 1) * 10, r: 10 + k * 3 }}
          transition={{ duration: 1.8 + k * 0.3, delay: k * 0.15, ease: 'easeOut' }}
          style={{ filter: 'blur(2px)' }}
        />
      ))}
    </g>
  )
}

export function buildCandles(age) {
  const n = Math.max(1, Math.min(120, Math.round(Number(age) || 1)))
  if (n <= 10) {
    const gap = n === 1 ? 0 : Math.min(20, 110 / (n - 1))
    const start = 150 - (gap * (n - 1)) / 2
    return Array.from({ length: n }).map((_, i) => ({ x: start + gap * i, digit: null, w: n > 7 ? 6 : 8, h: 34 }))
  }
  const digits = String(n).split('')
  const gap = 38
  const start = 150 - (gap * (digits.length - 1)) / 2
  return digits.map((d, i) => ({ x: start + gap * i, digit: d, w: 28, h: 50 }))
}

export default function Cake({ age = 25, lit, onCandleTap, className = '' }) {
  const candles = buildCandles(age)
  const isLit = (i) => (lit ? lit[i] : true)
  return (
    <svg viewBox="0 0 300 270" className={`cake ${className}`} style={{ overflow: 'visible' }} aria-label="Doğum günü pastası">
      <defs>
        <linearGradient id="sponge" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffeed6" />
          <stop offset="1" stopColor="#f4cf9c" />
        </linearGradient>
        <linearGradient id="plate" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#e5e7ef" />
        </linearGradient>
      </defs>

      {/* tabak */}
      <ellipse cx="150" cy="238" rx="144" ry="20" fill="#000" opacity=".12" style={{ filter: 'blur(5px)' }} />
      <ellipse cx="150" cy="230" rx="140" ry="19" fill="url(#plate)" />
      <ellipse cx="150" cy="226" rx="118" ry="13" fill="#fff" opacity=".7" />

      {/* alt kat */}
      <rect x="42" y="148" width="216" height="80" rx="16" fill="url(#sponge)" />
      <path d="M42 190 H258" stroke="#e7b97e" strokeWidth="3" opacity=".55" />
      <path d="M42 192 H258" stroke="#fff" strokeWidth="3" opacity=".4" />
      {Array.from({ length: 26 }).map((_, i) => (
        <rect
          key={i}
          x={54 + rnd(i) * 190}
          y={196 + rnd(i, 2) * 24}
          width="8"
          height="3"
          rx="1.5"
          fill={SPRINKLES[i % SPRINKLES.length]}
          transform={`rotate(${rnd(i, 3) * 180} ${54 + rnd(i) * 190} ${196 + rnd(i, 2) * 24})`}
        />
      ))}
      {/* alt kat kreması */}
      <rect x="40" y="144" width="220" height="24" rx="12" style={{ fill: 'var(--box-light)' }} />
      {Array.from({ length: 9 }).map((_, i) => (
        <rect key={i} x={50 + i * 24.5} y="150" width="15" height={18 + rnd(i, 4) * 26} rx="7.5" style={{ fill: 'var(--box-light)' }} />
      ))}
      <rect x="40" y="144" width="220" height="9" rx="4.5" fill="#fff" opacity=".35" />

      {/* üst kat */}
      <rect x="82" y="98" width="136" height="54" rx="14" fill="url(#sponge)" />
      <rect x="80" y="94" width="140" height="22" rx="11" style={{ fill: 'var(--accent-soft)' }} />
      {Array.from({ length: 6 }).map((_, i) => (
        <rect key={i} x={88 + i * 22} y="102" width="14" height={14 + rnd(i, 7) * 22} rx="7" style={{ fill: 'var(--accent-soft)' }} />
      ))}
      <rect x="80" y="94" width="140" height="8" rx="4" fill="#fff" opacity=".55" />

      {/* çilekler / kirazlar */}
      {[62, 238].map((x) => (
        <g key={x}>
          <circle cx={x} cy="144" r="10" style={{ fill: 'var(--accent)' }} />
          <circle cx={x - 3} cy="141" r="3" fill="#fff" opacity=".55" />
          <path d={`M${x} 135 q6 -14 14 -16`} stroke="#4f9d69" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        </g>
      ))}

      {/* mumlar */}
      {candles.map((c, i) => {
        const [c1, c2] = CANDLE_COLORS[i % CANDLE_COLORS.length]
        const top = 104 - c.h
        const lit_ = isLit(i)
        return (
          <g key={i} onClick={() => onCandleTap?.(i)} style={{ cursor: lit_ && onCandleTap ? 'pointer' : 'default' }}>
            {/* tıklama alanını büyüt */}
            <rect x={c.x - c.w / 2 - 6} y={top - 34} width={c.w + 12} height={c.h + 40} fill="transparent" />
            <rect x={c.x - c.w / 2} y={top} width={c.w} height={c.h} rx={c.digit ? 8 : 3} fill={c1} />
            {!c.digit &&
              [0, 1, 2, 3].map((k) => (
                <path key={k} d={`M${c.x - c.w / 2} ${top + 5 + k * 8} l${c.w} -4`} stroke={c2} strokeWidth="2.6" opacity=".85" />
              ))}
            {c.digit && (
              <text x={c.x} y={top + c.h / 2 + 11} textAnchor="middle" fontSize="34" fontWeight="700" fontFamily="Outfit, sans-serif" fill="#fff" stroke={c1} strokeWidth="1" opacity=".95">
                {c.digit}
              </text>
            )}
            <path d={`M${c.x} ${top} v-5`} stroke="#4a3b35" strokeWidth="1.8" strokeLinecap="round" />
            {lit_ ? <Flame x={c.x} y={top - 5} scale={c.digit ? 1.15 : 1} /> : <Smoke x={c.x} y={top - 8} />}
          </g>
        )
      })}
    </svg>
  )
}
