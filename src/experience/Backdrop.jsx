import { useMemo } from 'react'

const SHAPES = ['✦', '❤', '✿', '✧', '●', '❀']

// Tema renklerine uyumlu, yavaşça süzülen parçacıklar
export default function Backdrop() {
  const items = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        s: SHAPES[i % SHAPES.length],
        left: (i * 53) % 100,
        size: 12 + ((i * 7) % 20),
        dur: 14 + ((i * 5) % 14),
        delay: -((i * 3) % 20),
        drift: ((i * 37) % 60) - 30,
      })),
    [],
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
