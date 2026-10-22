import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary yakaladı:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="broken">
          <div className="broken-card glass">
            <div className="broken-emoji">⚠️</div>
            <h2>Hediye yüklenirken bir sorun oluştu</h2>
            <p style={{ color: 'var(--ink-soft, #666)', fontSize: '0.95rem' }}>
              Beklenmeyen bir arayüz hatası meydana geldi. Aşağıdaki butonlarla deneyimi kurtarabilirsiniz:
            </p>

            {this.state.error?.message && (
              <div
                style={{
                  background: 'rgba(0,0,0,0.06)',
                  padding: '8px 14px',
                  borderRadius: '10px',
                  fontFamily: 'monospace',
                  fontSize: '0.8rem',
                  color: '#c0392b',
                  maxWidth: '100%',
                  wordBreak: 'break-word',
                  textAlign: 'left',
                }}
              >
                Hata: {this.state.error.message}
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '10px' }}>
              <button type="button" className="btn btn-primary" onClick={this.handleReset}>
                🔄 Yeniden Dene
              </button>
              {this.props.onFallback && (
                <button type="button" className="btn btn-soft" onClick={this.props.onFallback}>
                  🎁 Örnek Hediye ile Aç
                </button>
              )}
              <a className="btn btn-ghost" href={window.location.href.split('#')[0]}>
                ✍️ Oluşturucuya Dön
              </a>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
