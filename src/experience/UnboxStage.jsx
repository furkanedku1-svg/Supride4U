import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import GiftBox from '../components/GiftBox'
import FlowerArt from '../components/FlowerArt'
import PlushArt from '../components/PlushArt'
import Polaroid from '../components/Polaroid'
import Envelope from '../components/Envelope'
import Lightbox from './Lightbox'
import LetterModal from './LetterModal'
import { sfx } from '../lib/audio'
import { bigShow, burst, hearts } from '../lib/effects'
import { useViewport } from '../lib/mic'
import { thankYouUrl } from '../lib/share'
import { DEFAULT_TEASERS, PLUSHIERS } from '../data/options'
import {
  hasMotionSupport,
  isTouchOrMobile,
  listenShake,
  requestMotionPermission,
  requiresMotionPermission,
  triggerVibration,
} from '../lib/shake'

const CLICKS_NEEDED = 3

const rnd = (i, s = 1) => {
  const x = Math.sin(i * 78.233 * s + 1.7) * 43758.5453
  return x - Math.floor(x)
}

// Masanın yerleşimi: fotoğraflar üstte rastgele eğik, çiçek, peluş (isteğe bağlı) ve zarf altta.
function layoutDesk(W, H, n, hasPlush = false) {
  const mobile = W < 560
  const pw = Math.round(Math.max(98, Math.min(mobile ? W * 0.36 : W * 0.19, 180)))
  const ph = pw * 1.2
  const cols = mobile ? 2 : Math.min(4, Math.max(2, Math.ceil(n / 2)))
  const rows = n ? Math.ceil(n / cols) : 0
  const cellW = W / cols
  const cellH = ph * 0.88
  const top = mobile ? 62 : 84

  const photos = Array.from({ length: n }, (_, i) => {
    const r = Math.floor(i / cols)
    const c = i % cols
    const inRow = r === rows - 1 ? n - r * cols : cols
    const offset = ((cols - inRow) * cellW) / 2
    return {
      x: offset + c * cellW + cellW / 2 + (rnd(i, 1) - 0.5) * cellW * 0.12 - pw / 2,
      y: top + r * cellH + (rnd(i, 2) - 0.5) * cellH * 0.08,
      rot: (rnd(i, 3) - 0.5) * 14,
    }
  })

  const zoneY = top + rows * cellH + (rows ? (mobile ? 22 : 36) : (mobile ? 18 : 36))
  const fw = Math.round(Math.min(mobile ? (hasPlush ? W * 0.35 : W * 0.38) : (hasPlush ? 175 : 200), 200))
  const plw = Math.round(Math.min(mobile ? W * 0.35 : 175, 190))
  const ew = Math.round(Math.min(mobile ? (hasPlush ? Math.min(W * 0.68, 220) : W * 0.44) : 230, 240))

  let flower, plush, envelope, zoneBottom

  if (hasPlush) {
    if (mobile) {
      flower = { x: W * 0.28 - fw / 2, y: zoneY, w: fw, h: fw * 1.2 }
      plush = { x: W * 0.72 - plw / 2, y: zoneY + 4, w: plw, h: plw * 1.1 }
      envelope = { x: W * 0.5 - ew / 2, y: zoneY + Math.max(flower.h, plush.h) + 14, w: ew, h: ew * 0.64 }
      zoneBottom = envelope.y + envelope.h
    } else {
      flower = { x: W * 0.22 - fw / 2, y: zoneY, w: fw, h: fw * 1.3 }
      plush = { x: W * 0.5 - plw / 2, y: zoneY + 12, w: plw, h: plw * 1.15 }
      envelope = { x: W * 0.78 - ew / 2, y: zoneY + 44, w: ew, h: ew * 0.66 }
      zoneBottom = zoneY + Math.max(flower.h, plush.h, envelope.h + 44)
    }
  } else {
    // Peluş yoksa mobilde çiçek ve zarf yan yana yerleşir; dikeyde taşmayı ve kutunun altında kalmayı önler
    if (mobile) {
      flower = { x: W * 0.28 - fw / 2, y: zoneY, w: fw, h: fw * 1.2 }
      envelope = { x: W * 0.72 - ew / 2, y: zoneY + 18, w: ew, h: ew * 0.64 }
      zoneBottom = zoneY + Math.max(flower.h, envelope.h + 18)
    } else {
      flower = { x: W * 0.33 - fw / 2, y: zoneY, w: fw, h: fw * 1.3 }
      envelope = { x: W * 0.67 - ew / 2, y: zoneY + 44, w: ew, h: ew * 0.66 }
      zoneBottom = zoneY + Math.max(flower.h, envelope.h + 44)
    }
  }

  // Alttaki dock kontrolü ve kutu için mobilde yeterli boşluk bırakılır
  const bottomMargin = mobile ? 270 : 190
  const contentH = zoneBottom + bottomMargin
  const shift = Math.max(0, (H - contentH) / 2)
  const place = (o) => (o ? { ...o, y: o.y + shift } : null)

  return {
    pw,
    ph,
    photos: photos.map(place),
    flower: place(flower),
    plush: place(plush),
    envelope: place(envelope),
    thanksY: zoneBottom + 40 + shift,
    deskH: Math.max(H, contentH),
  }
}

