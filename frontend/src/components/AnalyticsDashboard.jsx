import { useState, useEffect } from 'react'
import { getAnalytics } from '../api'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function AnalyticsDashboard({ shortCode, onClose }) {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await getAnalytics(shortCode)
        setAnalytics(data)
      } catch (error) {
        console.error('Error:', error)
      }
      setLoading(false)
    }
    fetchAnalytics()
  }, [shortCode])

  if (loading) return (
    <div className="navy-card" style={{ textAlign: 'center', padding: '40px', marginBottom: '20px' }}>
      <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Loading analytics... ⏳</div>
    </div>
  )

  if (!analytics) return null

  const clicksByHour = {}
  analytics.clicks.forEach(click => {
    const hour = new Date(click.clicked_at).getHours()
    const label = `${hour}:00`
    clicksByHour[label] = (clicksByHour[label] || 0) + 1
  })
  const chartData = Object.entries(clicksByHour).map(([hour, clicks]) => ({ hour, clicks }))

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: 'var(--navy-card)',
          border: '1px solid var(--border-gold)',
          borderRadius: '10px',
          padding: '10px 14px',
          fontSize: '13px',
          color: 'var(--text-white)'
        }}>
          <div style={{ color: 'var(--gold)', fontWeight: '700' }}>{payload[0].value} clicks</div>
          <div style={{ color: 'var(--text-muted)' }}>{payload[0].payload.hour}</div>
        </div>
      )
    }
    return null
  }

  return (
    <div className="navy-card" style={{ marginBottom: '24px' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-white)', marginBottom: '3px' }}>
            📊 Analytics
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Short code:{' '}
            <span style={{ color: 'var(--gold)', fontWeight: '700' }}>/{shortCode}</span>
          </div>
        </div>
        <button onClick={onClose} style={{
          background: 'var(--navy-light)',
          border: '1px solid var(--border-gold)',
          color: 'var(--text-muted)',
          width: '32px', height: '32px',
          borderRadius: '50%',
          cursor: 'pointer',
          fontSize: '14px',
          transition: 'all 0.2s'
        }}>✕</button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px', marginBottom: '20px' }}>
        {[
          { num: analytics.total_clicks, label: 'Total Clicks' },
          { num: `/${shortCode}`, label: 'Short Code' },
          {
            num: analytics.clicks.length > 0
              ? new Date(analytics.clicks[analytics.clicks.length - 1].clicked_at).toLocaleDateString()
              : 'N/A',
            label: 'Last Click'
          }
        ].map((s, i) => (
          <div key={i} style={{
            background: 'var(--navy-light)',
            border: '1px solid var(--border-gold)',
            borderRadius: '12px',
            padding: '14px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: i === 0 ? '28px' : '16px', fontWeight: '800', color: 'var(--gold)', animation: 'countUp 0.6s ease both' }}>
              {s.num}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Original URL */}
      <div style={{
        background: 'var(--navy-light)',
        border: '1px solid var(--border-gold)',
        borderRadius: '10px',
        padding: '12px 16px',
        marginBottom: '20px'
      }}>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>
          Original URL
        </div>
        <div style={{ fontSize: '13px', color: 'var(--text-white)', wordBreak: 'break-all' }}>
          {analytics.original_url}
        </div>
      </div>

      {/* Chart */}
      {chartData.length > 0 ? (
        <div>
          <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '14px' }}>
            Clicks by Hour
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(201,168,76,0.1)" />
              <XAxis dataKey="hour" tick={{ fill: '#7a90b4', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#7a90b4', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="clicks" fill="url(#goldGradient)" radius={[6, 6, 0, 0]}>
                <defs>
                  <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#e8c96d" />
                    <stop offset="100%" stopColor="#8a6f2e" />
                  </linearGradient>
                </defs>
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div style={{
          textAlign: 'center',
          padding: '30px',
          background: 'var(--navy-light)',
          borderRadius: '12px',
          border: '1px solid var(--border-gold)'
        }}>
          <div style={{ fontSize: '36px', marginBottom: '10px' }}>🚀</div>
          <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-white)', marginBottom: '6px' }}>
            No clicks yet!
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Share your short URL to start tracking clicks
          </div>
        </div>
      )}
    </div>
  )
}