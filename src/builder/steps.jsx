import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { THEMES } from '../data/themes'
import {
  FLOWERS,
  FLOWER_VARIANTS,
  MUSIC_PRESETS,
  PLUSHIERS,
  PLUSH_COLORABLE_TYPES,
  PLUSH_VARIANTS,
  DEFAULT_TEASERS,
} from '../data/options'
import FlowerArt from '../components/FlowerArt'
import PlushArt from '../components/PlushArt'
import QRCodeCard from '../components/QRCodeCard'
import DrawModal from '../components/DrawModal'
import { fileToSmallDataUrl } from '../lib/image'
import { detectMedia, formatDateTR, lockTimestamp } from '../lib/media'
import { buildLink } from '../lib/codec'
import { shareUrl } from '../lib/share'
import { setMuted, sfx } from '../lib/audio'
import { startMusic, stopMusic } from '../lib/music'

const MAX_PHOTOS = 8

const Field = ({ label, hint, children, as: Tag = 'label' }) => (
  <Tag className="field">
    <span className="field-label">{label}</span>
    {children}
    {hint && <span className="field-hint">{hint}</span>}
  </Tag>
)

const Switch = ({ on, onChange, label, sub }) => (
  <button type="button" role="switch" aria-checked={on} className={`switch-row ${on ? 'on' : ''}`} onClick={() => onChange(!on)}>
    <span className="switch-text">
      <strong>{label}</strong>
      {sub && <small>{sub}</small>}
    </span>
    <span className="switch-track"><i /></span>
  </button>
)

/* ---------------- Adım 1: Tema ---------------- */
export function StepTheme({ gift, upd }) {
  return (
    <div className="cards cards-theme">
      {THEMES.map((t) => (
        <motion.button
          key={t.id}
          type="button"
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.97 }}
          className={`card theme-card ${gift.theme === t.id ? 'selected' : ''}`}
          onClick={() => upd('theme', t.id)}
          aria-pressed={gift.theme === t.id}
        >
          <span className="theme-swatch" style={{ background: `linear-gradient(135deg, ${t.bg[0]}, ${t.bg[1]} 55%, ${t.bg[2]})` }}>
            <span className="swatch-box" style={{ background: t.box }}>
              <span className="swatch-rib" style={{ background: t.ribbon }} />
            </span>
          </span>
          <span className="card-title">{t.emoji} {t.name}</span>
          <span className="dots">
            {[t.box, t.ribbon, t.accent, t.bg[2]].map((c, i) => <i key={i} style={{ background: c }} />)}
          </span>
        </motion.button>
      ))}
    </div>
  )
}

