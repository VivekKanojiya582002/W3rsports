import { useState, useEffect } from 'react'
import { navLinks } from '../data/matches'

function Navbar({ activePage, onNavigate }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 768)
      if (window.innerWidth > 768) setMenuOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  function handleNavigate(link) {
    onNavigate(link)
    setMenuOpen(false)
  }

  return (
    <>
      <nav style={{
        background: 'var(--bg-nav)',
        borderBottom: '1px solid var(--border)',
        padding: '0 16px',
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
          fontSize: isMobile ? 17 : 20,
          color: 'var(--text-primary)',
          letterSpacing: 2,
          flexShrink: 0,
        }}>
          W3R SPORTS
        </div>

        {/* Desktop Nav Links */}
        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {navLinks.map(link => (
              <button
                key={link}
                onClick={() => handleNavigate(link)}
                style={{
                  background: activePage === link ? 'var(--accent)' : 'transparent',
                  color: activePage === link ? '#000' : 'var(--text-primary)',
                  border: activePage === link ? 'none' : '1px solid var(--border-light)',
                  borderRadius: 20,
                  padding: '6px 14px',
                  fontSize: 13,
                  fontWeight: 600,
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >{link}</button>
            ))}
          </div>
        )}

        {/* Right Icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>

          {/* Search — desktop only */}
          {!isMobile && (
            <button style={{
              background: 'transparent', border: 'none',
              color: 'var(--text-muted)', fontSize: 18, cursor: 'pointer',
            }}>🔍</button>
          )}

          {/* Bell */}
          <button style={{
            background: 'transparent', border: 'none',
            color: 'var(--text-muted)', fontSize: 18,
            position: 'relative', cursor: 'pointer',
          }}>
            🔔
            <span style={{
              position: 'absolute', top: -2, right: -2,
              width: 8, height: 8,
              background: 'var(--accent)', borderRadius: '50%',
            }} />
          </button>

          {/* Profile */}
          <button style={{
            width: 34, height: 34, borderRadius: '50%',
            background: 'var(--accent)', border: 'none',
            color: '#000', fontWeight: 700, fontSize: 14, cursor: 'pointer',
          }}>U</button>

          {/* Hamburger — mobile only */}
          {isMobile && (
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                background: 'transparent', border: 'none',
                color: 'var(--text-primary)', fontSize: 22,
                cursor: 'pointer', padding: '4px',
                lineHeight: 1,
              }}
            >
              {menuOpen ? '✕' : '☰'}
            </button>
          )}
        </div>
      </nav>

      {/* Mobile Dropdown Menu */}
      {isMobile && menuOpen && (
        <div style={{
          position: 'fixed',
          top: 56, left: 0, right: 0,
          background: 'var(--bg-nav)',
          borderBottom: '2px solid var(--border)',
          zIndex: 999,
          padding: '12px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        }}>
          {navLinks.map(link => (
            <button
              key={link}
              onClick={() => handleNavigate(link)}
              style={{
                background: activePage === link ? 'var(--accent)' : 'var(--bg-card)',
                color: activePage === link ? '#000' : 'var(--text-primary)',
                border: activePage === link ? 'none' : '1px solid var(--border)',
                borderRadius: 10,
                padding: '13px 16px',
                fontSize: 14,
                fontWeight: 600,
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >{link}</button>
          ))}
        </div>
      )}
    </>
  )
}

export default Navbar
