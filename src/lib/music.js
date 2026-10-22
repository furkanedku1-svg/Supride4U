// Üretken (generative) arka plan müzikleri — tamamen Web Audio ile sentezlenir.
import { getCtx, getMusicBus, noiseBuffer, unlockAudio } from './audio'

const hz = (m) => 440 * Math.pow(2, (m - 69) / 12)
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]

function tone(ac, out, { f, t, dur = 1, type = 'sine', g = 0.15, a = 0.01, lp = null, detune = 0 }) {
  const o = ac.createOscillator()
  o.type = type
  o.frequency.value = f
  o.detune.value = detune
  const gn = ac.createGain()
  gn.gain.setValueAtTime(0.0001, t)
  gn.gain.exponentialRampToValueAtTime(Math.max(g, 0.0002), t + a)
  gn.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  let node = o
  if (lp) {
    const flt = ac.createBiquadFilter()
    flt.type = 'lowpass'
    flt.frequency.value = lp
    o.connect(flt)
    node = flt
  }
  node.connect(gn).connect(out)
  o.start(t)
  o.stop(t + dur + 0.05)
}

function noise(ac, out, { t, dur = 0.08, g = 0.1, type = 'highpass', f = 6000, q = 0.7 }) {
  const s = ac.createBufferSource()
  s.buffer = noiseBuffer()
  const flt = ac.createBiquadFilter()
  flt.type = type
  flt.frequency.value = f
  flt.Q.value = q
  const gn = ac.createGain()
  gn.gain.setValueAtTime(g, t)
  gn.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  s.connect(flt).connect(gn).connect(out)
  s.start(t, Math.random() * 1.5)
  s.stop(t + dur + 0.05)
}

// Rhodes benzeri tuş sesi
function rhodes(ac, out, f, t, dur, g = 0.07) {
  tone(ac, out, { f, t, dur, type: 'sine', g, a: 0.012, detune: -3 })
  tone(ac, out, { f: f * 2, t, dur: dur * 0.4, type: 'sine', g: g * 0.35, a: 0.005 })
  tone(ac, out, { f, t, dur: dur * 0.8, type: 'triangle', g: g * 0.4, a: 0.02, lp: 1600, detune: 4 })
}

// Piyano benzeri
function piano(ac, out, f, t, dur, g = 0.09) {
  tone(ac, out, { f, t, dur, type: 'triangle', g, a: 0.006, lp: 2600 })
  tone(ac, out, { f: f * 2, t, dur: dur * 0.5, type: 'sine', g: g * 0.35, a: 0.004 })
  tone(ac, out, { f: f * 3.01, t, dur: dur * 0.2, type: 'sine', g: g * 0.12, a: 0.003 })
}

// Müzik kutusu / çan
function bell(ac, out, f, t, dur = 1.6, g = 0.08) {
  tone(ac, out, { f, t, dur, type: 'sine', g, a: 0.003 })
  tone(ac, out, { f: f * 4, t, dur: dur * 0.25, type: 'sine', g: g * 0.25, a: 0.002 })
  tone(ac, out, { f: f * 5.4, t, dur: dur * 0.12, type: 'sine', g: g * 0.12, a: 0.002 })
}

// Karplus-Strong ile tel çalma sesi (akustik gitar)
const pluckCache = new Map()
function pluckBuffer(ac, midi) {
  if (pluckCache.has(midi)) return pluckCache.get(midi)
  const sr = ac.sampleRate
  const f = hz(midi)
  const N = Math.max(2, Math.round(sr / f))
  const len = Math.floor(sr * 2.2)
  const buf = ac.createBuffer(1, len, sr)
  const d = buf.getChannelData(0)
  const line = new Float32Array(N)
  let prev = 0
  for (let i = 0; i < N; i++) {
    const n = Math.random() * 2 - 1
    prev = prev * 0.5 + n * 0.5 // başlangıç gürültüsünü yumuşat
    line[i] = prev
  }
  const decay = 0.9965 + Math.min(0.0025, (midi < 55 ? 0.002 : 0))
  let idx = 0
  for (let i = 0; i < len; i++) {
    const nxt = (idx + 1) % N
    d[i] = line[idx]
    line[idx] = decay * 0.5 * (line[idx] + line[nxt])
    idx = nxt
  }
  pluckCache.set(midi, buf)
  return buf
}
function pluck(ac, out, midi, t, g = 0.5) {
  const s = ac.createBufferSource()
  s.buffer = pluckBuffer(ac, midi)
  const flt = ac.createBiquadFilter()
  flt.type = 'lowpass'
  flt.frequency.value = 4200
  const gn = ac.createGain()
  gn.gain.value = g
  s.connect(flt).connect(gn).connect(out)
  s.start(t)
}

