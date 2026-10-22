import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { motion } from 'framer-motion'

export default function QRCodeCard({ link, to = '', themeAccent = '#e5548a', onCopy, copied, shareUrl }) {
  const [dataUrl, setDataUrl] = useState('')
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState(null)

  useEffect(() => {
    let active = true
    setLoading(true)
    setErrorMsg(null)
    setDataUrl('')

    // QR kod standart limiti: ~2.950 karakter (Version 40, Level L)
    // Eğer link bundan uzunsa QR kütüphanesi çöker ve oluşturamaz.
    if (!link) {
      setLoading(false)
      return
    }

    if (link.length > 2950) {
      setLoading(false)
      setErrorMsg(`Link boyutu (${link.length.toLocaleString('tr-TR')} karakter) QR kodun fiziksel veri sınırını (~2.900 karakter) aşıyor.`)
      return
    }

    // Yüksek çözünürlüklü (baskıya uygun 600x600) QR kod oluşturur. Kapasiteyi maksimize etmek için level 'L'
    QRCode.toDataURL(link, {
      width: 600,
      margin: 2,
      errorCorrectionLevel: 'L',
      color: {
        dark: '#2c1e28',
        light: '#ffffff',
      },
    })
      .then((url) => {
        if (active) {
          setDataUrl(url)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (active) {
          setErrorMsg(err?.message || 'QR kod oluşturulamadı')
          setLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [link])

  const handleDownload = () => {
    if (!dataUrl) return
    const a = document.createElement('a')
    a.href = dataUrl
    const safeTo = to ? `-${to.toLowerCase().replace(/[^a-z0-9]/g, '')}` : ''
    a.download = `suprise4u-hediye-karekod${safeTo}.png`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  return (
    <div className="qr-container glass">
      <div className="qr-badge">
        <span>📷 Fiziksel Hediye & Kart İçin</span>
      </div>

      <div className="qr-card">
        <div className="qr-frame">
          {loading ? (
            <div className="qr-skeleton">
              <span>⏳ QR Kod Üretiliyor…</span>
            </div>
          ) : dataUrl ? (
            <div className="qr-image-wrap">
              <img src={dataUrl} alt="Hediye QR Kodu" className="qr-image" />
              <div className="qr-center-icon">🎁</div>
            </div>
          ) : (
            <div className="qr-oversize-box">
              <div className="qr-oversize-icon">📏</div>
              <h4>QR Kod Kapasitesi Aşıldı</h4>
              <p className="qr-oversize-desc">
                QR kod standardı en fazla <strong>~2.900 karakter</strong> taşıyabilir (Linkiniz: <strong>{link?.length?.toLocaleString('tr-TR')} karakter</strong>).
              </p>
              <div className="qr-oversize-tip">
                💡 <strong>Karekod istiyorsan:</strong> Fotoğrafları doğrudan yüklemek yerine <em>görsel bağlantısı (URL)</em> olarak ekle veya fotoğraf sayısını azalt.
              </div>
            </div>
          )}
        </div>
        <p className="qr-caption">
          {errorMsg ? (
            'Endişelenmeyin! Bu hediye bağlantısı WhatsApp, Instagram veya SMS üzerinden doğrudan tıklandığında sorunsuz çalışır.'
          ) : to ? (
            <>
              <strong>{to}</strong> için hazırlanan dijital sürpriz kutusu
            </>
          ) : (
            'Kameranla tara veya çıktısını alıp hediyene iliştir'
          )}
        </p>
      </div>

      <div className="qr-actions">
        <button
          type="button"
          className="btn btn-primary qr-btn-download"
          onClick={handleDownload}
          disabled={!dataUrl}
          title="PNG formatında yüksek çözünürlüklü QR kod indir"
        >
          📥 QR Kodu İndir (.PNG)
        </button>

        {onCopy && (
          <button type="button" className="btn btn-soft" onClick={onCopy}>
            {copied ? '✔ Bağlantı Kopyalandı' : '📋 Bağlantıyı Kopyala'}
          </button>
        )}

        {shareUrl && (
          <a className="btn btn-wa" href={shareUrl} target="_blank" rel="noopener noreferrer">
            💬 WhatsApp ile Gönder
          </a>
        )}
      </div>
    </div>
  )
}
