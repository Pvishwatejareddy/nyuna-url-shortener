import { useState, useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import ShortenForm from './components/ShortenForm'
import UrlCard from './components/UrlCard'
import AnalyticsDashboard from './components/AnalyticsDashboard'

export default function App() {
  const [urls, setUrls] = useState([])
  const [selectedCode, setSelectedCode] = useState(null)
  const [isDark, setIsDark] = useState(true)
  const [totalClicks, setTotalClicks] = useState(0)

  useEffect(() => {
    if (!isDark) {
      document.body.classList.add('light-mode')
    } else {
      document.body.classList.remove('light-mode')
    }
  }, [isDark])

  const handleNewUrl = (urlData) => {
    setUrls([urlData, ...urls])
  }

  const handleClickRecorded = () => {
    setTotalClicks(prev => prev + 1)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--navy)', transition: 'background 0.4s' }}>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--navy-card)',
            color: 'var(--text-white)',
            border: '1px solid var(--border-gold)',
            borderRadius: '12px',
          },
          success: { iconTheme: { primary: '#c9a84c', secondary: '#0a1628' } },
          error: { iconTheme: { primary: '#e24b4a', secondary: '#0a1628' } },
        }}
      />

      {/* Navbar */}
      <nav style={{
        background: 'var(--navy-mid)',
        borderBottom: '1px solid var(--border-gold)',
        padding: '14px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }} className="fade-in">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
  width: '38px', height: '38px',
  background: 'linear-gradient(135deg, var(--gold), var(--gold-light))',
  borderRadius: '10px',
  display: 'flex', alignItems: 'center',
  justifyContent: 'center',
  fontSize: '20px',
  fontWeight: '900',
  color: 'var(--navy)',
  fontFamily: 'Georgia, serif',
  letterSpacing: '-1px'
}}>Ñ</div>
          <div>
            <div style={{ fontSize: '20px', fontWeight: '800', color: 'var(--gold)', letterSpacing: '-0.3px' }}>
  Nyūna
</div>
<div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
  URL Shortener
</div>
          </div>
        </div>
        <button className="theme-toggle" onClick={() => setIsDark(!isDark)}>
          {isDark ? '☀ Light Mode' : '🌙 Dark Mode'}
        </button>
      </nav>

      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '40px 32px 28px' }} className="fade-in-1">
        <h1 style={{ fontSize: '36px', fontWeight: '800', marginBottom: '10px', color: 'var(--text-white)' }}>
          Shorten. Share.{' '}
          <span className="gold-shimmer">Track.</span>
        </h1>
        <p style={{ fontSize: '15px', color: 'var(--text-muted)' }}>
          Production-grade URL shortener with Redis caching and real-time analytics
        </p>
      </div>

      {/* Stats Row */}
      <div style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '12px',
  padding: '0 32px 28px',
  maxWidth: '800px',
  margin: '0 auto'
}} className="fade-in-2">
  <div className="stat-card">
    <div className="stat-number">{urls.length}</div>
    <div className="stat-label">URLs Shortened</div>
  </div>
  <div className="stat-card">
    <div className="stat-number">{totalClicks}</div>
    <div className="stat-label">Total Clicks Tracked</div>
  </div>
  <div className="stat-card">
    <div className="stat-number" style={{ fontSize: '18px', color: 'var(--gold)' }}>
      Active ✓
    </div>
    <div className="stat-label">Service Status</div>
  </div>
</div>

      {/* Main content */}
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 32px 40px' }}>

        {/* Shorten Form */}
        <div className="fade-in-3">
          <ShortenForm onNewUrl={handleNewUrl} />
        </div>

        {/* Analytics */}
        {selectedCode && (
          <AnalyticsDashboard
            shortCode={selectedCode}
            onClose={() => setSelectedCode(null)}
            onClickRecorded={handleClickRecorded}
          />
        )}

        {/* URL Cards */}
        {urls.length > 0 && (
          <div className="fade-in-4">
            <div style={{
              fontSize: '13px',
              fontWeight: '600',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '14px'
            }}>
              Your shortened URLs ({urls.length})
            </div>
            {urls.map((url) => (
  <UrlCard
    key={url.id}
    urlData={url}
    onViewAnalytics={setSelectedCode}
    onLinkOpened={() => setTotalClicks(prev => prev + 1)}
  />
))}
          </div>
        )}

        {/* Empty state */}
        {urls.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0' }} className="fade-in-4">
            <div style={{ fontSize: '56px', marginBottom: '16px' }}>🔗</div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-white)', marginBottom: '8px' }}>
              Ready to shorten your first URL?
            </div>
            <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
              Paste any long URL above and get a short link instantly
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{
  textAlign: 'center',
  padding: '20px',
  borderTop: '1px solid var(--border-gold)',
  fontSize: '12px',
  color: 'var(--text-muted)'
}}>
  <div style={{ marginBottom: '6px', fontSize: '13px', fontWeight: '700', color: 'var(--gold)' }}>
    Designed & Built by P. Vishwa Teja
  </div>
  <div>
    Powered by{' '}
    <span style={{ color: 'var(--gold)' }}>FastAPI</span> +{' '}
    <span style={{ color: 'var(--gold)' }}>Redis</span> +{' '}
    <span style={{ color: 'var(--gold)' }}>PostgreSQL</span> +{' '}
    <span style={{ color: 'var(--gold)' }}>React</span> ⚡
  </div>
</div>
    </div>
  )
}