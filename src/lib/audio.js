// Web Audio tabanlı ses motoru: ortak AudioContext, ana ses kontrolü ve sentezlenen ses efektleri.
// Hiçbir ses dosyası gerektirmez; telif / yükleme sorunu yoktur.

let ctx = null
let master = null
let sfxBus = null
let musicBus = null
let muted = false
const muteListeners = new Set()

export function getCtx() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext
    ctx = new AC()
    master = ctx.createGain()
    master.gain.value = muted ? 0 : 1
    master.connect(ctx.destination)
    sfxBus = ctx.createGain()
    sfxBus.gain.value = 0.9
    sfxBus.connect(master)
    musicBus = ctx.createGain()
    musicBus.gain.value = 0.55
    musicBus.connect(master)
  }
  return ctx
}

export const getMusicBus = () => {
  getCtx()
  return musicBus
}

// Kullanıcı etkileşimi içinde çağrılmalı (autoplay politikası).
export async function unlockAudio() {
  const ac = getCtx()
  if (ac.state === 'suspended') {
    try {
      await ac.resume()
    } catch {
      /* yoksay */
    }
  }
  return ac
}

export function isMuted() {
  return muted
}

export function setMuted(m) {
  muted = m
  if (master) master.gain.setTargetAtTime(m ? 0 : 1, ctx.currentTime, 0.05)
  muteListeners.forEach((fn) => fn(m))
}

export function onMuteChange(fn) {
  muteListeners.add(fn)
  return () => muteListeners.delete(fn)
}

let _noise = null
export function noiseBuffer() {
  const ac = getCtx()
  if (!_noise) {
    _noise = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate)
    const d = _noise.getChannelData(0)
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
  }
  return _noise
}

function env(g, t, peak, attack, dur) {
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(Math.max(peak, 0.0002), t + attack)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
}

function noiseBurst({ t, dur = 0.1, gain = 0.3, type = 'bandpass', f = 2500, q = 1, f2 = null }) {
  const ac = getCtx()
  const src = ac.createBufferSource()
  src.buffer = noiseBuffer()
  src.loop = true
  const flt = ac.createBiquadFilter()
  flt.type = type
  flt.frequency.setValueAtTime(f, t)
  if (f2) flt.frequency.exponentialRampToValueAtTime(f2, t + dur)
  flt.Q.value = q
  const g = ac.createGain()
  env(g, t, gain, Math.min(0.01, dur / 3), dur)
  src.connect(flt).connect(g).connect(sfxBus)
  src.start(t, Math.random())
  src.stop(t + dur + 0.05)
}

function blip({ t, f = 440, f2 = null, dur = 0.15, type = 'sine', gain = 0.2 }) {
  const ac = getCtx()
  const o = ac.createOscillator()
  o.type = type
  o.frequency.setValueAtTime(f, t)
  if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + dur)
  const g = ac.createGain()
  env(g, t, gain, 0.005, dur)
  o.connect(g).connect(sfxBus)
  o.start(t)
  o.stop(t + dur + 0.05)
}

const guard = (fn) => (...a) => {
  try {
    if (!ctx || ctx.state === 'closed') getCtx()
    fn(...a)
  } catch {
    /* ses desteklenmiyorsa sessizce devam et */
  }
}

export const sfx = {
  // Pakete her tıklamada: hafif tıkırtı + kağıt hışırtısı
  tick: guard(() => {
    const t = getCtx().currentTime
    blip({ t, f: 220, f2: 90, dur: 0.09, type: 'square', gain: 0.12 })
    noiseBurst({ t, dur: 0.06, gain: 0.25, type: 'highpass', f: 3500 })
  }),
  rustle: guard(() => {
    const t = getCtx().currentTime
    for (let i = 0; i < 6; i++) {
      noiseBurst({ t: t + i * 0.055 + Math.random() * 0.03, dur: 0.07, gain: 0.12 + Math.random() * 0.1, f: 3000 + Math.random() * 3000, q: 0.8 })
    }
  }),
  // Son tık: kapak fırlar, parıltılı arpej
  pop: guard(() => {
    const t = getCtx().currentTime
    blip({ t, f: 500, f2: 60, dur: 0.22, gain: 0.35 })
    noiseBurst({ t, dur: 0.25, gain: 0.3, type: 'highpass', f: 1800 })
    ;[784, 988, 1175, 1568, 1976].forEach((f, i) => blip({ t: t + 0.12 + i * 0.07, f, dur: 0.5, type: 'triangle', gain: 0.1 }))
  }),
  whoosh: guard(() => {
    const t = getCtx().currentTime
    noiseBurst({ t, dur: 0.6, gain: 0.35, f: 500, f2: 2200, q: 0.9 })
  }),
  // Mum söndü: kısa üfleme + yumuşak "puf"
  puff: guard(() => {
    const t = getCtx().currentTime
    noiseBurst({ t, dur: 0.22, gain: 0.22, type: 'lowpass', f: 1400, f2: 300 })
  }),
  chime: guard(() => {
    const t = getCtx().currentTime
    ;[659, 880, 1319].forEach((f, i) => blip({ t: t + i * 0.09, f, dur: 1.2, gain: 0.12 }))
  }),
  paper: guard(() => {
    const t = getCtx().currentTime
    noiseBurst({ t, dur: 0.35, gain: 0.2, f: 1800, f2: 5200, q: 0.6 })
    noiseBurst({ t: t + 0.2, dur: 0.25, gain: 0.14, f: 4200, f2: 2200, q: 0.6 })
  }),
  locked: guard(() => {
    const t = getCtx().currentTime
    blip({ t, f: 130, dur: 0.14, type: 'sawtooth', gain: 0.15 })
    blip({ t: t + 0.16, f: 105, dur: 0.2, type: 'sawtooth', gain: 0.15 })
  }),
  unlock: guard(() => {
    const t = getCtx().currentTime
    blip({ t, f: 300, f2: 120, dur: 0.08, type: 'square', gain: 0.14 })
    blip({ t: t + 0.12, f: 400, f2: 150, dur: 0.1, type: 'square', gain: 0.14 })
    ;[523, 659, 784, 1047].forEach((f, i) => blip({ t: t + 0.3 + i * 0.1, f, dur: 0.9, type: 'triangle', gain: 0.12 }))
  }),
  sparkle: guard(() => {
    const t = getCtx().currentTime
    for (let i = 0; i < 5; i++) blip({ t: t + i * 0.05, f: 1500 + Math.random() * 1800, dur: 0.25, gain: 0.06 })
  }),
  squeak: guard(() => {
    const t = getCtx().currentTime
    blip({ t, f: 580, f2: 880, dur: 0.12, type: 'sine', gain: 0.15 })
    blip({ t: t + 0.1, f: 920, f2: 640, dur: 0.14, type: 'sine', gain: 0.12 })
  }),
}
