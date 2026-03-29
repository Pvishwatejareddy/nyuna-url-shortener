import { useState } from 'react'
import { shortenURL } from '../api'
import toast from 'react-hot-toast'

export default function ShortenForm({ onNewUrl }) {
  const [longUrl, setLongUrl] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!longUrl) {
      toast.error('Please enter a URL!')
      return
    }

    let urlToShorten = longUrl
    if (!longUrl.startsWith('http://') && !longUrl.startsWith('https://')) {
      urlToShorten = 'https://' + longUrl
    }

    setLoading(true)
    try {
      const result = await shortenURL(urlToShorten)
      toast.success('URL shortened successfully!')
      onNewUrl(result)
      setLongUrl('')
    } catch (error) {
      toast.error('Something went wrong! Is the backend running?')
    }
    setLoading(false)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    <div className="navy-card" style={{ marginBottom: '24px' }}>
      <div style={{
        fontSize: '12px',
        fontWeight: '700',
        color: 'var(--gold)',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        marginBottom: '6px'
      }}>
        Shorten a URL
      </div>
      <div style={{
        fontSize: '13px',
        color: 'var(--text-muted)',
        marginBottom: '16px'
      }}>
        Paste any long URL and get a short link with analytics tracking
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        <input
          className="url-input"
          type="text"
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="https://your-very-long-url.com/paste/here..."
        />
        <button
          className="btn-gold"
          onClick={handleSubmit}
          disabled={loading}
          style={{ opacity: loading ? 0.7 : 1 }}
        >
          {loading ? '⏳ Shortening...' : '⚡ Shorten!'}
        </button>
      </div>

     
    </div>
  )
}