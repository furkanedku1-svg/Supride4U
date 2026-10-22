import LZString from 'lz-string'
import { normalizeGift } from '../data/options.js'
import { getTemplateById } from '../data/photoTemplates.js'

/**
 * UTF-8 Destekli Güvenli Base64 Kodlama
 * Türkçe karakterleri (ç, ğ, ı, ö, ş, ü, İ vb.) ve emojileri hatasız btoa'ya aktarır.
 */
export function utf8ToBase64(str) {
  try {
    const bytes = new TextEncoder().encode(str)
    let binary = ''
    const len = bytes.byteLength
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    // URL-safe Base64: + yerine -, / yerine _ kullanırız
    return btoa(binary)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')
  } catch (err) {
    console.error('[Suprise4U Codec] UTF-8 to Base64 encode hatası:', err)
    // Fallback yöntemi
    const encoded = encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) =>
      String.fromCharCode(parseInt(p1, 16)),
    )
    return btoa(encoded).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  }
}

/**
 * UTF-8 Destekli Güvenli Base64 Çözümleme
 * WhatsApp veya sosyal medya uygulamalarının boşluğa dönüştürdüğü '+' karakterlerini,
 * eksik '=' paddinglerini ve URL-safe işaretlerini düzeltir.
 */
export function base64ToUtf8(str) {
  if (!str || typeof str !== 'string') return ''

  // 1. Önce olası URI encoded karakterleri temizle
  let clean = decodeURIComponent(str).trim()

  // 2. WhatsApp/mesajlaşma uygulamaları linkteki '+' işaretini boşluk ' ' yapabilir, geri çevir
  clean = clean.replace(/ /g, '+')

  // 3. URL-safe (- ve _) karakterleri standart Base64 (+ ve /) karakterlerine dönüştür
  clean = clean.replace(/-/g, '+').replace(/_/g, '/')

  // 4. Base64 4'ün katı olmalı; eksik padding '=' ekle
  while (clean.length % 4 !== 0) {
    clean += '='
  }

  try {
    const binary = atob(clean)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i)
    }
    return new TextDecoder().decode(bytes)
  } catch (err) {
    console.warn('[Suprise4U Codec] Standart atob başarısız, fallback deneniyor:', err)
    // Fallback çözümü
    const binary = atob(clean)
    return decodeURIComponent(
      Array.from(binary)
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    )
  }
}

/**
 * Hediye objesini URL için hazırlar ve hafifletir:
 * Hazır şablon fotoğrafları URL'de devasa taşımak yerine sadece tpl ID'si saklar.
 */
function prepareForUrl(gift) {
  if (!gift) return {}
  const safe = { ...gift }

  if (Array.isArray(safe.photos)) {
    safe.photos = safe.photos.map((p) => {
      if (p.tpl) {
        return { tpl: p.tpl, note: p.note || '' }
      }
      return p
    })
  }

  return safe
}

/**
 * URL'den çözülen hediye objesindeki hazır şablon fotoğrafları geri yükler.
 */
function restoreFromUrl(gift) {
  if (!gift) return gift
  if (Array.isArray(gift.photos)) {
    gift.photos = gift.photos.map((p) => {
      if (p && p.tpl) {
        const tpl = getTemplateById(p.tpl)
        if (tpl) {
          return {
            src: tpl.src,
            note: p.note || tpl.defaultNote || '',
            tpl: p.tpl,
          }
        }
      }
      return p
    })
  }
  return gift
}

/**
 * Hediye verisini JSON -> UTF-8 Güvenli Base64 formatına çevirir
 */
export function encodeGift(gift) {
  try {
    const prepared = prepareForUrl(gift)
    const jsonStr = JSON.stringify(prepared)
    return utf8ToBase64(jsonStr)
  } catch (err) {
    console.error('[Suprise4U Codec] encodeGift hatası:', err)
    // Geriye dönük uyumluluk için LZString yedek dene
    try {
      return LZString.compressToEncodedURIComponent(JSON.stringify(gift))
    } catch {
      return ''
    }
  }
}

