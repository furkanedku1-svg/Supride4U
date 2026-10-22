// YouTube / Spotify bağlantı çözümleyiciler + tarih yardımcıları

export function parseYouTube(url = '') {
  const u = url.trim()
  if (!u) return null
  const m =
    u.match(/youtu\.be\/([\w-]{11})/) ||
    u.match(/[?&]v=([\w-]{11})/) ||
    u.match(/youtube(?:-nocookie)?\.com\/(?:embed|shorts|live)\/([\w-]{11})/)
  return m ? m[1] : null
}

export function parseSpotify(url = '') {
  const m = url.trim().match(/open\.spotify\.com\/(?:intl-[a-z]+\/)?(track|album|playlist|episode|show|artist)\/([A-Za-z0-9]+)/)
  return m ? { type: m[1], id: m[2] } : null
}

export function detectMedia(url = '') {
  const yt = parseYouTube(url)
  if (yt) return { kind: 'youtube', id: yt }
  const sp = parseSpotify(url)
  if (sp) return { kind: 'spotify', ...sp }
  return null
}

export function formatDateTR(ts) {
  try {
    return new Intl.DateTimeFormat('tr-TR', { dateStyle: 'long', timeStyle: 'short' }).format(new Date(ts))
  } catch {
    return new Date(ts).toLocaleString()
  }
}

// datetime-local ("2026-12-31T20:00") → epoch ms (yerel saat)
export function lockTimestamp(lock) {
  if (!lock?.on || !lock.at) return null
  const t = new Date(lock.at).getTime()
  return Number.isFinite(t) ? t : null
}

export function splitCountdown(ms) {
  const s = Math.max(0, Math.floor(ms / 1000))
  return {
    d: Math.floor(s / 86400),
    h: Math.floor((s % 86400) / 3600),
    m: Math.floor((s % 3600) / 60),
    s: s % 60,
  }
}