/* ---------------- Adım 2: Tür & Zaman Kilidi ---------------- */
const pad = (n) => String(n).padStart(2, '0')
const toLocalInput = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`

export function StepType({ gift, updIn }) {
  const b = gift.birthday
  const lock = gift.lock
  const ts = lockTimestamp(lock)
  const past = ts && ts < Date.now()
  const quick = (fn) => {
    const d = new Date()
    fn(d)
    updIn('lock', { on: true, at: toLocalInput(d) })
  }
  return (
    <div className="stack">
      <Switch on={b.on} onChange={(v) => updIn('birthday', { on: v })} label="🎂 Bu bir doğum günü hediyesi mi?" sub="Alıcı önce mumları üfleyerek pastayı keser" />
      {b.on && (
        <motion.div className="subpanel" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
          <Field label="Mum sayısı (yaş)" as="div">
            <div className="stepper-num">
              <button type="button" onClick={() => updIn('birthday', { age: Math.max(1, b.age - 1) })} aria-label="Azalt">−</button>
              <input type="number" min="1" max="120" value={b.age} onChange={(e) => updIn('birthday', { age: Math.max(1, Math.min(120, Number(e.target.value) || 1)) })} />
              <button type="button" onClick={() => updIn('birthday', { age: Math.min(120, b.age + 1) })} aria-label="Artır">+</button>
            </div>
            <span className="field-hint">10’dan büyük yaşlarda sayı şeklinde mumlar kullanılır.</span>
          </Field>
          <Field label="Pasta tebrik mesajı">
            <textarea rows="2" maxLength="140" value={b.message} onChange={(e) => updIn('birthday', { message: e.target.value })} />
          </Field>
          <div className="field">
            <span className="field-label">Üfleme modu</span>
            <div className="seg">
              <button type="button" className={b.blow === 'mic' ? 'on' : ''} onClick={() => updIn('birthday', { blow: 'mic' })}>🎤 Mikrofonla üfle<small>dokunma yedekli</small></button>
              <button type="button" className={b.blow === 'tap' ? 'on' : ''} onClick={() => updIn('birthday', { blow: 'tap' })}>👆 Dokunarak söndür<small>tıkla / basılı tut</small></button>
            </div>
          </div>
        </motion.div>
      )}

      <Switch on={lock.on} onChange={(v) => updIn('lock', { on: v })} label="⏳ Zaman kilidi eklemek ister misin?" sub="Tarihten önce açılırsa kutu zincirli kalır ve geri sayım gösterilir" />
      {lock.on && (
        <motion.div className="subpanel" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
          <Field label="Açılış tarihi ve saati">
            <input type="datetime-local" value={lock.at} min={toLocalInput(new Date())} onChange={(e) => updIn('lock', { at: e.target.value })} />
          </Field>
          <div className="chips">
            <button type="button" className="chip" onClick={() => quick((d) => d.setHours(d.getHours() + 1))}>+1 saat</button>
            <button type="button" className="chip" onClick={() => quick((d) => (d.setDate(d.getDate() + 1), d.setHours(9, 0, 0, 0)))}>Yarın 09:00</button>
            <button type="button" className="chip" onClick={() => quick((d) => (d.setDate(d.getDate() + 7), d.setHours(9, 0, 0, 0)))}>1 hafta sonra</button>
            <button type="button" className="chip" onClick={() => quick((d) => (d.setMonth(d.getMonth() + 1), d.setHours(0, 0, 0, 0)))}>1 ay sonra</button>
          </div>
          {ts && !past && <p className="note ok">🔒 Kutu {formatDateTR(ts)} tarihine kadar kilitli kalacak.</p>}
          {past && <p className="note warn">Seçtiğin zaman geçmiş görünüyor; kutu kilitsiz açılır.</p>}
          {!lock.at && <p className="note">Bir tarih seçmezsen kilit uygulanmaz.</p>}
          <p className="note small">Not: Kilit alıcının cihaz saatine göre çalışır; sürprizi bozmamak için samimi bir güvenlik katmanı olarak düşün 😉</p>
        </motion.div>
      )}
    </div>
  )
}

/* ---------------- Adım 3: Çiçek ---------------- */
export function StepFlower({ gift, upd, updIn }) {
  const currentVariants = FLOWER_VARIANTS[gift.flower]
  const currentColor = gift.flowerColor || 'red'

  return (
    <div className="stack">
      <div className="cards cards-flower">
        {FLOWERS.map((f) => (
          <motion.button
            key={f.id}
            type="button"
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.97 }}
            className={`card flower-card ${gift.flower === f.id ? 'selected' : ''}`}
            onClick={() => upd('flower', f.id)}
            aria-pressed={gift.flower === f.id}
          >
            <FlowerArt type={f.id} color={f.id === gift.flower ? currentColor : 'red'} size={84} sway={gift.flower === f.id} />
            <span className="card-title">{f.name}</span>
            <span className="card-sub">{f.blurb}</span>
          </motion.button>
        ))}
      </div>

      {currentVariants && (
        <motion.div
          className="subpanel flower-palette"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22 }}
        >
          <div className="field">
            <span className="field-label">🌹 Gül Buketi Renk Seçeneği</span>
            <span className="field-hint">Buketinin gül rengini seçerek hediyeni özelleştir</span>
          </div>

          <div className="flower-variants-grid">
            {currentVariants.map((v) => {
              const active = currentColor === v.id
              return (
                <button
                  key={v.id}
                  type="button"
                  className={`variant-pill ${active ? 'on' : ''}`}
                  onClick={() => upd('flowerColor', v.id)}
                  title={v.title}
                >
                  <span
                    className="variant-color-dot"
                    style={{ background: v.previewBg, border: v.border || 'none' }}
                  />
                  <span className="variant-name">{v.emoji} {v.name}</span>
                </button>
              )
            })}
          </div>
        </motion.div>
      )}

      <div className="subpanel" style={{ marginTop: 8 }}>
        <Field
          label="🎁 Çiçek Açılış Mesajı (İpucu)"
          hint="Kutudan çiçekler çıkmadan önce alıcıya gösterilir (silerseniz yazı gösterilmez)"
        >
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input
              type="text"
              maxLength="90"
              placeholder="Örn: Senin için taptaze çiçekler topladım... 🌸"
              value={gift.teasers?.flower ?? ''}
              onChange={(e) => updIn('teasers', { flower: e.target.value })}
            />
            {gift.teasers?.flower !== DEFAULT_TEASERS.flower && (
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                style={{ whiteSpace: 'nowrap' }}
                onClick={() => updIn('teasers', { flower: DEFAULT_TEASERS.flower })}
                title="Varsayılana döndür"
              >
                ↺ Sıfırla
              </button>
            )}
          </div>
        </Field>
      </div>
    </div>
  )
}

/* ---------------- Adım 4: Peluş Oyuncak (İsteğe Bağlı) ---------------- */
export function StepPlush({ gift, updIn }) {
  const plush = gift.plush || { on: false, type: 'bear', color: 'classic' }
  const currentColor = plush.color || 'classic'
  const isColorable = PLUSH_COLORABLE_TYPES.includes(plush.type)
  const selectedPlush = PLUSHIERS.find((p) => p.id === plush.type)

  return (
    <div className="stack">
      <Switch
        on={plush.on}
        onChange={(v) => {
          updIn('plush', { on: v })
          if (v) sfx.squeak()
        }}
        label="🧸 Peluş oyuncak eklemek ister misin?"
        sub="Kutudan masaya dökülecek sevimli bir peluş arkadaş ekler (isteğe bağlı)"
      />

      {plush.on && (
        <motion.div
          className="subpanel"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.24 }}
        >
          <div className="field">
            <span className="field-label">Sevimli Peluşunu Seç</span>
            <span className="field-hint">Alıcının kutuyu açtığında gülümsemesini sağlayacak tatlı bir karakter seç</span>
          </div>

          <div className="cards cards-plush">
            {PLUSHIERS.map((p) => {
              const isSelected = plush.type === p.id
              return (
                <motion.button
                  key={p.id}
                  type="button"
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.96 }}
                  className={`card plush-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => {
                    updIn('plush', { type: p.id, on: true })
                    sfx.squeak()
                  }}
                  aria-pressed={isSelected}
                >
                  <PlushArt
                    type={p.id}
                    color={isSelected && isColorable ? currentColor : 'classic'}
                    size={76}
                    sway={isSelected}
                  />
                  <span className="card-title">{p.emoji} {p.name}</span>
                  <span className="card-sub">{p.blurb}</span>
                </motion.button>
              )
            })}
          </div>

          {isColorable && (
            <motion.div
              className="subpanel flower-palette"
              style={{ marginTop: 12 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22 }}
            >
              <div className="field">
                <span className="field-label">🎨 {selectedPlush?.name} Renk Seçeneği</span>
                <span className="field-hint">Peluş arkadaşının rengini seçerek hediyeni özelleştir</span>
              </div>

              <div className="flower-variants-grid">
                {PLUSH_VARIANTS.map((v) => {
                  const active = currentColor === v.id
                  return (
                    <button
                      key={v.id}
                      type="button"
                      className={`variant-pill ${active ? 'on' : ''}`}
                      onClick={() => {
                        updIn('plush', { color: v.id })
                        sfx.squeak()
                      }}
                      title={v.title}
                    >
                      <span
                        className="variant-color-dot"
                        style={{ background: v.previewBg, border: v.border || 'none' }}
                      />
                      <span className="variant-name">{v.emoji} {v.name}</span>
                    </button>
                  )
                })}
              </div>
            </motion.div>
          )}

          <div className="subpanel" style={{ marginTop: 12 }}>
            <Field
              label="🎁 Peluş Açılış Mesajı (İpucu)"
              hint="Kutudan peluş oyuncak çıkmadan önce alıcıya gösterilir (silerseniz yazı gösterilmez)"
            >
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  type="text"
                  maxLength="90"
                  placeholder="Örn: Sana sıcacık sarılacak bir dost... 🧸"
                  value={gift.teasers?.plush ?? ''}
                  onChange={(e) => updIn('teasers', { plush: e.target.value })}
                />
                {gift.teasers?.plush !== DEFAULT_TEASERS.plush && (
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    style={{ whiteSpace: 'nowrap' }}
                    onClick={() => updIn('teasers', { plush: DEFAULT_TEASERS.plush })}
                    title="Varsayılana döndür"
                  >
                    ↺ Sıfırla
                  </button>
                )}
              </div>
            </Field>
          </div>
        </motion.div>
      )}
    </div>
  )
}

