import { useEffect, useRef } from 'react'
import { detectMedia } from '../lib/media'

// YouTube (gizli iframe, arka plan müziği) veya Spotify (küçük gömülü oynatıcı) bağlantısı.
export default function ExternalPlayer({ link, muted }) {
  const media = detectMedia(link)
  const frame = useRef(null)

  const post = (func) => {
    try {
      frame.current?.contentWindow?.postMessage(JSON.stringify({ event: 'command', func, args: '' }), '*')
    } catch {
      /* yoksay */
    }
  }

  useEffect(() => {
    if (media?.kind === 'youtube') post(muted ? 'mute' : 'unMute')
  }, [muted, media?.kind])

  if (!media) return null

  if (media.kind === 'youtube') {
    const src = `https://www.youtube-nocookie.com/embed/${media.id}?autoplay=1&loop=1&playlist=${media.id}&controls=0&playsinline=1&enablejsapi=1&modestbranding=1`
    return (
      <iframe
        ref={frame}
        className="yt-hidden"
        title="Arka plan müziği"
        src={src}
        allow="autoplay; encrypted-media"
        onLoad={() => setTimeout(() => post(muted ? 'mute' : 'unMute'), 600)}
      />
    )
  }

  if (muted) return null
  return (
    <div className="spotify-mini">
      <iframe
        title="Spotify oynatıcı"
        src={`https://open.spotify.com/embed/${media.type}/${media.id}?utm_source=generator&theme=0`}
        width="100%"
        height="80"
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      />
    </div>
  )
}
