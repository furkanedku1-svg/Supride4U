import { useState } from 'react'

// Polaroid çerçeve: fotoğraf + el yazısı not. Genişlik CSS değişkeni (--pw) ile ölçeklenir.
export default function Polaroid({ photo, rotate = 0, tape = true, className = '', style, draggable = false }) {
  const [failed, setFailed] = useState(false)
  return (
    <figure className={`polaroid ${className}`} style={{ transform: `rotate(${rotate}deg)`, ...style }}>
      {tape && <span className="polaroid-tape" aria-hidden="true" />}
      <div className="polaroid-img">
        {photo?.src && !failed ? (
          <img src={photo.src} alt={photo.note || 'Anı fotoğrafı'} draggable={draggable} onError={() => setFailed(true)} />
        ) : (
          <div className="polaroid-fallback" aria-hidden="true">📷</div>
        )}
      </div>
      <figcaption className="polaroid-note">{photo?.note || '\u00A0'}</figcaption>
    </figure>
  )
}