/* ---------------- Adım 5: Anı Galerisi ---------------- */
export function StepPhotos({ gift, upd, updIn }) {
  const [url, setUrl] = useState('')
  const [busy, setBusy] = useState(false)
  const [drag, setDrag] = useState(false)
  const [drawOpen, setDrawOpen] = useState(false)
  const fileRef = useRef(null)
  const photos = gift.photos
  const room = MAX_PHOTOS - photos.length

  const addFiles = async (files) => {
    const list = Array.from(files).filter((f) => f.type.startsWith('image/')).slice(0, room)
    if (!list.length) return
    setBusy(true)
    try {
      const out = []
      for (const f of list) out.push({ src: await fileToSmallDataUrl(f), note: '' })
      upd('photos', [...photos, ...out])
    } finally {
      setBusy(false)
    }
  }
  const addUrl = () => {
    const u = url.trim()
    if (!/^https?:\/\//i.test(u) || room <= 0) return
    upd('photos', [...photos, { src: u, note: '' }])
    setUrl('')
  }
  const setNote = (i, note) => upd('photos', photos.map((p, k) => (k === i ? { ...p, note } : p)))
  const remove = (i) => upd('photos', photos.filter((_, k) => k !== i))
  const move = (i, d) => {
    const j = i + d
    if (j < 0 || j >= photos.length) return
    const c = [...photos]
    ;[c[i], c[j]] = [c[j], c[i]]
    upd('photos', c)
  }

  return (
    <div className="stack">
      {/* Kendi Çizimini Yap Butonu */}
      <div className="photo-add-options">
        <button
          type="button"
          className="photo-choice-btn"
          onClick={() => setDrawOpen(true)}
          disabled={room <= 0}
        >
          <span className="choice-icon">🎨</span>
          <div className="choice-text">
            <strong>Kendin Çizim Yap & Polaroid Ekle</strong>
            <small>Tuval üzerine parmağınla çiz, damgalar ekle ve polaroid yap</small>
          </div>
          <span className="choice-tag">Kişisel Çizim ✨</span>
        </button>
      </div>

      <div
        className={`dropzone ${drag ? 'drag' : ''}`}
        onDragOver={(e) => (e.preventDefault(), setDrag(true))}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => (e.preventDefault(), setDrag(false), addFiles(e.dataTransfer.files))}
        onClick={() => room > 0 && fileRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && fileRef.current?.click()}
      >
        <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => (addFiles(e.target.files), (e.target.value = ''))} />
        <span className="dz-icon">{busy ? '⏳' : '📸'}</span>
        <strong>{busy ? 'Fotoğraflar hazırlanıyor…' : room > 0 ? 'Fotoğraf yükle veya sürükle bırak' : 'Maksimum fotoğrafa ulaştın'}</strong>
        <small>{photos.length}/{MAX_PHOTOS} · Fotoğraflar link için otomatik küçültülür</small>
      </div>

      <div className="url-add">
        <input type="url" inputMode="url" placeholder="veya fotoğraf bağlantısı (https://…)" value={url} onChange={(e) => setUrl(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addUrl()} />
        <button type="button" className="btn btn-soft" onClick={addUrl} disabled={!/^https?:\/\//i.test(url.trim()) || room <= 0}>Ekle</button>
      </div>
      <p className="note small">İpucu: Kendi çizimlerin ve URL ile eklenen fotoğraflar paylaşım linkini hafif tutar.</p>

      <div className="photo-list">
        {photos.map((p, i) => (
          <motion.div layout key={i} className="photo-row" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="photo-thumb-wrap">
              <img src={p.src} alt="" />
              {p.isDrawing && <span className="photo-draw-indicator" title="Kendi el emeği çizimin">🎨</span>}
            </div>
            <input type="text" maxLength="40" placeholder="Anı notu / tarih (ör. Yaz 2023 ☀️)" value={p.note} onChange={(e) => setNote(i, e.target.value)} />
            <div className="row-actions">
              <button type="button" aria-label="Yukarı" onClick={() => move(i, -1)} disabled={i === 0}>↑</button>
              <button type="button" aria-label="Aşağı" onClick={() => move(i, 1)} disabled={i === photos.length - 1}>↓</button>
              <button type="button" aria-label="Sil" className="danger" onClick={() => remove(i)}>✕</button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="subpanel" style={{ marginTop: 12 }}>
        <Field
          label="🎁 Fotoğraflar Açılış Mesajı (İpucu)"
          hint="Kutudan fotoğraflar fırlamadan önce alıcıya gösterilir (silerseniz yazı gösterilmez)"
        >
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input
              type="text"
              maxLength="90"
              placeholder="Örn: Birlikte biriktirdiğimiz en güzel anılarımız... 📸"
              value={gift.teasers?.photos ?? ''}
              onChange={(e) => updIn('teasers', { photos: e.target.value })}
            />
            {gift.teasers?.photos !== DEFAULT_TEASERS.photos && (
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                style={{ whiteSpace: 'nowrap' }}
                onClick={() => updIn('teasers', { photos: DEFAULT_TEASERS.photos })}
                title="Varsayılana döndür"
              >
                ↺ Sıfırla
              </button>
            )}
          </div>
        </Field>
      </div>

      <AnimatePresence>
        {drawOpen && (
          <DrawModal
            onSave={(item) => upd('photos', [...photos, item])}
            onClose={() => setDrawOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

/* ---------------- Adım 5: Mektup ---------------- */
export function StepLetter({ gift, upd, updIn }) {
  const l = gift.letter
  return (
    <div className="stack">
      <div className="two">
        <Field label="Alıcının adı"><input type="text" maxLength="30" placeholder="Sevgilim, Anne, Elif…" value={l.to} onChange={(e) => updIn('letter', { to: e.target.value })} /></Field>
        <Field label="Senin adın"><input type="text" maxLength="30" placeholder="Ahmet" value={gift.from} onChange={(e) => upd('from', e.target.value)} /></Field>
      </div>
      <Field label="Mektup başlığı"><input type="text" maxLength="50" placeholder="Seni özlüyorum…" value={l.title} onChange={(e) => updIn('letter', { title: e.target.value })} /></Field>
      <Field label="Mektup" hint={`${l.body.length}/1200`}>
        <textarea rows="7" maxLength="1200" placeholder="İçinden geldiği gibi yaz…" value={l.body} onChange={(e) => updIn('letter', { body: e.target.value })} className="handwritten" />
      </Field>
      <Field label="İmza"><input type="text" maxLength="40" placeholder="Seni seven, …" value={l.sign} onChange={(e) => updIn('letter', { sign: e.target.value })} /></Field>

      <div className="subpanel" style={{ marginTop: 10 }}>
        <Field
          label="🎁 Mektup Açılış Mesajı (İpucu)"
          hint="Kutudan mektup çıkmadan önce alıcıya gösterilir (silerseniz yazı gösterilmez)"
        >
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input
              type="text"
              maxLength="90"
              placeholder="Örn: Ve kalbimden dökülen en özel satırlar... 💌"
              value={gift.teasers?.letter ?? ''}
              onChange={(e) => updIn('teasers', { letter: e.target.value })}
            />
            {gift.teasers?.letter !== DEFAULT_TEASERS.letter && (
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                style={{ whiteSpace: 'nowrap' }}
                onClick={() => updIn('teasers', { letter: DEFAULT_TEASERS.letter })}
                title="Varsayılana döndür"
              >
                ↺ Sıfırla
              </button>
            )}
          </div>
        </Field>
      </div>

      <Switch on={l.secretOn} onChange={(v) => updIn('letter', { secretOn: v })} label="🤫 Gizli / Kazı-Kazan not" sub="Alıcı parmağıyla ya da fare ucuyla kazıyarak okur" />
      {l.secretOn && (
        <motion.div className="subpanel" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
          <Field label="Gizli not" hint={`${l.secret.length}/200`}>
            <textarea rows="3" maxLength="200" placeholder="Sadece kazıyanın göreceği küçük bir sır…" value={l.secret} onChange={(e) => updIn('letter', { secret: e.target.value })} />
          </Field>
        </motion.div>
      )}
    </div>
  )
}

/* ---------------- Adım 6: Müzik ---------------- */
export function StepMusic({ gift, updIn }) {
  const [playing, setPlaying] = useState(null)
  const m = gift.music
  const media = detectMedia(m.link)

  useEffect(
    () => () => {
      stopMusic()
    },
    [],
  )

  const select = (id) => {
    updIn('music', { preset: id })
    if (playing && playing !== id) toggle(null)
  }
  const toggle = async (id) => {
    if (!id || playing === id) {
      stopMusic()
      setPlaying(null)
      return
    }
    setMuted(false)
    await startMusic(id)
    setPlaying(id)
  }

  return (
    <div className="stack">
      <div className="cards cards-music">
        {MUSIC_PRESETS.map((p) => {
          const internal = !['none', 'link'].includes(p.id)
          return (
            <motion.div key={p.id} whileHover={{ y: -3 }} className={`card music-card ${m.preset === p.id ? 'selected' : ''}`}>
              <button type="button" className="music-main" onClick={() => select(p.id)} aria-pressed={m.preset === p.id}>
                <span className="music-emoji">{p.emoji}</span>
                <span className="card-title">{p.name}</span>
                <span className="card-sub">{p.blurb}</span>
              </button>
              {internal && (
                <button type="button" className={`play-btn ${playing === p.id ? 'on' : ''}`} onClick={() => toggle(p.id)} aria-label={playing === p.id ? 'Durdur' : 'Dinle'}>
                  {playing === p.id ? '■' : '▶'}
                </button>
              )}
            </motion.div>
          )
        })}
      </div>
      {m.preset === 'link' && (
        <motion.div className="subpanel" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
          <Field label="YouTube veya Spotify bağlantısı">
            <input type="url" inputMode="url" placeholder="https://www.youtube.com/watch?v=…  veya  https://open.spotify.com/track/…" value={m.link} onChange={(e) => updIn('music', { link: e.target.value })} />
          </Field>
          {m.link && (media ? <p className="note ok">✔ {media.kind === 'youtube' ? 'YouTube' : 'Spotify'} bağlantısı tanındı.</p> : <p className="note warn">Bağlantı tanınamadı. YouTube veya Spotify (track/playlist/album) linki yapıştır.</p>)}
          <p className="note small">YouTube arka planda otomatik çalar. Spotify tarayıcı kuralları gereği küçük oynatıcıda alıcının ▶ tuşuna basmasını gerektirir.</p>
        </motion.div>
      )}
    </div>
  )
}

/* ---------------- Adım 7: Paylaş ---------------- */
export function StepShare({ gift, upd, onTest }) {
  const [copied, setCopied] = useState(false)
  const inputRef = useRef(null)
  const link = useMemo(() => buildLink(gift), [gift])
  const len = link.length
  const level = len < 2500 ? 'good' : len < 9000 ? 'mid' : 'high'
  const pct = Math.min(100, (len / 12000) * 100)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link)
    } catch {
      inputRef.current?.select()
      document.execCommand('copy')
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2200)
  }
  const nativeShare = () => navigator.share?.({ title: 'Sürpriz!', text: 'Senin için bir sürprizim var 🎁', url: link }).catch(() => {})

  return (
    <div className="stack">
      <div className="share-hero">
        <h3>Hediyen hazır! 🎉</h3>
        <p>Tüm içerik linkin içine sıkıştırıldı — sunucu ya da hesap gerekmez.</p>
      </div>

      <div className="btn-row">
        <button type="button" className="btn btn-primary btn-lg" onClick={onTest}>
          🎬 Hediyeyi Canlı Test Et
        </button>
      </div>

      {/* QR Kod Kartı (İndirilebilir PNG + Kopyala + WhatsApp) */}
      <QRCodeCard
        link={link}
        to={gift.letter.to}
        onCopy={copy}
        copied={copied}
        shareUrl={shareUrl(link, gift.letter.to)}
      />

      <Field label="Doğrudan Paylaşım Bağlantısı">
        <div className="link-box">
          <input
            ref={inputRef}
            readOnly
            value={link}
            onFocus={(e) => e.target.select()}
            aria-label="Paylaşım bağlantısı"
          />
          <button type="button" className="btn btn-soft" onClick={copy}>
            {copied ? '✔ Kopyalandı' : '📋 Kopyala'}
          </button>
        </div>
      </Field>

      <div className={`meter ${level}`}>
        <div className="meter-bar"><i style={{ width: `${pct}%` }} /></div>
        <small>
          Link uzunluğu: {len.toLocaleString('tr-TR')} karakter —{' '}
          {level === 'good' ? 'harika, her yerde sorunsuz paylaşılır.' : level === 'mid' ? 'uzun ama çalışır; bazı uygulamalar linki satır sonunda kırabilir.' : 'çok uzun! Fotoğraf sayısını azaltmayı ya da URL ile eklemeyi dene.'}
        </small>
      </div>

      <div className="btn-row">
        {typeof navigator !== 'undefined' && navigator.share && (
          <button type="button" className="btn btn-soft" onClick={nativeShare}>
            📤 Diğer uygulamalarda paylaş
          </button>
        )}
        <a className="btn btn-ghost" href={link} target="_blank" rel="noopener noreferrer">
          ↗ Yeni sekmede aç
        </a>
      </div>

      <Field label="WhatsApp numaran (isteğe bağlı)" hint="Alıcı 'Teşekkür Et' butonuna basınca mesaj doğrudan sana gelir. Ülke koduyla yaz: 905551234567">
        <input type="tel" inputMode="tel" placeholder="905551234567" value={gift.phone} onChange={(e) => upd('phone', e.target.value.replace(/[^\d+\s]/g, ''))} />
      </Field>
      <p className="note small">⚠ Numara linkin içinde şifrelenmeden taşınır; yalnızca güvendiğin kişilerle paylaş. Boş bırakırsan alıcı WhatsApp’ta kişiyi kendi seçer.</p>
    </div>
  )
}
