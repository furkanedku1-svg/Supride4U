export const THANKS_MESSAGE = 'Hediyeni az önce açtım, harika bir sürpriz oldu, çok teşekkür ederim! 🥰'

const digits = (s = '') => s.replace(/\D/g, '')

// Alıcı → gönderen: numara varsa doğrudan sohbeti açar, yoksa kişi seçtirir.
export function thankYouUrl(phone) {
  const p = digits(phone)
  const text = encodeURIComponent(THANKS_MESSAGE)
  return p ? `https://wa.me/${p}?text=${text}` : `https://wa.me/?text=${text}`
}

// Gönderen → alıcı: bağlantıyı WhatsApp ile paylaş
export function shareUrl(link, to = '') {
  const text = `${to ? to + ', ' : ''}senin için küçük bir sürprizim var 🎁\nAçmak için dokun:\n${link}`
  return `https://wa.me/?text=${encodeURIComponent(text)}`
}
