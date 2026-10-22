import { useEffect, useState } from 'react'
import Builder from './builder/Builder'
import Experience from './experience/Experience'
import ErrorBoundary from './components/ErrorBoundary'
import { readGiftFromHash } from './lib/codec'
import { SAMPLE_MOCK_GIFT } from './data/options'

// Hash'te #g=... varsa alıcı deneyimi, yoksa hediye oluşturucu açılır.
export default function App() {
  const [route, setRoute] = useState(readGiftFromHash)

  useEffect(() => {
    const on = () => setRoute(readGiftFromHash())
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])

  useEffect(() => {
    document.title = route.present ? 'Sana özel bir sürpriz var 🎁' : 'Suprise4U · Sevdiklerine Dijital Sürpriz Hediye Kutusu'
  }, [route.present])

  if (!route.present) return <Builder />

  if (!route.gift) {
    return (
      <div className="broken">
        <div className="broken-card glass">
          <div className="broken-emoji">🥺</div>
          <h1>Bu bağlantı açılamadı</h1>
          <p>Link eksik kopyalanmış ya da bozulmuş olabilir. Gönderenden linki tekrar göndermesini isteyebilir veya örnek hediyeyi açabilirsiniz.</p>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setRoute({ present: true, gift: SAMPLE_MOCK_GIFT })}
            >
              🎁 Örnek Hediyeyi Aç
            </button>
            <a className="btn btn-ghost" href={window.location.href.split('#')[0]}>
              Kendi hediyemi hazırla
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary onFallback={() => setRoute({ present: true, gift: SAMPLE_MOCK_GIFT })}>
      <Experience key={window.location.hash} gift={route.gift} />
    </ErrorBoundary>
  )
}
