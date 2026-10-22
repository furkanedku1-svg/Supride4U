// Mobil cihazlarda sarsma / sallama (shake detection) yöneticisi
// Web DeviceMotionEvent API + iOS 13+ permission flow + haptic vibration

export function isTouchOrMobile() {
  if (typeof window === 'undefined') return false
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent || '')
  )
}

export function hasMotionSupport() {
  try {
    return typeof window !== 'undefined' && typeof window.DeviceMotionEvent !== 'undefined'
  } catch {
    return false
  }
}

export function requiresMotionPermission() {
  try {
    return (
      typeof window !== 'undefined' &&
      typeof window.DeviceMotionEvent !== 'undefined' &&
      typeof window.DeviceMotionEvent.requestPermission === 'function'
    )
  } catch {
    return false
  }
}

export function triggerVibration(pattern = [100, 50, 100]) {
  if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
    try {
      navigator.vibrate(pattern)
    } catch {
      /* yoksay */
    }
  }
}

/**
 * Sallama dinleyicisini başlatır.
 * @param {Function} onShake - Her sallamada çağrılacak callback
 * @param {Object} options - { threshold: number, debounce: number }
 * @returns {Function} cleanup - Dinleyiciyi kapatır
 */
export function listenShake(onShake, options = {}) {
  try {
    if (!hasMotionSupport()) return () => {}

    const threshold = options.threshold || 15
    const debounce = options.debounce || 400

    let lastX = null
    let lastY = null
    let lastZ = null
    let lastShakeTime = 0

    const handleMotion = (event) => {
      try {
        const acc = event.accelerationIncludingGravity || event.acceleration
        if (!acc) return

        const { x, y, z } = acc
        if (x === null || y === null || z === null) return

        if (lastX === null) {
          lastX = x
          lastY = y
          lastZ = z
          return
        }

        const deltaX = Math.abs(x - lastX)
        const deltaY = Math.abs(y - lastY)
        const deltaZ = Math.abs(z - lastZ)
        const totalDelta = deltaX + deltaY + deltaZ

        lastX = x
        lastY = y
        lastZ = z

        if (totalDelta > threshold) {
          const now = Date.now()
          if (now - lastShakeTime > debounce) {
            lastShakeTime = now
            triggerVibration([100, 50, 100])
            onShake(totalDelta)
          }
        }
      } catch {
        /* yoksay */
      }
    }

    window.addEventListener('devicemotion', handleMotion, false)

    return () => {
      try {
        window.removeEventListener('devicemotion', handleMotion, false)
      } catch {
        /* yoksay */
      }
    }
  } catch {
    return () => {}
  }
}

/**
 * iOS 13+ Safari için DeviceMotionEvent izni ister
 */
export async function requestMotionPermission() {
  try {
    if (!requiresMotionPermission()) return 'granted'
    const res = await window.DeviceMotionEvent.requestPermission()
    return res // 'granted' | 'denied'
  } catch {
    return 'denied'
  }
}
