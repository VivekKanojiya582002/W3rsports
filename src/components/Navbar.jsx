import { useState } from 'react'
import { navLinks } from '../data/matches'

function Navbar({ activePage, onNavigate }) {
  const active = activePage
  const setActive = onNavigate

  return (
    <nav style={{
      background: 'var(--bg-nav)',
      borderBottom: '1px solid var(--border)',
      padding: '0 24px',
      height: 56,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
    }}>

      {/* Logo */}
      <div style={{
        fontFamily: 'Rajdhani, sans-serif',
        fontWeight: 700,
        fontSize: 20,
        color: 'var(--text-primary)',
        letterSpacing: 2,
      }}>
        W3R SPORTS
      </div>

      {/* Nav Links */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}>
        {navLinks.map(link => (
          <button
            key={link}
            onClick={() => setActive(link)}
            style={{
              background: active === link ? 'var(--accent)' : 'transparent',
              color: active === link ? '#000' : 'var(--text-primary)',
              border: active === link ? 'none' : '1px solid var(--border-light)',
              borderRadius: 20,
              padding: '6px 16px',
              fontSize: 13,
              fontWeight: 600,
              transition: 'all 0.2s',
            }}
          >
            {link}
          </button>
        ))}
      </div>

      {/* Right Icons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>

        {/* Search */}
        <button style={{
          background: 'transparent',
          border: 'none',
          color: 'var(--text-muted)',
          fontSize: 18,
        }}>🔍</button>

        {/* Bell */}
        <button style={{
          background: 'transparent',
          border: 'none',
          color: 'var(--text-muted)',
          fontSize: 18,
          position: 'relative',
        }}>
          🔔
          <span style={{
            position: 'absolute',
            top: -2,
            right: -2,
            width: 8,
            height: 8,
            background: 'var(--accent)',
            borderRadius: '50%',
          }} />
        </button>

        {/* Profile */}
        <button style={{
          width: 34,
          height: 34,
          borderRadius: '50%',
          background: 'var(--accent)',
          border: 'none',
          color: '#000',
          fontWeight: 700,
          fontSize: 14,
        }}>U</button>

      </div>
    </nav>
  )
}

export default Navbar