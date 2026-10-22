import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import GiftBox from '../components/GiftBox'
import Cake from '../components/Cake'
import FlowerArt from '../components/FlowerArt'
import PlushArt from '../components/PlushArt'
import Polaroid from '../components/Polaroid'
import Envelope from '../components/Envelope'
import {
  FLOWERS,
  FLOWER_VARIANTS,
  MUSIC_PRESETS,
  PLUSHIERS,
  PLUSH_COLORABLE_TYPES,
  PLUSH_VARIANTS,
} from '../data/options'
import { detectMedia, formatDateTR, lockTimestamp } from '../lib/media'

const TABS = [
  ['box', '🎁', 'Kutu'],
  ['cake', '🎂', 'Pasta'],
  ['flower', '🌷', 'Çiçek'],
  ['plush', '🧸', 'Peluş'],
  ['photos', '📷', 'Anılar'],
  ['letter', '💌', 'Mektup'],
  ['desk', '🪑', 'Masa'],
]

const AUTO = { 1: 'box', 2: null, 3: 'flower', 4: 'plush', 5: 'photos', 6: 'letter', 7: 'music', 8: 'desk' }

function Fan({ photos, pw = 104 }) {
  const list = photos.slice(0, 4)
  if (!list.length) return <p className="pv-empty">Fotoğraf ekledikçe burada polaroid olarak görünür 📷</p>
  const rots = [-9, 6, -4, 10]
  return (
    <div className="pv-fan" style={{ '--pw': `${pw}px` }}>
      {list.map((p, i) => (
        <motion.div
          key={p.src.slice(-24) + i}
          className="pv-fan-item"
          initial={{ scale: 0.6, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0, rotate: rots[i] }}
          style={{ left: `${(i - (list.length - 1) / 2) * 24 + 50}%`, zIndex: i }}
          transition={{ type: 'spring', stiffness: 160, damping: 14, delay: i * 0.05 }}
        >
          <Polaroid photo={p} />
        </motion.div>
      ))}
      {photos.length > 4 && <span className="pv-more">+{photos.length - 4}</span>}
    </div>
  )
}

