import confetti from 'canvas-confetti'

const Z = 99999

export function burst(colors) {
  const base = { zIndex: Z, colors, disableForReducedMotion: true }
  confetti({ ...base, particleCount: 120, spread: 80, origin: { y: 0.62 }, startVelocity: 48 })
  setTimeout(() => confetti({ ...base, particleCount: 70, angle: 60, spread: 60, origin: { x: 0, y: 0.7 } }), 160)
  setTimeout(() => confetti({ ...base, particleCount: 70, angle: 120, spread: 60, origin: { x: 1, y: 0.7 } }), 160)
}

export function bigShow(colors, ms = 1800) {
  const end = Date.now() + ms
  const base = { zIndex: Z, colors, disableForReducedMotion: true }
  ;(function frame() {
    confetti({ ...base, particleCount: 4, angle: 60, spread: 55, origin: { x: 0, y: 0.8 } })
    confetti({ ...base, particleCount: 4, angle: 120, spread: 55, origin: { x: 1, y: 0.8 } })
    if (Date.now() < end) requestAnimationFrame(frame)
  })()
}

export function hearts() {
  try {
    const heart = confetti.shapeFromText({ text: '❤️', scalar: 2.2 })
    confetti({ zIndex: Z, shapes: [heart], scalar: 2.2, particleCount: 36, spread: 100, origin: { y: 0.6 }, startVelocity: 32, flat: true })
  } catch {
    confetti({ zIndex: Z, particleCount: 60, spread: 90, colors: ['#ff4d6d', '#ff8fa3', '#ffb3c1'] })
  }
}

export function sparkleAt(x, y, colors) {
  confetti({ zIndex: Z, particleCount: 24, spread: 70, startVelocity: 22, ticks: 70, origin: { x, y }, colors, scalar: 0.8 })
}
