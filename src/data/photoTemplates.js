// Hazır Anı Şablonları (URL boyutunu minimal tutmak için hazır asset ID'leri)
export const PHOTO_TEMPLATES = [
  {
    id: 'tpl_cake',
    name: 'Doğum Günü Pastası',
    emoji: '🎂',
    src: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?w=450&auto=format&fit=crop&q=75',
    defaultNote: 'İyi ki doğdun! 🎂',
  },
  {
    id: 'tpl_party',
    name: 'Kutlama & Parti',
    emoji: '🎉',
    src: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=450&auto=format&fit=crop&q=75',
    defaultNote: 'Nice mutlu yaşlara! 🎉',
  },
  {
    id: 'tpl_love',
    name: 'Kalpler & Sevgi',
    emoji: '❤️',
    src: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=450&auto=format&fit=crop&q=75',
    defaultNote: 'Seni çok seviyorum ❤️',
  },
  {
    id: 'tpl_friends',
    name: 'Dostluk & Birlikte',
    emoji: '👭',
    src: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=450&auto=format&fit=crop&q=75',
    defaultNote: 'Daima birlikte ✨',
  },
  {
    id: 'tpl_sparkler',
    name: 'Işıltılı Anlar',
    emoji: '✨',
    src: 'https://images.unsplash.com/photo-1531747056595-07f6cbbe10ad?w=450&auto=format&fit=crop&q=75',
    defaultNote: 'Gözlerindeki ışıltı ✨',
  },
  {
    id: 'tpl_flowers',
    name: 'Bahar Çiçekleri',
    emoji: '🌸',
    src: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=450&auto=format&fit=crop&q=75',
    defaultNote: 'Gülüşün gibi taze 🌸',
  },
  {
    id: 'tpl_sunset',
    name: 'Huzurlu Günbatımı',
    emoji: '🌅',
    src: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=450&auto=format&fit=crop&q=75',
    defaultNote: 'Her anın kıymetli 🌅',
  },
  {
    id: 'tpl_coffee',
    name: 'Sıcak Bir Kahve',
    emoji: '☕',
    src: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=450&auto=format&fit=crop&q=75',
    defaultNote: 'Sımsıcak anılar ☕',
  },
]

export function getTemplateById(id) {
  return PHOTO_TEMPLATES.find((t) => t.id === id) || null
}