/**
 * Linkten gelen payload'ı çözümler.
 * Sırasıyla Base64 (UTF-8), LZString ve doğrudan JSON denemesi yapar.
 */
export function decodeGift(payload) {
  if (!payload || typeof payload !== 'string') {
    console.warn('[Suprise4U Codec] decodeGift çağrıldı ancak payload boş veya geçersiz:', payload)
    return null
  }

  const raw = payload.trim().replace(/^[\/#]+/, '')

  // 1. Yöntem: UTF-8 Base64 (Yeni standart format #data=...)
  try {
    const jsonStr = base64ToUtf8(raw)
    if (jsonStr && jsonStr.trim().startsWith('{')) {
      const parsed = JSON.parse(jsonStr)
      return normalizeGift(restoreFromUrl(parsed))
    }
  } catch (err1) {
    console.warn('[Suprise4U Codec] Base64 çözümleme denemesi geçersiz:', err1.message)
  }

  // 2. Yöntem: LZ-String Decompress (Eski linkler ve #g=... desteği)
  try {
    const lzJson = LZString.decompressFromEncodedURIComponent(raw)
    if (lzJson && lzJson.trim().startsWith('{')) {
      const parsed = JSON.parse(lzJson)
      return normalizeGift(restoreFromUrl(parsed))
    }
  } catch (err2) {
    console.warn('[Suprise4U Codec] LZ-String çözümleme denemesi geçersiz:', err2.message)
  }

  // 3. Yöntem: URI Encoded Ham JSON Denemesi
  try {
    const decoded = decodeURIComponent(raw)
    if (decoded && decoded.trim().startsWith('{')) {
      const parsed = JSON.parse(decoded)
      return normalizeGift(restoreFromUrl(parsed))
    }
  } catch (err3) {
    console.warn('[Suprise4U Codec] Ham JSON çözümleme denemesi geçersiz:', err3.message)
  }

  console.error(
    '[Suprise4U Codec] Linkteki veri açılamadı! Veri bozulmuş veya eksik kopyalanmış olabilir. Alınan ham veri parçası:',
    raw.slice(0, 80),
  )
  return null
}

/**
 * Paylaşım linkini oluşturur.
 * GitHub Pages uyumlu olarak URL hash'ine (#data=...) yazar.
 */
export function buildLink(gift) {
  // Mevcut URL'in hash ve search kısımlarını temizleyerek temel adresi al
  const base = window.location.href.split('#')[0].split('?')[0]
  const encoded = encodeGift(gift)
  return `${base}#data=${encoded}`
}

/**
 * Sayfa açılışında linkteki veriyi okur ve doğrular:
 * - Hem #data= hem #g= destekler.
 * - Hem URL Hash (#...) hem de GitHub Pages yönlendirmelerindeki Query String (?...) destekler.
 */
export function readGiftFromHash() {
  const hash = window.location.hash || ''
  const search = window.location.search || ''

  try {
    // 1. Hash parametrelerinde data= veya g= ara (#data=... veya #g=...)
    const hashMatch = hash.match(/[#&](?:data|g)=([^&]+)/)
    if (hashMatch && hashMatch[1]) {
      const gift = decodeGift(hashMatch[1])
      return { present: true, gift }
    }

    // 2. GitHub Pages alt dizinlerinde veya yönlendirmelerinde Query string ara (?data=... veya ?g=...)
    const searchMatch = search.match(/[?&](?:data|g)=([^&]+)/)
    if (searchMatch && searchMatch[1]) {
      const gift = decodeGift(searchMatch[1])
      return { present: true, gift }
    }

    // 3. Hash doğrudan veri içeriyorsa (#...)
    if (hash.startsWith('#') && hash.length > 25 && !hash.includes('&') && !hash.includes('=')) {
      const payload = hash.slice(1)
      const gift = decodeGift(payload)
      if (gift) return { present: true, gift }
    }
  } catch (err) {
    console.error('[Suprise4U Codec] readGiftFromHash beklenmedik hata:', err)
  }

  // Linkte hediye parametresi yoksa hediye oluşturucu (builder) modunu aç
  return { present: false, gift: null }
}
