import { useEffect, useState } from 'react'

// Mikrofon "üfleme" algılayıcı — Web Audio API (AudioContext + AnalyserNode).
// onLevel(0..1) her karede çağrılır: 0 = sessiz, 1 = güçlü üfleme.
// Ortam gürültüsü ilk ~0.8 sn içinde ölçülüp eşik uyarlanır; üfleme düşük frekanslı geniş bantlı gürültü olduğundan
// konuşmadan ayırt etmek için düşük bant enerjisi oranı da hesaba katılır.
export function startBlowDetector(onLevel) {
  let stopped = false
  let stream, ac, src, an, raf

  const ready = (async () => {
    stream = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
    })
    if (stopped) {
      stream.getTracks().forEach((t) => t.stop())
      return
    }
    const AC = window.AudioContext || window.webkitAudioContext
    ac = new AC()
    if (ac.state === 'suspended') await ac.resume()
    if (stopped) {
      stream.getTracks().forEach((t) => t.stop())
      ac.close()
      return
    }
    src = ac.createMediaStreamSource(stream)
    an = ac.createAnalyser()
    an.fftSize = 1024
    an.smoothingTimeConstant = 0.3
    src.connect(an)
    const td = new Uint8Array(an.fftSize)
    const fd = new Uint8Array(an.frequencyBinCount)
    const binHz = ac.sampleRate / an.fftSize
    const lowBins = Math.floor(1200 / binHz)
    const t0 = performance.now()
    const calib = []
    let baseline = 0.01
    let smooth = 0

    const loop = () => {
      if (stopped) return
      an.getByteTimeDomainData(td)
      let sum = 0
      for (let i = 0; i < td.length; i++) {
        const v = (td[i] - 128) / 128
        sum += v * v
      }
      const rms = Math.sqrt(sum / td.length)

      an.getByteFrequencyData(fd)
      let low = 0
      let all = 0
      for (let i = 1; i < fd.length; i++) {
        all += fd[i]
        if (i <= lowBins) low += fd[i]
      }
      const lowRatio = all > 0 ? low / all : 0

      const elapsed = performance.now() - t0
      if (elapsed < 800) {
        calib.push(rms)
        baseline = calib.reduce((a, b) => a + b, 0) / calib.length
        onLevel(0)
      } else {
        const thr = Math.max(0.05, baseline * 2.2 + 0.03)
        // düşük frekans ağırlıklı geniş bantlı sinyal → üfleme olasılığı artar
        const weight = lowRatio > 0.35 ? 1 : 0.55
        const raw = Math.max(0, (rms - thr) / 0.22) * weight
        smooth = smooth * 0.6 + Math.min(1, raw) * 0.4
        onLevel(smooth)
      }
      raf = requestAnimationFrame(loop)
    }
    loop()
  })()

  return {
    ready,
    stop() {
      stopped = true
      cancelAnimationFrame(raf)
      try {
        src?.disconnect()
        stream?.getTracks().forEach((t) => t.stop())
        ac?.close()
      } catch {
        /* yoksay */
      }
    },
  }
}

// Pencere boyutunu izleyen küçük hook
export function useViewport() {
  const [vp, setVp] = useState({ w: window.innerWidth, h: window.innerHeight })
  useEffect(() => {
    const on = () => setVp({ w: window.innerWidth, h: window.innerHeight })
    window.addEventListener('resize', on)
    window.addEventListener('orientationchange', on)
    return () => {
      window.removeEventListener('resize', on)
      window.removeEventListener('orientationchange', on)
    }
  }, [])
  return vp
}