function kick(ac, out, t, g = 0.5) {
  const o = ac.createOscillator()
  o.frequency.setValueAtTime(120, t)
  o.frequency.exponentialRampToValueAtTime(40, t + 0.14)
  const gn = ac.createGain()
  gn.gain.setValueAtTime(g, t)
  gn.gain.exponentialRampToValueAtTime(0.0001, t + 0.28)
  o.connect(gn).connect(out)
  o.start(t)
  o.stop(t + 0.3)
}

// ---- Parça tanımları: her biri { bpm, swing, setup(ac,out), step(i, t, out, st) } ----
const PRESETS = {
  lofi: {
    bpm: 76,
    swing: 0.16,
    setup(ac, out) {
      // vinil çıtırtısı
      const s = ac.createBufferSource()
      s.buffer = noiseBuffer()
      s.loop = true
      const hp = ac.createBiquadFilter()
      hp.type = 'highpass'
      hp.frequency.value = 5000
      const g = ac.createGain()
      g.gain.value = 0.012
      s.connect(hp).connect(g).connect(out)
      s.start()
      return { stop: () => s.stop(), bars: [
        { b: 38, c: [53, 57, 60, 64] }, // Dm9
        { b: 43, c: [53, 59, 62, 64] }, // G13
        { b: 36, c: [55, 59, 62, 64] }, // Cmaj9
        { b: 33, c: [55, 59, 60, 64] }, // Am9
      ] }
    },
    step(i, t, out, st, ac) {
      const s16 = i % 16
      const bar = st.bars[Math.floor(i / 16) % st.bars.length]
      if (s16 === 0) {
        bar.c.forEach((m, k) => rhodes(ac, out, hz(m), t + k * 0.018, 2.6, 0.06))
        tone(ac, out, { f: hz(bar.b), t, dur: 1.8, g: 0.2, a: 0.02 })
      }
      if (s16 === 10) {
        bar.c.slice(1).forEach((m, k) => rhodes(ac, out, hz(m), t + k * 0.012, 1.2, 0.035))
        tone(ac, out, { f: hz(bar.b), t, dur: 0.8, g: 0.14, a: 0.02 })
      }
      if (s16 === 0 || s16 === 10) kick(ac, out, t, s16 === 0 ? 0.32 : 0.2)
      if (s16 === 4 || s16 === 12) noise(ac, out, { t, dur: 0.12, g: 0.07, type: 'bandpass', f: 1900, q: 0.6 })
      if (s16 % 2 === 0) noise(ac, out, { t, dur: 0.04, g: 0.03 + Math.random() * 0.025 })
      if (s16 % 2 === 0 && Math.random() > 0.68) rhodes(ac, out, hz(pick([62, 65, 67, 69, 72, 74, 77])), t, 1.3, 0.05)
    },
  },

  acoustic: {
    bpm: 94,
    swing: 0,
    setup() {
      return { stop() {}, bars: [
        [43, 50, 55, 59, 62, 67], // G
        [40, 47, 52, 55, 59, 64], // Em
        [48, 52, 55, 60, 64, 67], // C
        [50, 57, 62, 66, 69, 74], // D
      ] }
    },
    step(i, t, out, st, ac) {
      const s16 = i % 16
      if (s16 % 2) return
      const chord = st.bars[Math.floor(i / 16) % st.bars.length]
      const idx = [0, 3, 2, 4, 1, 3, 2, 4][s16 / 2]
      const note = chord[idx % chord.length]
      pluck(ac, out, note, t + Math.random() * 0.012, idx === 0 ? 0.55 : 0.38 + Math.random() * 0.1)
      if (s16 === 0) pluck(ac, out, chord[5], t + 0.03, 0.25)
      if (s16 === 12 && Math.random() > 0.5) pluck(ac, out, chord[5] + pick([0, 2, 4, 7]), t, 0.28)
    },
  },

  musicbox: {
    bpm: 104,
    swing: 0,
    setup() {
      return { stop() {}, bars: [
        [72, 76, 79], // C
        [69, 72, 76], // Am
        [65, 69, 72], // F
        [67, 71, 74], // G
      ] }
    },
    step(i, t, out, st, ac) {
      const s16 = i % 16
      if (s16 % 2) return
      const tri = st.bars[Math.floor(i / 16) % st.bars.length]
      const pat = [0, 1, 2, 1, 0, 1, 2, 1][s16 / 2]
      bell(ac, out, hz(tri[pat]), t, 1.6, 0.075)
      if (s16 % 4 === 0 && Math.random() > 0.35) bell(ac, out, hz(tri[2] + 12 + pick([0, 2, -1, 4])), t + 0.01, 1.8, 0.05)
      if (s16 === 0) bell(ac, out, hz(tri[0] - 24), t, 2.4, 0.07)
    },
  },

  piano: {
    bpm: 66,
    swing: 0,
    setup() {
      return { stop() {}, bars: [
        { b: 45, c: [57, 60, 64, 69] }, // Am
        { b: 41, c: [57, 60, 65, 69] }, // F
        { b: 48, c: [55, 60, 64, 67] }, // C
        { b: 43, c: [55, 59, 62, 67] }, // G
      ] }
    },
    step(i, t, out, st, ac) {
      const s16 = i % 16
      const bar = st.bars[Math.floor(i / 16) % st.bars.length]
      if (s16 === 0) {
        piano(ac, out, hz(bar.b), t, 3.4, 0.12)
        piano(ac, out, hz(bar.b - 12), t, 3.4, 0.08)
      }
      if (s16 % 2 === 0) {
        const n = bar.c[[0, 1, 2, 3, 2, 1, 2, 1][s16 / 2] % bar.c.length]
        piano(ac, out, hz(n), t + 0.004, 1.9, 0.07)
      }
      if (s16 === 8 && Math.random() > 0.4) piano(ac, out, hz(pick([76, 79, 81, 72, 74]) ), t, 2.4, 0.06)
    },
  },
}

