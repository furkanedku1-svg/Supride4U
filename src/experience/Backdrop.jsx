import { useMemo } from 'react'

const SHAPES = ['✦', '❤', '✿', '✧', '●', '❀']

// Tema renklerine uyumlu, yavaşça süzülen parçacıklar
export default function Backdrop() {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640
  const count = isMobile ? 8 : 16

  const items = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        s: SHAPES[i % SHAPES.length],
        left: (i * (100 / count) + 4) % 94,
        size: 13 + ((i * 7) % 18),
        dur: 15 + ((i * 5) % 12),
        delay: -((i * 3) % 15),
        drift: ((i * 37) % 50) - 25,
      })),
    [count],
  )
  return (
    <div className="backdrop" aria-hidden="true">
      <div className="backdrop-glow g1" />
      <div className="backdrop-glow g2" />
      {items.map((it, i) => (
        <span
          key={i}
          className="floater"
          style={{ left: `${it.left}%`, fontSize: it.size, animationDuration: `${it.dur}s`, animationDelay: `${it.delay}s`, '--drift': `${it.drift}px` }}
        >
          {it.s}
        </span>
      ))}
    </div>
  )
}