export default function UnboxStage({ gift, theme }) {
  const vp = useViewport()
  const [clicks, setClicks] = useState(0)
  const [open, setOpen] = useState(false)
  const [boxHidden, setBoxHidden] = useState(false)
  const [revealedIndex, setRevealedIndex] = useState(-1)
  const [activeSpotlight, setActiveSpotlight] = useState(null)
  const [settledKeys, setSettledKeys] = useState(() => new Set())
  const [isRevealing, setIsRevealing] = useState(false)
  const [wobbleKey, setWobbleKey] = useState(0)
  const [selected, setSelected] = useState(null)
  const [letterOpen, setLetterOpen] = useState(false)
  const [hint, setHint] = useState(true)
  const [z, setZ] = useState(() => (gift?.photos || []).map((_, i) => 10 + i))
  const zTop = useRef(10 + (gift?.photos || []).length)
  const deskRef = useRef(null)
  const dragged = useRef(false)

  const isMobile = useMemo(() => isTouchOrMobile(), [])
  const motionSupported = useMemo(() => hasMotionSupport(), [])
  const [needsPermission, setNeedsPermission] = useState(() => requiresMotionPermission())
  const [, setMotionActive] = useState(false)
  const handleBoxRef = useRef(null)

  const n = (gift?.photos || []).length
  const hasPlush = Boolean(gift?.plush?.on)
  const L = useMemo(() => layoutDesk(vp.w, vp.h, n, hasPlush), [vp.w, vp.h, n, hasPlush])
  const colors = useMemo(() => [theme.accent, theme.box, theme.boxLight, '#ffd23f', '#ffffff'], [theme])

  // Sıralı hediye listesi: Çiçek -> Peluş (varsa) -> Fotoğraflar (tek tek!) -> Mektup
  const sequence = useMemo(() => {
    const list = []
    // 1. Çiçek
    list.push({
      key: 'flower',
      type: 'flower',
      label: 'Çiçekleri Kutudan Çıkar',
      teaser: gift?.teasers?.flower ?? DEFAULT_TEASERS.flower,
      emoji: '🌸',
      promptText: '🌸 Çiçekleri masaya bırakmak için dokun',
      sound: () => {
        sfx.pop()
        burst(colors)
      },
    })

    // 2. Peluş (varsa)
    if (gift?.plush?.on) {
      const plushObj = PLUSHIERS?.find((p) => p.id === gift?.plush?.type)
      const plushAccusative = {
        bear: 'Ayıcığı',
        rabbit: 'Tavşanı',
        cat: 'Kediyi',
        dog: 'Köpekçiği',
        elephant: 'Fili',
        penguin: 'Pengueni',
        lamb: 'Kuzuyu',
      }[gift?.plush?.type] || (plushObj?.name ? `${plushObj.name} Dostunu` : 'Peluş Oyuncağı')

      list.push({
        key: 'plush',
        type: 'plush',
        label: `${plushAccusative} Kutudan Çıkar`,
        teaser: gift?.teasers?.plush ?? DEFAULT_TEASERS.plush,
        emoji: '🧸',
        promptText: `🧸 ${plushAccusative} masaya bırakmak için dokun`,
        sound: () => {
          sfx.squeak()
          hearts()
        },
      })
    }

    // 3. Fotoğraflar — TEK TEK!
    if (gift?.photos?.length > 0) {
      const total = gift.photos.length
      gift.photos.forEach((photo, idx) => {
        const isFirst = idx === 0
        const isDrawing = Boolean(photo?.isDrawing)
        const photoLabel = total > 1
          ? (isDrawing ? `${idx + 1}. Çizimi Kutudan Çıkar` : `${idx + 1}. Anı Fotoğrafını Kutudan Çıkar`)
          : (isDrawing ? 'Özel Çizimi Kutudan Çıkar' : 'Anı Fotoğrafını Kutudan Çıkar')

        const photoTeaser = isFirst
          ? (gift?.teasers?.photos ?? DEFAULT_TEASERS.photos)
          : (photo?.note?.trim() ? `"${photo.note.trim()}"` : `${idx + 1}. Anı Fotoğrafı ✨`)

        list.push({
          key: `photo-${idx}`,
          type: 'photo',
          photoIndex: idx,
          photoData: photo,
          label: photoLabel,
          teaser: photoTeaser,
          emoji: isDrawing ? '🎨' : '📸',
          promptText: photo?.note?.trim()
            ? `📸 "${photo.note.trim()}" · Masaya bırakmak için dokun`
            : `📸 ${idx + 1}. Fotoğrafı masaya bırakmak için dokun`,
          sound: () => {
            sfx.paper()
            burst(colors)
          },
        })
      })
    }

    // 4. Mektup
    list.push({
      key: 'letter',
      type: 'letter',
      label: 'Mektubu Kutudan Çıkar',
      teaser: gift?.teasers?.letter ?? DEFAULT_TEASERS.letter,
      emoji: '💌',
      promptText: '💌 Mektubu masaya bırakmak veya açmak için dokun',
      sound: () => {
        sfx.chime()
        hearts()
      },
    })

    return list
  }, [gift, colors])

  // Spotlight'taki hediyeyi arkaya (masaya) yerleştirme
  const dismissSpotlight = useCallback(() => {
    if (!activeSpotlight) return
    const currentKey = activeSpotlight
    sfx.rustle()
    setSettledKeys((prev) => {
      const next = new Set(prev)
      next.add(currentKey)
      return next
    })
    setActiveSpotlight(null)

    // Eğer mektup masaya yerleştirildiyse, hemen ardından mektup modalını aç
    if (currentKey === 'letter') {
      setTimeout(() => {
        setLetterOpen(true)
      }, 500)
    }

    // Eğer bu son hediye idiyse, tüm hediyeler masaya geldikten sonra kutuyu zarifçe gizle
    const currentIdx = sequence.findIndex((s) => s.key === currentKey)
    if (currentIdx === sequence.length - 1) {
      setTimeout(() => {
        bigShow(colors, 1400)
      }, 600)
      setTimeout(() => {
        setBoxHidden(true)
      }, 1600)
      setTimeout(() => {
        setHint(false)
      }, 12000)
    }
  }, [activeSpotlight, sequence, colors])

  // Sıradaki hediyeyi kutudan öne (spotlight'a) çıkarma
  const revealNext = useCallback(() => {
    if (!open || isRevealing) return
    // Eğer şu an bir hediye spotlight'taysa, butona basılınca önce onu masaya yerleştir
    if (activeSpotlight) {
      dismissSpotlight()
      return
    }
    const targetIdx = revealedIndex + 1
    if (targetIdx >= sequence.length) return

    setIsRevealing(true)
    const item = sequence[targetIdx]
    item?.sound?.()
    setRevealedIndex(targetIdx)
    setActiveSpotlight(item.key)

    setTimeout(() => {
      setIsRevealing(false)
    }, 450)
  }, [open, isRevealing, activeSpotlight, dismissSpotlight, revealedIndex, sequence])

  const handleBox = useCallback(() => {
    if (!open) {
      triggerVibration([80, 40, 80])
      setClicks((prev) => {
        const next = prev + 1
        setWobbleKey((k) => k + 1)
        sfx.tick()
        if (next < CLICKS_NEEDED) {
          sfx.rustle()
          return next
        }
        setOpen(true)
        sfx.pop()
        burst(colors)
        return next
      })
    } else {
      // Kutu açıkken pakete tıklandığında da spotlight varsa masaya gönderir, yoksa sıradakini çıkarır
      if (activeSpotlight) {
        dismissSpotlight()
      } else {
        revealNext()
      }
    }
  }, [open, colors, activeSpotlight, dismissSpotlight, revealNext])

  useEffect(() => {
    handleBoxRef.current = handleBox
  }, [handleBox])

  const handleRequestPermission = useCallback(async () => {
    const res = await requestMotionPermission()
    if (res === 'granted') {
      setNeedsPermission(false)
      setMotionActive(true)
    }
  }, [])

  // Cihaz sallama dinleyicisi
  useEffect(() => {
    if (open || !motionSupported || needsPermission) return

    setMotionActive(true)
    const cleanup = listenShake(() => {
      handleBoxRef.current?.()
    })

    return () => {
      cleanup()
      setMotionActive(false)
    }
  }, [open, motionSupported, needsPermission])

  const handleBoxInteraction = () => {
    if (needsPermission && !open) {
      handleRequestPermission()
    }
    handleBox()
  }

  const bringFront = (i) =>
    setZ((p) => {
      const c = [...p]
      c[i] = ++zTop.current
      return c
    })

  const closeLetter = useCallback(() => setLetterOpen(false), [])

  const left = Math.max(0, CLICKS_NEEDED - clicks)

  // Durum hesaplamaları
  const allRevealed = sequence.length > 0 && sequence.every((s) => settledKeys.has(s.key))
  const nextIdx = revealedIndex + 1
  const nextItem = !activeSpotlight && nextIdx < sequence.length ? sequence[nextIdx] : null
  const currentSpotlightItem = activeSpotlight ? sequence.find((s) => s.key === activeSpotlight) : null

  // Geometri hesaplayıcı (Spotlight -> Masa geçişi)
  const cx = vp.w / 2
  const cy = Math.max(130, Math.min(vp.h * 0.32, 290))
  const bx = vp.w / 2
  const by = vp.h - 90

  const getItemMotion = (x, y, w, h, key, defaultRot, zDesk = 10) => {
    const isSpotlight = activeSpotlight === key
    const isSettled = settledKeys.has(key)
    const itemCenterX = x + w / 2
    const itemCenterY = y + h / 2

    const spotX = cx - itemCenterX
    const spotY = cy - itemCenterY
    const boxRelX = bx - itemCenterX
    const boxRelY = by - itemCenterY

    // Spotlight ölçeği: Ekranda öne çıkması için belirgin ve mobil ekran sınırlarına uygun
    const targetSpotW = Math.min(vp.w * 0.72, 280)
    const spotScale = Math.min(Math.max(1.3, targetSpotW / Math.max(w, 1)), 2.0)

    return {
      motionProps: {
        initial: {
          x: boxRelX,
          y: boxRelY,
          scale: 0.15,
          rotate: (rnd(key.length, 7) - 0.5) * 60,
          opacity: 0,
        },
        animate: isSpotlight
          ? {
              x: spotX,
              y: spotY,
              scale: spotScale,
              rotate: 0,
              opacity: 1,
              zIndex: 90,
            }
          : {
              x: 0,
              y: 0,
              scale: 1,
              rotate: defaultRot,
              opacity: 1,
              zIndex: zDesk,
            },
        transition: {
          type: 'spring',
          stiffness: isSpotlight ? 95 : 130,
          damping: isSpotlight ? 14 : 17,
          mass: 0.8,
        },
      },
      isSpotlight,
      isSettled,
    }
  }

  // Elemanların açılma kontrolleri
  const flowerIdx = sequence.findIndex((s) => s.key === 'flower')
  const plushIdx = sequence.findIndex((s) => s.key === 'plush')
  const letterIdx = sequence.findIndex((s) => s.key === 'letter')

  const flowerRevealed = flowerIdx !== -1 && revealedIndex >= flowerIdx
  const plushRevealed = plushIdx !== -1 && revealedIndex >= plushIdx
  const letterRevealed = letterIdx !== -1 && revealedIndex >= letterIdx

  const flowerMotion = L.flower ? getItemMotion(L.flower.x, L.flower.y, L.flower.w, L.flower.h, 'flower', 0, 5) : null
  const plushMotion = L.plush ? getItemMotion(L.plush.x, L.plush.y, L.plush.w, L.plush.h, 'plush', 3, 7) : null
  const letterMotion = L.envelope ? getItemMotion(L.envelope.x, L.envelope.y, L.envelope.w, L.envelope.h, 'letter', -5, 6) : null

  return (
    <motion.div
      className="stage stage-unbox"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ overflowY: open ? 'auto' : 'hidden' }}
    >
      {/* Spotlight karartma ve odak katmanı */}
      <AnimatePresence>
        {activeSpotlight && currentSpotlightItem && (
          <>
            <motion.div
              key="spotlight-backdrop"
              className="spotlight-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={dismissSpotlight}
            />

            <motion.div
              key="spotlight-prompt"
              className="spotlight-prompt-wrap"
              initial={{ opacity: 0, y: 25, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.9 }}
              transition={{ duration: 0.25 }}
            >
              <button
                type="button"
                className="spotlight-prompt glass"
                onClick={dismissSpotlight}
              >
                <span className="spotlight-prompt-icon">👇</span>
                <span className="spotlight-prompt-text">{currentSpotlightItem.promptText}</span>
                <span className="spotlight-prompt-action">Masaya Yerleştir ✨</span>
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Kutu Katmanı: Başta ortada, açılınca altta (docked), tüm hediyeler çıkınca kaybolur */}
      <div className={`box-layer ${open ? 'docked' : ''} ${boxHidden ? 'box-hidden' : ''}`}>
        <GiftBox
          progress={clicks}
          open={open}
          hidden={boxHidden}
          wobbleKey={wobbleKey}
          onClick={handleBoxInteraction}
          className={open ? 'box-docked' : 'box-big'}
        />

        <AnimatePresence>
          {!open && (
            <motion.div
              className="box-help"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
            >
              {isMobile && motionSupported ? (
                <>
                  <motion.div
                    className="shake-badge"
                    animate={{ rotate: [-6, 6, -6], scale: [1, 1.05, 1] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <span className="shake-icon" aria-hidden="true">📳</span>
                    <span>Kutuyu açmak için telefonunu salla!</span>
                  </motion.div>
                  <p className="stage-title">veya pakete dokun 🎁</p>
                  {needsPermission && (
                    <button
                      type="button"
                      className="btn btn-soft btn-sm shake-perm-btn"
                      onClick={handleRequestPermission}
                    >
                      📳 Sallama Sensörünü Aç
                    </button>
                  )}
                </>
              ) : (
                <p className="stage-title">Açmak için pakete tıkla! 🎁</p>
              )}
              <motion.p key={left} className="stage-sub pill" initial={{ scale: 1.3 }} animate={{ scale: 1 }}>
                Kalan: {left} {isMobile && motionSupported ? 'sallama / dokunuş' : 'tık'}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hediyeler kutudan çıkarken: Teaser mesajı ve sonraki hediye butonu (Spotlight yokken görünür) */}
        <AnimatePresence>
          {open && !boxHidden && nextItem && (
            <motion.div
              className="unbox-controls"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.25 }}
            >
              {nextItem.teaser?.trim() && (
                <motion.div
                  key={nextItem.key}
                  className="unbox-teaser-card glass"
                  initial={{ opacity: 0, scale: 0.9, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -8 }}
                >
                  <span className="teaser-badge">Sıradaki Sürpriz ✨</span>
                  <p className="teaser-text">{nextItem.teaser}</p>
                </motion.div>
              )}

              <motion.button
                type="button"
                className="btn-unbox-next"
                onClick={revealNext}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="unbox-btn-icon">{nextItem.emoji}</span>
                <span className="unbox-btn-label">{nextItem.label}</span>
                <span className="unbox-btn-arrow">➔</span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Masa */}
      {open && (
        <div className="desk" ref={deskRef} style={{ height: L.deskH }}>
          <AnimatePresence>
            {hint && allRevealed && (
              <motion.div
                className="desk-hint glass"
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.5 }}
              >
                {gift?.plush?.on
                  ? 'Fotoğrafları sürükle · Zarfa dokun 💌 · Peluşa sarıl 🧸'
                  : 'Fotoğrafları sürükle, dokunup büyüt · Zarfa dokun 💌'}
              </motion.div>
            )}
          </AnimatePresence>

          {/* 1. Çiçek */}
          <AnimatePresence>
            {flowerRevealed && flowerMotion && (
              <motion.div
                key="flower"
                className={`desk-item desk-flower ${flowerMotion.isSpotlight ? 'spotlight-active-item' : ''}`}
                style={{ left: L.flower.x, top: L.flower.y, width: L.flower.w }}
                onClick={flowerMotion.isSpotlight ? dismissSpotlight : undefined}
                title={flowerMotion.isSpotlight ? 'Masaya bırakmak için dokun 🌸' : undefined}
                {...flowerMotion.motionProps}
              >
                <FlowerArt
                  type={gift?.flower || 'rose'}
                  color={gift?.flowerColor || 'red'}
                  size={L.flower.w}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* 2. Peluş Oyuncak (isteğe bağlı) */}
          <AnimatePresence>
            {gift?.plush?.on && L.plush && plushRevealed && plushMotion && (
              <motion.div
                key="plush"
                className={`desk-item desk-plush ${plushMotion.isSpotlight ? 'spotlight-active-item' : ''}`}
                style={{ left: L.plush.x, top: L.plush.y, width: L.plush.w }}
                whileHover={{ scale: plushMotion.isSpotlight ? 1.04 : 1.08 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => {
                  sfx.squeak()
                  hearts()
                  if (plushMotion.isSpotlight) {
                    dismissSpotlight()
                  }
                }}
                title={plushMotion.isSpotlight ? 'Masaya bırakmak için dokun 🧸' : 'Peluşa dokun! 🧸'}
                {...plushMotion.motionProps}
              >
                {plushMotion.isSettled && (
                  <motion.div
                    className="plush-hint"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 1.8, repeat: Infinity, delay: 0.3 }}
                  >
                    🧸 Sev beni
                  </motion.div>
                )}
                <PlushArt
                  type={gift.plush.type}
                  color={gift?.plush?.color || 'classic'}
                  size={L.plush.w}
                  sway
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* 3. Polaroid Fotoğraflar (Tek Tek Kutudan Çıkar) */}
          <AnimatePresence>
            {(gift?.photos || []).map((p, i) => {
              const photoKey = `photo-${i}`
              const photoIdx = sequence.findIndex((s) => s.key === photoKey)
              const isPhotoRevealed = photoIdx !== -1 && revealedIndex >= photoIdx
              if (!isPhotoRevealed) return null

              const pos = L.photos[i]
              if (!pos) return null

              const pMotion = getItemMotion(pos.x, pos.y, L.pw, L.ph, photoKey, pos.rot, z[i] ?? 10)

              return (
                <motion.div
                  key={photoKey}
                  className={`desk-item desk-photo ${pMotion.isSpotlight ? 'spotlight-active-item' : ''}`}
                  style={{ left: pos.x, top: pos.y, '--pw': `${L.pw}px` }}
                  drag={!pMotion.isSpotlight}
                  dragConstraints={deskRef}
                  dragElastic={0.12}
                  dragMomentum={false}
                  whileDrag={{ scale: 1.08, boxShadow: '0 24px 40px rgba(0,0,0,.28)' }}
                  whileHover={{ scale: pMotion.isSpotlight ? 1.03 : 1.04 }}
                  onPointerDown={() => !pMotion.isSpotlight && bringFront(i)}
                  onDragStart={() => {
                    dragged.current = true
                    sfx.paper()
                  }}
                  onDragEnd={() => setTimeout(() => (dragged.current = false), 60)}
                  onClick={() => {
                    if (pMotion.isSpotlight) {
                      dismissSpotlight()
                    } else if (!dragged.current) {
                      setSelected(i)
                    }
                  }}
                  {...pMotion.motionProps}
                >
                  <Polaroid photo={p} />
                </motion.div>
              )
            })}
          </AnimatePresence>

          {/* 4. Zarf / Mektup */}
          <AnimatePresence>
            {letterRevealed && letterMotion && (
              <motion.div
                key="envelope"
                className={`desk-item desk-env ${letterMotion.isSpotlight ? 'spotlight-active-item' : ''}`}
                style={{ left: L.envelope.x, top: L.envelope.y, width: L.envelope.w }}
                onClick={() => {
                  sfx.paper()
                  if (letterMotion.isSpotlight) {
                    dismissSpotlight()
                  } else {
                    setLetterOpen(true)
                  }
                }}
                {...letterMotion.motionProps}
              >
                {letterMotion.isSettled && (
                  <motion.div
                    className="env-hint"
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 1.6, repeat: Infinity }}
                  >
                    💌 Mektubu aç
                  </motion.div>
                )}
                <Envelope
                  onClick={() => {
                    sfx.paper()
                    if (letterMotion.isSpotlight) {
                      dismissSpotlight()
                    } else {
                      setLetterOpen(true)
                    }
                  }}
                  label="Mektubu aç"
                  className="env-table"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Aşama 5: Teşekkür & Sarıl Butonu (Tüm hediyeler çıktıktan sonra) */}
          <AnimatePresence>
            {allRevealed && (
              <motion.div
                key="thanks"
                className="thanks"
                style={{ top: L.thanksY }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
              >
                <p className="thanks-text">Sürprizin tamamı bu kadar… Umarım gülümsetmişimdir 🥹</p>
                <a
                  className="btn btn-primary btn-lg"
                  href={thankYouUrl(gift?.phone)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => (hearts(), sfx.chime())}
                >
                  Bunu Gönderene Sarıl / Teşekkür Et ❤️
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      <AnimatePresence>
        {selected !== null && (
          <Lightbox
            photos={gift?.photos || []}
            index={selected}
            onIndex={setSelected}
            onClose={() => setSelected(null)}
          />
        )}
        {letterOpen && <LetterModal letter={gift?.letter || {}} onClose={closeLetter} />}
      </AnimatePresence>
    </motion.div>
  )
}
