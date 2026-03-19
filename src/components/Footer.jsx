import { useState } from 'react'
function Footer() {
  const [email, setEmail] = useState('')

  const categories = ['Cricket', 'Football', 'Motorsports', 'Tennis', 'Basketball']
  const legal = ['Contact Us', 'Privacy Policy', 'Terms of Service', 'Cookie Policy']
  const socials = ['𝕏', '📸', '▶️', '♪', '👤']

  return (
    <footer style={{ background: 'var(--bg-nav)', borderTop: '1px solid var(--border)' }}>

      {/* Newsletter Bar */}
      <div style={{
        borderBottom: '1px solid var(--border)',
        padding: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        flexWrap: 'wrap',
      }}>
        <p style={{
          color: 'var(--text-muted)',
          fontSize: 13,
          maxWidth: 400,
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
              padding: '10px 16px',
              color: 'var(--text-primary)',
              fontSize: 13,
              width: 240,
              outline: 'none',
            }}
          />
          <button style={{
            background: 'var(--accent)',
            color: '#000',
            border: 'none',
            borderRadius: 8,
            padding: '10px 20px',
            fontSize: 13,
            fontWeight: 700,
          }}>
            Subscribe
          </button>
        </div>
      </div>

      {/* Footer Links */}
      <div style={{
        padding: '32px 24px',
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1fr 1fr',
        gap: 32,
      }}>

        {/* Brand */}
        <div>
          <div style={{
            fontFamily: 'Rajdhani, sans-serif',
            fontWeight: 700,
            fontSize: 18,
            color: 'var(--text-primary)',
            letterSpacing: 2,
            marginBottom: 12,
          }}>W3R SPORTS</div>
          <p style={{
            color: 'var(--text-muted)',
            fontSize: 12,
            lineHeight: 1.7,
            maxWidth: 260,
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
            marginBottom: 16,
          }}>Categories</h4>
          {categories.map(cat => (
            <div key={cat} style={{
              color: 'var(--text-muted)',
              fontSize: 13,
              padding: '5px 0',
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
            marginBottom: 16,
          }}>Legal & Support</h4>
          {legal.map(item => (
            <div key={item} style={{
              color: 'var(--text-muted)',
              fontSize: 13,
              padding: '5px 0',
              cursor: 'pointer',
              transition: 'color 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
            >{item}</div>
          ))}
        </div>

        {/* Socials */}
        <div>
          <h4 style={{
            color: 'var(--text-primary)',
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 1,
            textTransform: 'uppercase',
            marginBottom: 16,
          }}>Socials</h4>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {socials.map((s, i) => (
              <button key={i} style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                color: 'var(--text-muted)',
                fontSize: 14,
                cursor: 'pointer',
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
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>
          © 2026 w3r sports. All rights reserved.
        </span>
        <div style={{ display: 'flex', gap: 20 }}>
          {['Live Today', 'Top Leagues', 'Transfer Center', 'Highlights'].map(link => (
            <span key={link} style={{
              color: 'var(--text-muted)',
              fontSize: 12,
              cursor: 'pointer',
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