// ---- Çalıcı ----
let session = null

export async function startMusic(id) {
  stopMusic(true)
  const def = PRESETS[id]
  if (!def) return false
  await unlockAudio()
  const ac = getCtx()
  const bus = ac.createGain()
  bus.gain.setValueAtTime(0.0001, ac.currentTime)
  bus.gain.exponentialRampToValueAtTime(1, ac.currentTime + 1.5)
  bus.connect(getMusicBus())

  // basit yankı (feedback delay)
  const input = ac.createGain()
  const delay = ac.createDelay(1)
  delay.delayTime.value = id === 'musicbox' ? 0.36 : 0.28
  const fb = ac.createGain()
  fb.gain.value = id === 'musicbox' ? 0.42 : 0.3
  const lp = ac.createBiquadFilter()
  lp.type = 'lowpass'
  lp.frequency.value = 2400
  const wet = ac.createGain()
  wet.gain.value = 0.35
  input.connect(bus)
  input.connect(delay)
  delay.connect(lp)
  lp.connect(fb)
  fb.connect(delay)
  lp.connect(wet)
  wet.connect(bus)

  const st = def.setup(ac, input)
  const stepDur = 60 / def.bpm / 4
  let i = 0
  let next = ac.currentTime + 0.15
  const timer = setInterval(() => {
    while (next < ac.currentTime + 0.3) {
      const swing = i % 2 === 1 ? stepDur * def.swing : 0
      try {
        def.step(i, next + swing, input, st, ac)
      } catch {
        /* bir nota hatası müziği durdurmasın */
      }
      next += stepDur
      i++
    }
  }, 90)
  session = { timer, bus, st, nodes: [input, delay, fb, lp, wet], id }
  return true
}

export function stopMusic(immediate = false) {
  if (!session) return
  const s = session
  session = null
  clearInterval(s.timer)
  const ac = getCtx()
  s.bus.gain.cancelScheduledValues(ac.currentTime)
  s.bus.gain.setTargetAtTime(0.0001, ac.currentTime, immediate ? 0.03 : 0.25)
  setTimeout(() => {
    try {
      s.st.stop?.()
      s.nodes.forEach((n) => n.disconnect())
      s.bus.disconnect()
    } catch {
      /* yoksay */
    }
  }, immediate ? 150 : 1500)
}

export const currentMusic = () => session?.id || null
