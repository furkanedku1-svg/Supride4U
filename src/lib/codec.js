import LZString from 'lz-string'
import { normalizeGift } from '../data/options'

// Tüm hediye verisi → JSON → LZ-string (URL güvenli) → #g=... şeklinde hash'e yazılır. Sunucu/DB gerekmez.
export function encodeGift(gift) {
  const json = JSON.stringify(gift)
  return LZString.compressToEncodedURIComponent(json)
}

export function decodeGift(payload) {
  try {
    const json = LZString.decompressFromEncodedURIComponent(payload)
    if (!json) return null
    return normalizeGift(JSON.parse(json))
  } catch {
    return null
  }
}

export function buildLink(gift) {
  const base = window.location.href.split('#')[0]
  return `${base}#g=${encodeGift(gift)}`
}

export function readGiftFromHash() {
  const m = window.location.hash.match(/^#g=(.+)$/)
  if (!m) return { present: false, gift: null }
  return { present: true, gift: decodeGift(m[1]) }
}