export default function Preview({ gift, step }) {
  const auto = AUTO[step] ?? (gift.birthday.on ? 'cake' : 'box')
  const [tab, setTab] = useState(auto)
  useEffect(() => setTab(auto), [auto])

  const lockTs = lockTimestamp(gift.lock)
  const flower = FLOWERS.find((f) => f.id === gift.flower)
  const music = MUSIC_PRESETS.find((m) => m.id === gift.music.preset)
  const media = gift.music.preset === 'link' ? detectMedia(gift.music.link) : null
  const tabs = TABS.filter(([id]) => {
    if (id === 'cake') return gift.birthday.on
    if (id === 'plush') return gift.plush?.on || step === 4
    return true
  })

  let view
  switch (tab) {
    case 'cake':
      view = (
        <div className="pv-cake">
          <div className="pv-banner glass">🎉 {gift.birthday.message || 'İyi ki doğdun!'}</div>
          <Cake age={gift.birthday.age} className="pv-cake-svg" />
          <p className="pv-cap">{gift.birthday.age} mum · {gift.birthday.blow === 'mic' ? '🎤 mikrofonla üfleme' : '👆 dokunarak söndürme'}</p>
        </div>
      )
      break
    case 'flower': {
      const flowerVariant = FLOWER_VARIANTS[gift.flower]?.find((v) => v.id === (gift.flowerColor || 'red'))
      view = (
        <div className="pv-center">
          <FlowerArt type={gift.flower} color={gift.flowerColor || 'red'} size={190} />
          <p className="pv-cap">
            {flower?.name}
            {flowerVariant ? ` (${flowerVariant.name})` : ''}
          </p>
        </div>
      )
      break
    }
    case 'plush': {
      const plushItem = PLUSHIERS.find((p) => p.id === gift.plush?.type) || PLUSHIERS[0]
      const plushColor = gift.plush?.color || 'classic'
      const isColorable = PLUSH_COLORABLE_TYPES.includes(gift.plush?.type)
      const plushVariant = PLUSH_VARIANTS.find((v) => v.id === plushColor)
      view = (
        <div className="pv-center">
          {gift.plush?.on ? (
            <>
              <PlushArt type={gift.plush.type} color={plushColor} size={160} sway />
              <p className="pv-cap">
                {plushItem?.emoji} {plushItem?.name}
                {isColorable && plushVariant && plushVariant.id !== 'classic' ? ` (${plushVariant.name})` : ''}
              </p>
              <p className="pv-sub-cap">{plushItem?.blurb}</p>
            </>
          ) : (
            <div className="pv-empty">
              <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: 6 }}>🧸</span>
              <span>Peluş oyuncak seçilmedi (isteğe bağlı).</span>
            </div>
          )}
        </div>
      )
      break
    }
    case 'photos':
      view = <Fan photos={gift.photos} pw={124} />
      break
    case 'letter':
      view = (
        <div className="pv-letter">
          <div className="paper paper-mini">
            {gift.letter.to && <p className="paper-to">{gift.letter.to},</p>}
            {gift.letter.title && <h4 className="paper-title">{gift.letter.title}</h4>}
            <div className="paper-body">{(gift.letter.body || 'Mektubun burada görünecek…').slice(0, 260)}</div>
            {gift.letter.sign && <p className="paper-sign">{gift.letter.sign}</p>}
            {gift.letter.secretOn && <div className="pv-scratch">✦ Kazı-kazan gizli not ✦</div>}
          </div>
          <Envelope className="env-mini" />
        </div>
      )
      break
    case 'music':
      view = (
        <div className="pv-center">
          <div className="pv-music-emoji">{music?.emoji}</div>
          <div className="eq eq-big" aria-hidden="true">
            <i /><i /><i /><i /><i />
          </div>
          <p className="pv-cap">
            {gift.music.preset === 'link'
              ? media
                ? media.kind === 'youtube' ? 'YouTube bağlantısı hazır ✔' : 'Spotify bağlantısı hazır ✔'
                : 'Geçerli bir YouTube/Spotify linki gir'
              : music?.name}
          </p>
        </div>
      )
      break
    case 'desk':
      view = (
        <div className="pv-desk">
          <div className="pv-desk-photos"><Fan photos={gift.photos} pw={84} /></div>
          <div className={`pv-desk-flower ${gift.plush?.on ? 'with-plush' : ''}`}>
            <FlowerArt type={gift.flower} color={gift.flowerColor || 'red'} size={76} />
          </div>
          {gift.plush?.on && (
            <div className="pv-desk-plush">
              <PlushArt type={gift.plush.type} color={gift.plush.color || 'classic'} size={76} sway />
            </div>
          )}
          <div className={`pv-desk-env ${gift.plush?.on ? 'with-plush' : ''}`}>
            <Envelope className="env-mini" />
          </div>
        </div>
      )
      break
    case 'box':
    default:
      view = (
        <div className="pv-center">
          <GiftBox locked={!!lockTs} className="pv-box" />
          <p className="pv-cap">{lockTs ? `🔒 ${formatDateTR(lockTs)} tarihine kadar kilitli` : 'Seçtiğin renklerle hediye kutusu'}</p>
        </div>
      )
  }

  return (
    <div className="preview">
      <div className="preview-head">
        <span className="live-dot" /> Canlı önizleme
      </div>
      <div className="preview-tabs" role="tablist">
        {tabs.map(([id, e, label]) => (
          <button key={id} role="tab" aria-selected={tab === id} className={`pv-tab ${tab === id ? 'on' : ''}`} onClick={() => setTab(id)}>
            <span>{e}</span> {label}
          </button>
        ))}
      </div>
      <div className="preview-frame">
        <div className="backdrop" aria-hidden="true">
          <div className="backdrop-glow g1" />
          <div className="backdrop-glow g2" />
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={tab} className="pv-view" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.2 }}>
            {view}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
