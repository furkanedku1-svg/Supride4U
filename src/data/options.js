export const FLOWERS = [
  { id: 'rose', name: 'Gül Buketi', blurb: 'Lüks tüllü taze güller & cipsolar' },
  { id: 'daisy', name: 'Papatya Buketi', blurb: 'Tül sarımlı saf kır papatyaları' },
  { id: 'tulip', name: 'Lale Buketi', blurb: 'Zarif bahar laleleri & fiyonk' },
  { id: 'lavender', name: 'Lavanta Buketi', blurb: 'Huzur kokan mor lavanta demeti' },
  { id: 'sunflower', name: 'Ayçiçeği Buketi', blurb: 'Güneş gibi sıcak & tüllü buket' },
  { id: 'orchid', name: 'Saksıda Mor Orkide', blurb: 'Özel seramik saksısında asil ve zarif' },
]

export const FLOWER_VARIANTS = {
  rose: [
    { id: 'red', name: 'Kırmızı', emoji: '🌹', previewBg: '#d6223a', title: 'Klasik Aşk Kırmızısı' },
    { id: 'blue', name: 'Mavi', emoji: '💙', previewBg: '#1b3b82', title: 'Gece Mavisi' },
    { id: 'white', name: 'Beyaz', emoji: '🤍', previewBg: '#ffffff', border: '1px solid rgba(0,0,0,0.18)', title: 'Kuğu Beyazı' },
    { id: 'pink', name: 'Pembe', emoji: '🌸', previewBg: '#f57fa2', title: 'Pudra Pembe' },
    { id: 'mix', name: 'Rengarenk', emoji: '🎨', previewBg: 'linear-gradient(135deg, #d6223a 25%, #1b3b82 50%, #f57fa2 75%, #ffffff 100%)', border: '1px solid rgba(0,0,0,0.12)', title: 'Rengarenk Karışık' },
  ],
}

export const MUSIC_PRESETS = [
  { id: 'none', name: 'Müzik yok', emoji: '🔇', blurb: 'Sessiz deneyim' },
  { id: 'lofi', name: 'Lo-fi Sabah', emoji: '☕', blurb: 'Yumuşak piyano, hafif vinil çıtırtısı' },
  { id: 'acoustic', name: 'Akustik Gitar', emoji: '🎸', blurb: 'Parmak tekniğiyle sıcak melodi' },
  { id: 'musicbox', name: 'Müzik Kutusu', emoji: '🎠', blurb: 'Nostaljik ninni tınısı' },
  { id: 'piano', name: 'Romantik Piyano', emoji: '🎹', blurb: 'Yavaş, duygusal arpejler' },
  { id: 'link', name: 'YouTube / Spotify', emoji: '🔗', blurb: 'Kendi şarkını bağlantıyla ekle' },
]

export const PLUSHIERS = [
  { id: 'bear', name: 'Ayıcık', emoji: '🧸', blurb: 'Yumuşacık, sıcacık sarılmalık klasik ayı' },
  { id: 'rabbit', name: 'Tavşan', emoji: '🐰', blurb: 'Uzun kulaklı, sevimli pofuduk tavşan' },
  { id: 'cat', name: 'Kedi', emoji: '🐱', blurb: 'Pati dostu tatlı mı tatlı minik kedi' },
  { id: 'dog', name: 'Köpek', emoji: '🐶', blurb: 'Sadık, neşeli ve sevimli fularlı köpekçik' },
  { id: 'elephant', name: 'Fil', emoji: '🐘', blurb: 'Şans getiren koca kulaklı minik fil' },
  { id: 'penguin', name: 'Penguen', emoji: '🐧', blurb: 'Papyonlu, tatlı paytak yürüyüşlü penguen' },
  { id: 'lamb', name: 'Kuzu', emoji: '🐑', blurb: 'Pamuk gibi kıvırcık tüylü çıngıraklı kuzu' },
]

export const PLUSH_COLORABLE_TYPES = ['bear', 'rabbit', 'cat', 'dog', 'lamb']

export const PLUSH_VARIANTS = [
  { id: 'classic', name: 'Klasik', emoji: '🧸', previewBg: '#b57a48', title: 'Orijinal Peluş Rengi' },
  { id: 'pink', name: 'Pembe', emoji: '🌸', previewBg: '#f472b6', title: 'Pudra Pembe' },
  { id: 'blue', name: 'Mavi', emoji: '💙', previewBg: '#60a5fa', title: 'Bebek Mavisi' },
  { id: 'white', name: 'Beyaz', emoji: '🤍', previewBg: '#ffffff', border: '1px solid rgba(0,0,0,0.18)', title: 'Kuğu Beyazı' },
  { id: 'red', name: 'Kırmızı', emoji: '🌹', previewBg: '#e11d48', title: 'Aşk Kırmızısı' },
  { id: 'purple', name: 'Lila', emoji: '💜', previewBg: '#c084fc', title: 'Lavanta Moru' },
]

