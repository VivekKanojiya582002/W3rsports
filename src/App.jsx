import { useState } from 'react'
import Navbar from './components/Navbar'
import HeroBanner from './components/HeroBanner'
import LiveMatchCarousel from './components/LiveMatchCarousel'
import MatchCenter from './components/MatchCenter'
import Footer from './components/Footer'
import CricketPage from './components/CricketPage'

function ComingSoon({ sport }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '100px 24px',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>🚧</div>
      <h2 style={{
        fontFamily: 'Rajdhani, sans-serif',
        fontSize: 32,
        fontWeight: 700,
        color: 'var(--text-primary)',
        marginBottom: 8,
      }}>{sport} Coming Soon</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
        We're working hard to bring you live {sport} scores!
      </p>
      <div style={{
        marginTop: 24,
        background: 'rgba(0,230,118,0.1)',
        border: '1px solid rgba(0,230,118,0.3)',
        borderRadius: 12,
        padding: '12px 24px',
        color: 'var(--accent)',
        fontSize: 13,
        fontWeight: 600,
      }}>🔔 Get notified when it launches</div>
    </div>
  )
}

function App() {
  const [activePage, setActivePage] = useState('Live Scores')
  const [selectedMatch, setSelectedMatch] = useState(null)

  // When user clicks a match card on home page
  // → go to Cricket page and open that match detail
  function handleMatchClick(match) {
    setSelectedMatch(match)
    setActivePage('Cricket')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // When user navigates via navbar — clear selected match
  function handleNavigate(page) {
    setActivePage(page)
    setSelectedMatch(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const renderPage = () => {
    switch (activePage) {
      case 'Live Scores':
        return (
          <>
            <HeroBanner />
            <LiveMatchCarousel onMatchClick={handleMatchClick} />
            <MatchCenter onMatchClick={handleMatchClick} />
          </>
        )
      case 'Cricket':
        return (
          <CricketPage
            initialMatch={selectedMatch}
            onClearMatch={() => setSelectedMatch(null)}
          />
        )
      case 'Football':
        return <ComingSoon sport="Football" />
      case 'Motorsports':
        return <ComingSoon sport="Motorsports" />
      case 'News':
        return <ComingSoon sport="News" />
      default:
        return null
    }
  }

  return (
    <div style={{ background: 'var(--bg-main)', minHeight: '100vh' }}>
      <Navbar activePage={activePage} onNavigate={handleNavigate} />
      {renderPage()}
      <Footer />
    </div>
  )
}

export default App
