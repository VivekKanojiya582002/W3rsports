import { useState, useEffect } from 'react'
import { getCurrentMatches } from '../api/cricket'
import { trendingNews } from '../data/matches'

// ── Flag Image ───────────────────────────────────────────────
function FlagImg({ code, size = 14 }) {
  if (!code) return null
  return (
    <img
      src={`https://flagcdn.com/w40/${code}.png`}
      alt={code}
      style={{
        width: size * 1.4, height: size,
        objectFit: 'cover', borderRadius: 2,
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
    'essex', 'hampshire', 'warwickshire', 'nottinghamshire', 'somerset', 'middlesex', 'durham',
  ]
  const pakistan = ['pakistan', 'karachi', 'lahore', 'peshawar', 'quetta', 'islamabad', 'multan']
  const newZealand = ['new zealand', 'auckland', 'wellington', 'canterbury', 'otago', 'central districts', 'northern districts']
  const others = {
    'west indies': 'bb', 'windies': 'bb', 'sri lanka': 'lk',
    'bangladesh': 'bd', 'zimbabwe': 'zw', 'afghanistan': 'af',
    'ireland': 'ie', 'scotland': 'gb-sct', 'netherlands': 'nl',
    'nepal': 'np', 'uae': 'ae', 'oman': 'om',
    'namibia': 'na', 'uganda': 'ug', 'kenya': 'ke',
    'botswana': 'bw', 'lesotho': 'ls', 'usa': 'us', 'canada': 'ca',
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

// ── Left Panel — Quick Stats ─────────────────────────────────
function QuickStats({ matches }) {
  const liveCount = matches.filter(m => m.status === 'live').length
  const upcomingCount = matches.filter(m => m.status === 'upcoming').length
  const finishedCount = matches.filter(m => m.status === 'finished').length

  return (
    <div style={{
      width: 200, flexShrink: 0,
      display: 'flex', flexDirection: 'column', gap: 12,
    }}>
      {/* Stats Card */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 12, padding: 16,
      }}>
        <h3 style={{
          color: 'var(--text-primary)', fontSize: 12,
          fontWeight: 700, letterSpacing: 0.5,
          textTransform: 'uppercase', marginBottom: 14,
        }}>Today's Cricket</h3>

        {[
          { label: 'Live Now', value: liveCount, color: 'var(--accent)', dot: true },
          { label: 'Upcoming', value: upcomingCount, color: '#2196f3', dot: false },
          { label: 'Finished', value: finishedCount, color: 'var(--text-muted)', dot: false },
        ].map((stat, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 0',
            borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.04)' : 'none',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {stat.dot && (
                <span style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: stat.color, display: 'inline-block',
                  animation: 'pulse 1.5s infinite',
                  boxShadow: `0 0 6px ${stat.color}`,
                }} />
              )}
              <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>{stat.label}</span>
            </div>
            <span style={{ color: stat.color, fontSize: 16, fontWeight: 800, fontFamily: 'monospace' }}>
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      {/* Popular Teams */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 12, padding: 16,
      }}>
        <h3 style={{
          color: 'var(--text-primary)', fontSize: 12,
          fontWeight: 700, letterSpacing: 0.5,
          textTransform: 'uppercase', marginBottom: 12,
        }}>Popular Teams</h3>

        {[
          { name: 'India', code: 'in' },
          { name: 'Australia', code: 'au' },
          { name: 'England', code: 'gb-eng' },
          { name: 'Pakistan', code: 'pk' },
          { name: 'New Zealand', code: 'nz' },
        ].map((team, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between',
            padding: '7px 0',
            borderBottom: i < 4 ? '1px solid var(--border)' : 'none',
            cursor: 'pointer',
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,230,118,0.03)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <FlagImg code={team.code} size={14} />
              <span style={{ color: 'var(--text-dim)', fontSize: 12 }}>{team.name}</span>
            </div>
            <span style={{ color: 'var(--accent)', fontSize: 16 }}>+</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Center Panel — Match List ────────────────────────────────
function MatchList({ matches, loading }) {
  const [activeTab, setActiveTab] = useState('live')

  const filtered = matches.filter(m => m.status === activeTab)

  return (
    <div style={{
      flex: 1,
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 12, overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        background: 'var(--bg-nav)',
      }}>
        <h3 style={{
          color: 'var(--text-primary)', fontSize: 13,
          fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase',
        }}>Match Center</h3>

        <div style={{ display: 'flex', gap: 6 }}>
          {['live', 'upcoming', 'finished'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              background: activeTab === tab ? 'var(--accent)' : 'transparent',
              color: activeTab === tab ? '#000' : 'var(--text-muted)',
              border: activeTab === tab ? 'none' : '1px solid var(--border)',
              borderRadius: 20, padding: '4px 12px',
              fontSize: 11, fontWeight: 700,
              textTransform: 'capitalize', cursor: 'pointer', transition: 'all 0.2s',
            }}>
              {tab === 'live' ? '🔴 ' : tab === 'upcoming' ? '🕐 ' : '✅ '}{tab}
            </button>
          ))}
        </div>
      </div>

      {/* Match Rows */}
      <div style={{ maxHeight: 400, overflowY: 'auto' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              border: '3px solid var(--border)',
              borderTop: '3px solid var(--accent)',
              animation: 'spin 0.8s linear infinite',
              margin: '0 auto',
            }} />
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
              No {activeTab} matches right now
            </p>
          </div>
        ) : filtered.slice(0, 10).map((match, i) => {
          const code = getCountryCode(match.home) || getCountryCode(match.away)
          const isLive = match.status === 'live'
          return (
            <div key={match.id} style={{
              display: 'grid',
              gridTemplateColumns: '90px 1fr auto 1fr 50px',
              alignItems: 'center',
              gap: 8, padding: '11px 20px',
              borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
              cursor: 'pointer', transition: 'background 0.15s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,230,118,0.03)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              {/* League */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <FlagImg code={code} size={12} />
                <span style={{
                  color: 'var(--text-muted)', fontSize: 10,
                  fontWeight: 600, overflow: 'hidden',
                  textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  maxWidth: 65,
                }}>{match.type}</span>
              </div>

              {/* Home */}
              <div style={{
                textAlign: 'right', color: 'var(--text-primary)',
                fontSize: 12, fontWeight: 600,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>{match.home}</div>

              {/* Score or Time */}
              <div style={{ textAlign: 'center', minWidth: 80 }}>
                {isLive ? (
                  <div>
                    <div style={{
                      color: 'var(--text-primary)', fontWeight: 800,
                      fontSize: 13, fontFamily: 'monospace',
                    }}>
                      {match.homeScore} — {match.awayScore}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3, marginTop: 2 }}>
                      <span style={{
                        width: 4, height: 4, borderRadius: '50%',
                        background: 'var(--accent)', display: 'inline-block',
                        animation: 'pulse 1.5s infinite',
                      }} />
                      <span style={{ color: 'var(--accent)', fontSize: 9, fontWeight: 700 }}>LIVE</span>
                    </div>
                  </div>
                ) : match.status === 'finished' ? (
                  <div style={{ color: 'var(--text-muted)', fontSize: 12, fontWeight: 700 }}>
                    {match.homeScore} — {match.awayScore}
                  </div>
                ) : (
                  <div style={{ color: '#2196f3', fontSize: 12, fontWeight: 700 }}>
                    {match.time}
                  </div>
                )}
              </div>

              {/* Away */}
              <div style={{
                color: 'var(--text-primary)', fontSize: 12, fontWeight: 600,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>{match.away}</div>

              {/* Star */}
              <div style={{
                textAlign: 'right', color: 'var(--border-light)',
                fontSize: 14, cursor: 'pointer',
              }}>☆</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Right Panel — Trending News ──────────────────────────────
function TrendingNews() {
  return (
    <div style={{
      width: 240, flexShrink: 0,
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 12, overflow: 'hidden',
    }}>
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg-nav)',
      }}>
        <h3 style={{
          color: 'var(--text-primary)', fontSize: 13,
          fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase',
        }}>Trending News</h3>
      </div>

      {trendingNews.map((news, i) => (
        <div key={news.id} style={{
          padding: '14px 20px',
          borderBottom: i < trendingNews.length - 1 ? '1px solid var(--border)' : 'none',
          cursor: 'pointer', transition: 'background 0.15s',
        }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,230,118,0.03)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <span style={{
            background: 'rgba(0,230,118,0.15)', color: 'var(--accent)',
            fontSize: 10, fontWeight: 700, letterSpacing: 1,
            padding: '2px 8px', borderRadius: 10,
            display: 'inline-block', marginBottom: 8,
          }}>{news.tag}</span>

          <p style={{
            color: 'var(--text-primary)', fontSize: 12,
            fontWeight: 600, lineHeight: 1.5, marginBottom: 6,
          }}>{news.title}</p>

          <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>{news.time}</span>
        </div>
      ))}
    </div>
  )
}

// ── Main Component ───────────────────────────────────────────
function MatchCenter() {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadMatches() {
      try {
        const data = await getCurrentMatches()
        if (data?.data && data.data.length > 0) {
          const formatted = data.data.map((m, i) => {
            const homeTeam = m.teams?.[0] || 'Team A'
            const awayTeam = m.teams?.[1] || 'Team B'
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
              status,
              statusText: m.status || '',
              time: m.dateTimeGMT
                ? new Date(m.dateTimeGMT).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : 'TBD',
            }
          })
          setMatches(formatted)
        }
      } catch (err) {
        console.error('MatchCenter error:', err)
      } finally {
        setLoading(false)
      }
    }
    loadMatches()
  }, [])

  return (
    <div style={{ padding: '0 24px 24px' }}>
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
        <QuickStats matches={matches} />
        <MatchList matches={matches} loading={loading} />
        <TrendingNews />
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes spin { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }
      `}</style>
    </div>
  )
}

export default MatchCenter
