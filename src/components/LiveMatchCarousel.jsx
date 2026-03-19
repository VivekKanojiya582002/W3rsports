import { useState, useEffect } from 'react'
import { getCurrentMatches } from '../api/cricket'

// ── Flag Image ───────────────────────────────────────────────
function FlagImg({ code, size = 14 }) {
  if (!code) return <span style={{ fontSize: size }}>🏏</span>
  return (
    <img
      src={`https://flagcdn.com/w40/${code}.png`}
      alt={code}
      style={{
        width: size * 1.4, height: size,
        objectFit: 'cover', borderRadius: 2,
        display: 'inline-block',
      }}
      onError={e => { e.target.style.display = 'none' }}
    />
  )
}

// ── Get country code ─────────────────────────────────────────
function getCountryCode(teamName) {
  if (!teamName) return null
  const t = teamName.toLowerCase()
  const india = ['india', 'karnataka', 'mumbai', 'delhi', 'bengal', 'hyderabad',
    'punjab', 'rajasthan', 'gujarat', 'maharashtra', 'andhra', 'tamil nadu',
    'kerala', 'assam', 'bihar', 'jharkhand', 'odisha', 'uttarakhand',
    'uttar pradesh', 'madhya pradesh', 'haryana', 'jammu', 'kashmir',
    'saurashtra', 'baroda', 'vidarbha', 'mumbai indians', 'chennai super kings',
    'royal challengers', 'kolkata knight riders', 'delhi capitals', 'sunrisers',
    'punjab kings', 'rajasthan royals', 'lucknow super giants', 'gujarat titans',
  ]
  const southAfrica = ['south africa', 'warriors', 'titans', 'knights', 'dolphins',
    'lions', 'cape cobras', 'north west', 'kwazulu', 'border', 'eastvaal',
  ]
  const australia = ['australia', 'new south wales', 'victoria', 'queensland',
    'south australia', 'western australia', 'tasmania', 'sydney', 'melbourne',
    'brisbane', 'adelaide', 'hobart', 'perth',
  ]
  const england = ['england', 'yorkshire', 'lancashire', 'surrey', 'kent',
    'essex', 'hampshire', 'warwickshire', 'nottinghamshire', 'somerset',
    'middlesex', 'durham',
  ]
  const pakistan = ['pakistan', 'karachi', 'lahore', 'peshawar', 'quetta', 'islamabad', 'multan']
  const newZealand = ['new zealand', 'auckland', 'wellington', 'canterbury', 'otago', 'central districts', 'northern districts']
  const others = {
    'west indies': 'bb', 'windies': 'bb', 'sri lanka': 'lk',
    'bangladesh': 'bd', 'zimbabwe': 'zw', 'afghanistan': 'af',
    'ireland': 'ie', 'scotland': 'gb-sct', 'netherlands': 'nl',
    'nepal': 'np', 'uae': 'ae', 'oman': 'om',
    'namibia': 'na', 'uganda': 'ug', 'kenya': 'ke',
    'botswana': 'bw', 'lesotho': 'ls', 'nigeria': 'ng',
    'usa': 'us', 'canada': 'ca',
  }
  if (india.some(x => t.includes(x))) return 'in'
  if (southAfrica.some(x => t.includes(x))) return 'za'
  if (australia.some(x => t.includes(x))) return 'au'
  if (england.some(x => t.includes(x))) return 'gb-eng'
  if (pakistan.some(x => t.includes(x))) return 'pk'
  if (newZealand.some(x => t.includes(x))) return 'nz'
  for (const [key, code] of Object.entries(others)) {
    if (t.includes(key)) return code
  }
  return null
}

