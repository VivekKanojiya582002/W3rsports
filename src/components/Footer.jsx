import { useState, useEffect } from 'react'

function Footer() {
  const [email, setEmail] = useState('')
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const categories = ['Cricket', 'Football', 'Motorsports', 'Tennis', 'Basketball']
  const legal = ['Contact Us', 'Privacy Policy', 'Terms of Service', 'Cookie Policy']
  const socials = ['𝕏', '📸', '▶️', '♪', '👤']

  return (
    <footer style={{ background: 'var(--bg-nav)', borderTop: '1px solid var(--border)' }}>

      {/* Newsletter Bar */}
      <div style={{
        borderBottom: '1px solid var(--border)',
        padding: '20px 16px',
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'stretch' : 'center',
        justifyContent: 'space-between',
        gap: 12,
      }}>
        <p style={{
          color: 'var(--text-muted)',
          fontSize: 13,
          margin: 0,
        }}>
          Get the latest sports news and live updates delivered to your inbox
        </p>

        <div style={{ display: 'flex', gap: 8 }}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: '10px 14px',
              color: 'var(--text-primary)',
              fontSize: 13,
              flex: 1,
              minWidth: 0,
              outline: 'none',
            }}
          />
          <button style={{
            background: 'var(--accent)',
            color: '#000',
            border: 'none',
            borderRadius: 8,
            padding: '10px 16px',
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}>
            Subscribe
          </button>
        </div>
      </div>

      {/* Footer Links */}
      <div style={{
        padding: '24px 16px',
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr 1fr' : '2fr 1fr 1fr 1fr',
        gap: isMobile ? 24 : 32,
      }}>

        {/* Brand — full width on mobile */}
        <div style={{ gridColumn: isMobile ? '1 / -1' : 'auto' }}>
          <div style={{
            fontFamily: 'Rajdhani, sans-serif',
            fontWeight: 700,
            fontSize: 18,
            color: 'var(--text-primary)',
            letterSpacing: 2,
            marginBottom: 10,
          }}>W3R SPORTS</div>
          <p style={{
            color: 'var(--text-muted)',
            fontSize: 12,
            lineHeight: 1.7,
            margin: 0,
          }}>
            Built for fans who want stats, live action, and viral stories
            in one glanceable sports destination.
          </p>
        </div>

        {/* Categories */}
        <div>
          <h4 style={{
            color: 'var(--text-primary)',
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 1,
            textTransform: 'uppercase',
            marginBottom: 12,
          }}>Categories</h4>
          {categories.map(cat => (
            <div key={cat} style={{
              color: 'var(--text-muted)',
              fontSize: 13,
              padding: '4px 0',
              cursor: 'pointer',
              transition: 'color 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
            >{cat}</div>
          ))}
        </div>

        {/* Legal */}
        <div>
          <h4 style={{
            color: 'var(--text-primary)',
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 1,
            textTransform: 'uppercase',
            marginBottom: 12,
          }}>Legal & Support</h4>
          {legal.map(item => (
            <div key={item} style={{
              color: 'var(--text-muted)',
              fontSize: 13,
              padding: '4px 0',
              cursor: 'pointer',
              transition: 'color 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
            >{item}</div>
          ))}
        </div>

        {/* Socials — full width on mobile */}
        <div style={{ gridColumn: isMobile ? '1 / -1' : 'auto' }}>
          <h4 style={{
            color: 'var(--text-primary)',
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 1,
            textTransform: 'uppercase',
            marginBottom: 12,
          }}>Socials</h4>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {socials.map((s, i) => (
              <button key={i} style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                color: 'var(--text-muted)',
                fontSize: 14, cursor: 'pointer',
                transition: 'all 0.2s',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--accent)'
                  e.currentTarget.style.color = 'var(--accent)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--border)'
                  e.currentTarget.style.color = 'var(--text-muted)'
                }}
              >{s}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{
        borderTop: '1px solid var(--border)',
        padding: '14px 16px',
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'flex-start' : 'center',
        justifyContent: 'space-between',
        gap: 10,
      }}>
        <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>
          © 2026 w3r sports. All rights reserved.
        </span>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {['Live Today', 'Top Leagues', 'Transfer Center', 'Highlights'].map(link => (
            <span key={link} style={{
              color: 'var(--text-muted)',
              fontSize: 12, cursor: 'pointer',
              transition: 'color 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
            >{link}</span>
          ))}
        </div>
      </div>
    </footer>
  )
}

export default Footer