export const DEFAULT_TEASERS = {
  flower: 'Senin için taptaze çiçekler topladım... 🌸',
  plush: 'Sana sıcacık sarılacak bir dost... 🧸',
  photos: 'Birlikte biriktirdiğimiz en güzel anılarımız... 📸',
  letter: 'Ve kalbimden dökülen en özel satırlar... 💌',
}

export const DEFAULT_GIFT = {
  v: 1,
  theme: 'rose',
  birthday: { on: false, age: 25, message: 'İyi ki doğdun! Yeni yaşın sana mutluluk getirsin 🎂', blow: 'mic' },
  lock: { on: false, at: '' }, // ISO yerel tarih-saat (datetime-local)
  flower: 'rose',
  flowerColor: 'red',
  plush: { on: false, type: 'bear', color: 'classic' },
  photos: [], // { src, note }
  letter: { to: '', title: '', body: '', sign: '', secretOn: false, secret: '' },
  music: { preset: 'lofi', link: '' },
  phone: '',
  from: '',
  teasers: { ...DEFAULT_TEASERS },
}

export const SAMPLE_MOCK_GIFT = {
  v: 1,
  theme: 'rose',
  birthday: { on: true, age: 25, message: 'İyi ki doğdun! Yeni yaşın sana mutluluk ve huzur getirsin 🎂', blow: 'tap' },
  lock: { on: false, at: '' },
  flower: 'rose',
  flowerColor: 'red',
  plush: { on: true, type: 'bear', color: 'classic' },
  photos: [
    { src: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=500&auto=format&fit=crop&q=60', note: 'Unutulmaz anılar ✨' },
    { src: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=500&auto=format&fit=crop&q=60', note: 'Gülüşün gibi güzel 🌸' },
    { src: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=500&auto=format&fit=crop&q=60', note: 'Daima birlikte 🎉' },
  ],
  letter: {
    to: 'Sevgilim',
    title: 'Sana Özel Küçük Bir Sürpriz',
    body: 'Mesafeler sadece sayılardan ibarettir; kalbim ve en güzel anılarım her zaman seninle. Hayatımda olduğun için çok şanslıyım. Seni çok seviyorum ❤️',
    sign: 'Daima seninle',
    secretOn: true,
    secret: 'Seni her gün biraz daha çok özlüyorum ve seviyorum 🥰',
  },
  music: { preset: 'lofi', link: '' },
  phone: '',
  from: 'Bir Dost',
  teasers: { ...DEFAULT_TEASERS },
}

// Eksik alanları varsayılanlerle birleştirir (eski/yarım linklere dayanıklılık).
export function normalizeGift(raw) {
  if (!raw || typeof raw !== 'object') {
    return { ...DEFAULT_GIFT }
  }
  const d = DEFAULT_GIFT
  const g = raw
  return {
    ...d,
    ...g,
    theme: typeof g.theme === 'string' && g.theme ? g.theme : d.theme,
    flower: typeof g.flower === 'string' && g.flower ? g.flower : d.flower,
    flowerColor: typeof g.flowerColor === 'string' && g.flowerColor ? g.flowerColor : d.flowerColor,
    plush: {
      on: typeof g.plush === 'object' && g.plush ? Boolean(g.plush.on) : false,
      type:
        typeof g.plush === 'object' && g.plush?.type && PLUSHIERS.some((p) => p.id === g.plush.type)
          ? g.plush.type
          : d.plush.type,
      color:
        typeof g.plush === 'object' && g.plush?.color && PLUSH_VARIANTS.some((v) => v.id === g.plush.color)
          ? g.plush.color
          : 'classic',
    },
    birthday: {
      ...d.birthday,
      ...(typeof g.birthday === 'object' && g.birthday ? g.birthday : {}),
    },
    lock: {
      ...d.lock,
      ...(typeof g.lock === 'object' && g.lock ? g.lock : {}),
    },
    letter: {
      ...d.letter,
      ...(typeof g.letter === 'object' && g.letter ? g.letter : {}),
    },
    music: {
      ...d.music,
      ...(typeof g.music === 'object' && g.music ? g.music : {}),
    },
    photos: Array.isArray(g.photos)
      ? g.photos.filter((p) => p && typeof p === 'object' && p.src)
      : [],
    teasers: {
      flower: typeof g.teasers?.flower === 'string' ? g.teasers.flower : DEFAULT_TEASERS.flower,
      plush: typeof g.teasers?.plush === 'string' ? g.teasers.plush : DEFAULT_TEASERS.plush,
      photos: typeof g.teasers?.photos === 'string' ? g.teasers.photos : DEFAULT_TEASERS.photos,
      letter: typeof g.teasers?.letter === 'string' ? g.teasers.letter : DEFAULT_TEASERS.letter,
    },
  }
}
