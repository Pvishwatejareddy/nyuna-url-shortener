import toast from 'react-hot-toast'

export default function UrlCard({ urlData, onViewAnalytics, onLinkOpened }) {
  const shortUrl = `http://localhost:8000/${urlData.short_code}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl)
    toast.success('Copied to clipboard!')
  }

  const openShortUrl = () => {
  window.open(shortUrl, '_blank')
  if (onLinkOpened) onLinkOpened()
}


  const displayUrl = urlData.original_url.length > 55
    ? urlData.original_url.substring(0, 55) + '...'
    : urlData.original_url

  return (
    <div className="url-result-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '3px' }}>
            Original URL
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text-white)', opacity: 0.75 }}>
            {displayUrl}
          </div>
        </div>
        <div style={{
          background: 'rgba(201,168,76,0.1)',
          border: '1px solid var(--border-gold)',
          borderRadius: '8px',
          padding: '4px 10px',
          fontSize: '11px',
          color: 'var(--gold)',
          fontWeight: '600',
          marginLeft: '12px',
          whiteSpace: 'nowrap'
        }}>
          /{urlData.short_code}
        </div>
      </div>

      <div style={{
        background: 'var(--navy-light)',
        border: '1px solid var(--border-gold)',
        borderRadius: '10px',
        padding: '12px 16px',
        marginBottom: '14px'
      }}>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '3px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Short URL
        </div>
        <div style={{ fontSize: '17px', fontWeight: '700', color: 'var(--gold)', cursor: 'pointer' }}
          onClick={openShortUrl}>
          {shortUrl}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <button className="btn-secondary" style={{ flex: 1 }} onClick={copyToClipboard}>
          📋 Copy
        </button>
       <button className="btn-secondary" style={{ flex: 1 }} onClick={openShortUrl}>
  🌐 Open
</button>
        <button className="btn-gold-outline" style={{ flex: 1 }} onClick={() => onViewAnalytics(urlData.short_code)}>
          📊 Analytics
        </button>
      </div>

      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '10px', textAlign: 'right' }}>
        {new Date(urlData.created_at).toLocaleString()}
      </div>
    </div>
  )
}