// ── Match Card ───────────────────────────────────────────────
function MatchCard({ match }) {
  const isLive = match.status === 'live'
  const homeCode = getCountryCode(match.home)
  const awayCode = getCountryCode(match.away)

  return (
    <div style={{
      minWidth: 220,
      background: 'var(--bg-card)',
      border: `1px solid ${isLive ? 'rgba(0,230,118,0.3)' : 'var(--border)'}`,
      borderRadius: 12,
      padding: '14px 16px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      flexShrink: 0,
      position: 'relative',
      overflow: 'hidden',
    }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'var(--accent)'
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.3)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = isLive ? 'rgba(0,230,118,0.3)' : 'var(--border)'
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {/* Live glow */}
      {isLive && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 2,
          background: 'linear-gradient(90deg, transparent, var(--accent), transparent)',
        }} />
      )}

      {/* League */}
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', marginBottom: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <FlagImg code={homeCode || awayCode} size={13} />
          <span style={{
            color: 'var(--text-muted)', fontSize: 10,
            fontWeight: 600, letterSpacing: 0.5,
            maxWidth: 120, overflow: 'hidden',
            textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>{match.league}</span>
        </div>

        {/* Type badge */}
        <span style={{
          background: match.type === 'TEST'
            ? 'rgba(255,193,7,0.15)' : 'rgba(0,230,118,0.15)',
          color: match.type === 'TEST' ? '#ffc107' : 'var(--accent)',
          fontSize: 9, fontWeight: 700,
          padding: '2px 6px', borderRadius: 8, letterSpacing: 0.5,
        }}>{match.type}</span>
      </div>

      {/* Teams & Score */}
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', gap: 8,
      }}>
        {/* Home Team */}
        <div style={{ textAlign: 'center', flex: 1 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            background: 'rgba(0,230,118,0.08)',
            border: '1px solid rgba(0,230,118,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 10, fontWeight: 800, color: 'var(--accent)',
            fontFamily: 'Rajdhani, sans-serif', margin: '0 auto 6px',
          }}>
            {match.homeImg ? (
              <img src={match.homeImg} alt={match.home}
                style={{ width: 28, height: 28, objectFit: 'contain' }}
                onError={e => e.target.style.display = 'none'}
              />
            ) : match.home?.substring(0, 3).toUpperCase()}
          </div>
          <div style={{
            color: 'var(--text-primary)', fontSize: 11,
            fontWeight: 600, maxWidth: 70,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            margin: '0 auto',
          }}>{match.home}</div>
          {match.homeScore !== '—' && (
            <div style={{
              color: isLive ? 'var(--text-primary)' : 'var(--text-muted)',
              fontSize: 14, fontWeight: 800, fontFamily: 'monospace', marginTop: 2,
            }}>{match.homeScore}</div>
          )}
        </div>

        {/* VS / Status */}
        <div style={{ textAlign: 'center' }}>
          {isLive ? (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 4,
              background: 'rgba(0,230,118,0.1)',
              border: '1px solid rgba(0,230,118,0.3)',
              borderRadius: 10, padding: '3px 8px',
            }}>
              <span style={{
                width: 5, height: 5, borderRadius: '50%',
                background: 'var(--accent)', display: 'inline-block',
                animation: 'pulse 1.5s infinite',
              }} />
              <span style={{ color: 'var(--accent)', fontSize: 9, fontWeight: 800 }}>LIVE</span>
            </div>
          ) : (
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: 11, fontWeight: 700 }}>VS</div>
              <div style={{ color: '#2196f3', fontSize: 10, fontWeight: 600, marginTop: 2 }}>
                {match.time}
              </div>
            </div>
          )}
        </div>

        {/* Away Team */}
        <div style={{ textAlign: 'center', flex: 1 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            background: 'rgba(0,230,118,0.08)',
            border: '1px solid rgba(0,230,118,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 10, fontWeight: 800, color: 'var(--accent)',
            fontFamily: 'Rajdhani, sans-serif', margin: '0 auto 6px',
          }}>
            {match.awayImg ? (
              <img src={match.awayImg} alt={match.away}
                style={{ width: 28, height: 28, objectFit: 'contain' }}
                onError={e => e.target.style.display = 'none'}
              />
            ) : match.away?.substring(0, 3).toUpperCase()}
          </div>
          <div style={{
            color: 'var(--text-primary)', fontSize: 11,
            fontWeight: 600, maxWidth: 70,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            margin: '0 auto',
          }}>{match.away}</div>
          {match.awayScore !== '—' && (
            <div style={{
              color: isLive ? 'var(--text-primary)' : 'var(--text-muted)',
              fontSize: 14, fontWeight: 800, fontFamily: 'monospace', marginTop: 2,
            }}>{match.awayScore}</div>
          )}
        </div>
      </div>

      {/* Status text */}
      <div style={{
        marginTop: 10, padding: '5px 8px',
        background: isLive ? 'rgba(0,230,118,0.05)' : 'rgba(255,255,255,0.02)',
        borderRadius: 6,
        border: `1px solid ${isLive ? 'rgba(0,230,118,0.1)' : 'var(--border)'}`,
      }}>
        <span style={{
          color: isLive ? 'var(--accent)' : 'var(--text-muted)',
          fontSize: 10, fontWeight: 600,
          display: 'block', textAlign: 'center',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>{match.statusText}</span>
      </div>
    </div>
  )
}

