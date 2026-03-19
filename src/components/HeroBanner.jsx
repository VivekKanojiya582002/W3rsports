import { useState } from 'react'

function HeroBanner() {
  const [email, setEmail] = useState('')

  return (
    <div style={{ padding: '16px 24px' }}>

      {/* Hero Card */}
      <div style={{
        borderRadius: 16,
        overflow: 'hidden',
        position: 'relative',
        height: 320,
        background: 'linear-gradient(135deg, #0a2a15 0%, #1a4a2a 50%, #0d3a1a 100%)',
        border: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'flex-end',
        padding: 32,
      }}>

        {/* Background Pattern */}
        <div style={{
          position: 'absolute',
          top: 0, right: 0,
          width: '55%',
          height: '100%',
          background: 'linear-gradient(135deg, rgba(0,230,118,0.05), rgba(0,100,50,0.3))',
          clipPath: 'polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%)',
        }} />

        {/* Decorative circles */}
        <div style={{
          position: 'absolute',
          top: -60, right: 100,
          width: 300,
          height: 300,
          borderRadius: '50%',
          border: '1px solid rgba(0,230,118,0.1)',
        }} />
        <div style={{
          position: 'absolute',
          top: -30, right: 70,
          width: 200,
          height: 200,
          borderRadius: '50%',
          border: '1px solid rgba(0,230,118,0.08)',
        }} />

        {/* Sport Icons floating */}
        <div style={{
          position: 'absolute',
          top: 30, right: 80,
          fontSize: 80,
          opacity: 0.15,
        }}>⚽</div>
        <div style={{
          position: 'absolute',
          top: 60, right: 220,
          fontSize: 50,
          opacity: 0.1,
        }}>🏀</div>
        <div style={{
          position: 'absolute',
          bottom: 60, right: 140,
          fontSize: 40,
          opacity: 0.1,
        }}>🎾</div>

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 520 }}>

          {/* Breaking Now Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: 'rgba(0,230,118,0.15)',
            border: '1px solid rgba(0,230,118,0.4)',
            borderRadius: 20,
            padding: '4px 12px',
            marginBottom: 16,
          }}>
            <span style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: 'var(--accent)',
              display: 'inline-block',
              animation: 'pulse 1.5s infinite',
            }} />
            <span style={{
              color: 'var(--accent)',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 1,
            }}>BREAKING NOW</span>
          </div>

          {/* Heading */}
          <h1 style={{
            fontFamily: 'Rajdhani, sans-serif',
            fontSize: 42,
            fontWeight: 700,
            color: 'var(--text-primary)',
            lineHeight: 1.1,
            marginBottom: 12,
          }}>
            Catch every live moment,<br />
            stat, and viral sports story
          </h1>

          {/* Subtitle */}
          <p style={{
            color: 'var(--text-muted)',
            fontSize: 13,
            marginBottom: 20,
          }}>
            w3r sports • Just now • Trending globally
          </p>

          {/* Button */}
          <button style={{
            background: 'var(--accent)',
            color: '#000',
            border: 'none',
            borderRadius: 8,
            padding: '10px 24px',
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: 0.5,
          }}>
            Read Story →
          </button>

        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>

    </div>
  )
}

export default HeroBanner