// ── Main Carousel ────────────────────────────────────────────
function LiveMatchCarousel() {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadMatches() {
      try {
        const data = await getCurrentMatches()
        if (data?.data && data.data.length > 0) {
          // Format matches for carousel
          const formatted = data.data
            .filter(m => m.matchStarted || (!m.matchStarted && !m.matchEnded))
            .slice(0, 15)
            .map((m, i) => {
              const homeTeam = m.teams?.[0] || 'Team A'
              const awayTeam = m.teams?.[1] || 'Team B'
              const homeTeamInfo = m.teamInfo?.find(t =>
                t.name?.toLowerCase() === homeTeam.toLowerCase()
              )
              const awayTeamInfo = m.teamInfo?.find(t =>
                t.name?.toLowerCase() === awayTeam.toLowerCase()
              )
              let status = 'upcoming'
              if (m.matchStarted && !m.matchEnded) status = 'live'
              else if (m.matchEnded) status = 'finished'

              return {
                id: m.id || i,
                league: m.series || m.name || 'Cricket',
                type: m.matchType?.toUpperCase() || 'T20',
                home: homeTeam,
                away: awayTeam,
                homeScore: m.score?.[0]?.r !== undefined
                  ? `${m.score[0].r}/${m.score[0].w}` : '—',
                awayScore: m.score?.[1]?.r !== undefined
                  ? `${m.score[1].r}/${m.score[1].w}` : '—',
                homeImg: homeTeamInfo?.img || null,
                awayImg: awayTeamInfo?.img || null,
                status,
                statusText: m.status || 'Match in progress',
                time: m.dateTimeGMT
                  ? new Date(m.dateTimeGMT).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  : 'TBD',
              }
            })
          setMatches(formatted)
        }
      } catch (err) {
        console.error('Carousel error:', err)
      } finally {
        setLoading(false)
      }
    }
    loadMatches()
  }, [])

  const liveCount = matches.filter(m => m.status === 'live').length

  return (
    <div style={{ padding: '0 24px 24px' }}>

      {/* Section Header */}
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', marginBottom: 14,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            width: 8, height: 8, borderRadius: '50%',
            background: 'var(--accent)', display: 'inline-block',
            animation: 'pulse 1.5s infinite', boxShadow: '0 0 8px var(--accent)',
          }} />
          <span style={{
            color: 'var(--text-primary)', fontSize: 13,
            fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase',
          }}>Live & Upcoming Matches</span>

          {liveCount > 0 && (
            <span style={{
              background: 'rgba(0,230,118,0.12)',
              border: '1px solid rgba(0,230,118,0.3)',
              color: 'var(--accent)', fontSize: 10,
              fontWeight: 800, padding: '2px 8px', borderRadius: 10,
            }}>{liveCount} LIVE</span>
          )}
        </div>
        <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>
          Swipe for more →
        </span>
      </div>

      {/* Scrollable Cards */}
      {loading ? (
        <div style={{
          display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8,
        }}>
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} style={{
              minWidth: 220, height: 160,
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 12,
              animation: 'pulse 1.5s infinite',
              flexShrink: 0,
            }} />
          ))}
        </div>
      ) : (
        <div style={{
          display: 'flex', gap: 12,
          overflowX: 'auto', paddingBottom: 8,
          scrollbarWidth: 'none',
        }}>
          {matches.map(match => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      )}

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
      `}</style>
    </div>
  )
}

export default LiveMatchCarousel
