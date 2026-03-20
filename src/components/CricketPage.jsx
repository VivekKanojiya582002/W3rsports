import { useState, useEffect } from 'react'
import { getCurrentMatches } from '../api/cricket'
import { cricketMatches } from '../data/matches'
import CricketMatchDetail from './CricketMatchDetail'
import CricketPointsTable from './CricketPointsTable'

// ── Type Badge ───────────────────────────────────────────────
function TypeBadge({ type }) {
  const colors = {
    T20: { bg: 'rgba(0,230,118,0.15)', color: '#00e676' },
    TEST: { bg: 'rgba(255,193,7,0.15)', color: '#ffc107' },
    ODI: { bg: 'rgba(33,150,243,0.15)', color: '#2196f3' },
    T20I: { bg: 'rgba(0,230,118,0.15)', color: '#00e676' },
  }
  const style = colors[type] || colors.T20
  return (
    <span style={{
      background: style.bg, color: style.color,
      fontSize: 10, fontWeight: 700,
      padding: '2px 8px', borderRadius: 10, letterSpacing: 1,
    }}>{type}</span>
  )
}

// ── Loading Spinner ──────────────────────────────────────────
function LoadingSpinner() {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '80px 24px', gap: 16,
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: '50%',
        border: '3px solid var(--border)',
        borderTop: '3px solid var(--accent)',
        animation: 'spin 0.8s linear infinite',
      }} />
      <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Loading live cricket matches...</p>
      <style>{`@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}`}</style>
    </div>
  )
}

// ── Error Message ────────────────────────────────────────────
function ErrorMessage({ onRetry }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '60px 24px', textAlign: 'center',
    }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>⚠️</div>
      <h3 style={{ color: 'var(--text-primary)', fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
        Could not load live matches
      </h3>
      <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 20, maxWidth: 320, lineHeight: 1.6 }}>
        Showing cached data. Check your internet connection or API key.
      </p>
      <button onClick={onRetry} style={{
        background: 'var(--accent)', color: '#000', border: 'none',
        borderRadius: 8, padding: '10px 24px', fontSize: 13, fontWeight: 700, cursor: 'pointer',
      }}>🔄 Try Again</button>
    </div>
  )
}

// ── getCountryCode ───────────────────────────────────────────
function getCountryCode(teamName) {
  if (!teamName) return null
  const t = teamName.toLowerCase()
  const india = [
    'india', 'karnataka', 'mumbai', 'delhi', 'chennai', 'kolkata', 'bengal',
    'hyderabad', 'punjab', 'rajasthan', 'gujarat', 'maharashtra', 'andhra',
    'tamil nadu', 'kerala', 'goa', 'assam', 'bihar', 'jharkhand', 'odisha',
    'chhattisgarh', 'uttarakhand', 'uttar pradesh', 'madhya pradesh',
    'himachal', 'haryana', 'chandigarh', 'jammu', 'kashmir', 'saurashtra',
    'baroda', 'vidarbha', 'railways', 'services', 'mumbai indians',
    'chennai super kings', 'royal challengers', 'kolkata knight riders',
    'delhi capitals', 'sunrisers', 'punjab kings', 'rajasthan royals',
    'lucknow super giants', 'gujarat titans',
  ]
  const southAfrica = [
    'south africa', 'warriors', 'titans', 'knights', 'dolphins', 'lions',
    'cape cobras', 'north west', 'kwazulu', 'border', 'eastvaal',
  ]
  const australia = [
    'australia', 'new south wales', 'victoria', 'queensland',
    'south australia', 'western australia', 'tasmania',
    'sydney', 'melbourne', 'brisbane', 'adelaide', 'hobart', 'perth',
  ]
  const england = [
    'england', 'yorkshire', 'lancashire', 'surrey', 'kent', 'essex',
    'hampshire', 'warwickshire', 'nottinghamshire', 'somerset', 'middlesex', 'durham',
  ]
  const pakistan = ['pakistan', 'karachi', 'lahore', 'peshawar', 'quetta', 'islamabad', 'multan']
  const newZealand = ['new zealand', 'auckland', 'wellington', 'canterbury', 'otago', 'central districts', 'northern districts']
  const others = {
    'west indies': 'bb', 'windies': 'bb', 'sri lanka': 'lk',
    'bangladesh': 'bd', 'zimbabwe': 'zw', 'afghanistan': 'af',
    'ireland': 'ie', 'scotland': 'gb-sct', 'netherlands': 'nl',
    'nepal': 'np', 'uae': 'ae', 'oman': 'om', 'malaysia': 'my',
    'singapore': 'sg', 'namibia': 'na', 'uganda': 'ug', 'kenya': 'ke',
    'botswana': 'bw', 'lesotho': 'ls', 'nigeria': 'ng',
    'usa': 'us', 'canada': 'ca', 'papua': 'pg',
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

// ── Flag Image ───────────────────────────────────────────────
function FlagImg({ code, size = 18 }) {
  if (!code) return <span style={{ fontSize: size }}>🏏</span>
  return (
    <img
      src={`https://flagcdn.com/w40/${code}.png`}
      alt={code}
      style={{
        width: size * 1.4, height: size,
        objectFit: 'cover', borderRadius: 3, display: 'inline-block',
      }}
      onError={e => { e.target.style.display = 'none' }}
    />
  )
}

// ── Team Badge ───────────────────────────────────────────────
function TeamBadge({ shortName, color, imgUrl }) {
  const [imgError, setImgError] = useState(false)
  return (
    <div style={{
      width: 40, height: 40, borderRadius: 10,
      background: color + '33', border: `1px solid ${color}66`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 800, fontSize: 13, color: '#fff',
      fontFamily: 'Rajdhani, sans-serif', letterSpacing: 1,
      overflow: 'hidden', flexShrink: 0,
    }}>
      {imgUrl && !imgError ? (
        <img src={imgUrl} alt={shortName}
          style={{ width: 32, height: 32, objectFit: 'contain' }}
          onError={() => setImgError(true)}
        />
      ) : shortName}
    </div>
  )
}

// ── Format API match ─────────────────────────────────────────
function formatAPIMatch(match, index) {
  const matchType = match.matchType?.toUpperCase() || 'T20'

  let status = 'upcoming'
  if (match.matchStarted && !match.matchEnded) status = 'live'
  else if (match.matchEnded) status = 'finished'

  const teamColors = {
    'India': '#0033A0', 'Australia': '#FFCD00',
    'Pakistan': '#01411C', 'England': '#003087',
    'New Zealand': '#000000', 'South Africa': '#007A4D',
    'West Indies': '#7B0000', 'Sri Lanka': '#003478',
    'Bangladesh': '#006A4E', 'Zimbabwe': '#EF3340',
    'Afghanistan': '#0066CC', 'Ireland': '#169B62',
    'Mumbai Indians': '#004BA0', 'Chennai Super Kings': '#F5A623',
    'Royal Challengers Bengaluru': '#C8102E',
    'Royal Challengers Bangalore': '#C8102E',
    'Kolkata Knight Riders': '#3A225D',
    'Delhi Capitals': '#0078BC', 'Sunrisers Hyderabad': '#F7A721',
    'Punjab Kings': '#ED1B24', 'Rajasthan Royals': '#254AA5',
    'Lucknow Super Giants': '#A2E4F4', 'Gujarat Titans': '#1C4F9C',
  }

  const homeTeam = match.teams?.[0] || 'Team A'
  const awayTeam = match.teams?.[1] || 'Team B'

  const homeScore = match.score?.[0]?.r !== undefined
    ? `${match.score[0].r}/${match.score[0].w}` : '—'
  const awayScore = match.score?.[1]?.r !== undefined
    ? `${match.score[1].r}/${match.score[1].w}` : '—'
  const homeOvers = match.score?.[0]?.o || '—'
  const awayOvers = match.score?.[1]?.o || '—'

  const homeTeamInfo = match.teamInfo?.find(t =>
    t.name?.toLowerCase() === homeTeam.toLowerCase() ||
    homeTeam.toLowerCase().includes(t.shortname?.toLowerCase?.() || '')
  )
  const awayTeamInfo = match.teamInfo?.find(t =>
    t.name?.toLowerCase() === awayTeam.toLowerCase() ||
    awayTeam.toLowerCase().includes(t.shortname?.toLowerCase?.() || '')
  )

  const homeCode = getCountryCode(homeTeam)
  const awayCode = getCountryCode(awayTeam)
  const displayCode = homeCode || awayCode || null

  const homeColor = Object.entries(teamColors).find(([k]) =>
    homeTeam.toLowerCase().includes(k.toLowerCase()))?.[1] || '#1a3a25'
  const awayColor = Object.entries(teamColors).find(([k]) =>
    awayTeam.toLowerCase().includes(k.toLowerCase()))?.[1] || '#1a3a25'

  return {
    id: match.id || index,
    tournament: match.series || match.name || 'Cricket Match',
    flagCode: displayCode,
    type: matchType,
    home: {
      name: homeTeam,
      shortName: homeTeam.substring(0, 3).toUpperCase(),
      score: homeScore,
      overs: String(homeOvers),
      color: homeColor,
      img: homeTeamInfo?.img || null,
    },
    away: {
      name: awayTeam,
      shortName: awayTeam.substring(0, 3).toUpperCase(),
      score: awayScore,
      overs: String(awayOvers),
      color: awayColor,
      img: awayTeamInfo?.img || null,
    },
    status,
    statusText: match.status || 'Match in progress',
    minute: status === 'live' ? 'LIVE'
      : status === 'finished' ? 'FT'
      : match.dateTimeGMT
      ? new Date(match.dateTimeGMT).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : 'TBD',
    matchId: match.id,
    venue: match.venue || null,
  }
}

// ── Cricket Card ─────────────────────────────────────────────
function CricketCard({ match, onClick }) {
  const isLive = match.status === 'live'
  const isFinished = match.status === 'finished'

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: `1px solid ${isLive ? 'rgba(0,230,118,0.3)' : 'var(--border)'}`,
      borderRadius: 16, padding: '20px', cursor: 'pointer',
      transition: 'all 0.25s', position: 'relative', overflow: 'hidden',
    }}
      onClick={onClick}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)'
        e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.4)'
        e.currentTarget.style.borderColor = 'var(--accent)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.borderColor = isLive ? 'rgba(0,230,118,0.3)' : 'var(--border)'
      }}
    >
      {isLive && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 2,
          background: 'linear-gradient(90deg, transparent, var(--accent), transparent)',
        }} />
      )}

      {/* Top Row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <FlagImg code={match.flagCode} size={18} />
          <span style={{
            color: 'var(--text-muted)', fontSize: 11, fontWeight: 600,
            letterSpacing: 0.5, maxWidth: 160, overflow: 'hidden',
            textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>{match.tournament}</span>
          <TypeBadge type={match.type} />
        </div>

        {isLive ? (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 5,
            background: 'rgba(0,230,118,0.12)', border: '1px solid rgba(0,230,118,0.3)',
            borderRadius: 20, padding: '3px 10px',
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)',
              display: 'inline-block', animation: 'pulse 1.5s infinite',
              boxShadow: '0 0 8px var(--accent)',
            }} />
            <span style={{ color: 'var(--accent)', fontSize: 11, fontWeight: 800, letterSpacing: 1 }}>LIVE</span>
          </div>
        ) : isFinished ? (
          <span style={{
            color: 'var(--text-muted)', fontSize: 11, fontWeight: 600,
            background: 'var(--bg-main)', padding: '3px 10px',
            borderRadius: 20, border: '1px solid var(--border)',
          }}>FINISHED</span>
        ) : (
          <span style={{
            color: '#2196f3', fontSize: 11, fontWeight: 600,
            background: 'rgba(33,150,243,0.1)', padding: '3px 10px',
            borderRadius: 20, border: '1px solid rgba(33,150,243,0.3)',
          }}>UPCOMING</span>
        )}
      </div>

      {/* Teams */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Home Team */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <TeamBadge shortName={match.home.shortName} color={match.home.color} imgUrl={match.home.img} />
            <span style={{ color: 'var(--text-primary)', fontSize: 14, fontWeight: 600 }}>
              {match.home.name}
            </span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{
              color: isLive ? 'var(--text-primary)' : 'var(--text-dim)',
              fontSize: 18, fontWeight: 800, fontFamily: 'monospace',
            }}>{match.home.score}</span>
            {match.home.overs !== '—' && (
              <span style={{ color: 'var(--text-muted)', fontSize: 11, display: 'block' }}>
                ({match.home.overs} ov)
              </span>
            )}
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'var(--border)', position: 'relative' }}>
          <span style={{
            position: 'absolute', left: '50%', top: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'var(--bg-card)', color: 'var(--text-muted)',
            fontSize: 10, fontWeight: 700, padding: '0 8px',
          }}>VS</span>
        </div>

        {/* Away Team */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <TeamBadge shortName={match.away.shortName} color={match.away.color} imgUrl={match.away.img} />
            <span style={{ color: 'var(--text-primary)', fontSize: 14, fontWeight: 600 }}>
              {match.away.name}
            </span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{
              color: isLive ? 'var(--text-primary)' : 'var(--text-dim)',
              fontSize: 18, fontWeight: 800, fontFamily: 'monospace',
            }}>{match.away.score}</span>
            {match.away.overs !== '—' && (
              <span style={{ color: 'var(--text-muted)', fontSize: 11, display: 'block' }}>
                ({match.away.overs} ov)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Status Text */}
      <div style={{
        marginTop: 14, padding: '8px 12px',
        background: isLive ? 'rgba(0,230,118,0.06)'
          : isFinished ? 'rgba(255,255,255,0.03)'
          : 'rgba(33,150,243,0.06)',
        borderRadius: 8,
        border: `1px solid ${isLive ? 'rgba(0,230,118,0.15)' : 'var(--border)'}`,
      }}>
        <span style={{
          color: isLive ? 'var(--accent)' : isFinished ? 'var(--text-muted)' : '#2196f3',
          fontSize: 12, fontWeight: 600,
        }}>{match.statusText}</span>
      </div>
    </div>
  )
}

// ── Main Cricket Page ────────────────────────────────────────
function CricketPage({ initialMatch, onClearMatch }) {
  const [activeTab, setActiveTab] = useState('matches')
  const [filter, setFilter] = useState('all')
  const [matches, setMatches] = useState(cricketMatches)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [isLiveData, setIsLiveData] = useState(false)
  const [selectedMatch, setSelectedMatch] = useState(initialMatch || null)

  async function loadMatches() {
    setLoading(true)
    setError(false)
    try {
      const data = await getCurrentMatches()
      if (data?.data && data.data.length > 0) {
        const formatted = data.data.map((m, i) => formatAPIMatch(m, i))
        setMatches(formatted)
        setIsLiveData(true)
      } else {
        setMatches(cricketMatches)
        setIsLiveData(false)
      }
    } catch (err) {
      setMatches(cricketMatches)
      setIsLiveData(false)
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMatches()
    const interval = setInterval(loadMatches, 300000)
    return () => clearInterval(interval)
  }, [])

  // If initialMatch changes (from home page click) open it
  useEffect(() => {
    if (initialMatch) {
      setSelectedMatch(initialMatch)
    }
  }, [initialMatch])

  const filtered = filter === 'all' ? matches : matches.filter(m => m.status === filter)
  const liveCount = matches.filter(m => m.status === 'live').length

  // Show Match Detail
  if (selectedMatch) {
    return (
      <CricketMatchDetail
        match={selectedMatch}
        onBack={() => {
          setSelectedMatch(null)
          if (onClearMatch) onClearMatch()
        }}
      />
    )
  }

  return (
    <div style={{ padding: '24px' }}>

      {/* Page Header */}
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20, flexWrap: 'wrap', gap: 12,
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <span style={{ fontSize: 28 }}>🏏</span>
            <h1 style={{
              fontFamily: 'Rajdhani, sans-serif', fontSize: 28,
              fontWeight: 700, color: 'var(--text-primary)', letterSpacing: 1,
            }}>Cricket</h1>

            {liveCount > 0 && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 5,
                background: 'rgba(0,230,118,0.12)',
                border: '1px solid rgba(0,230,118,0.3)',
                borderRadius: 20, padding: '3px 10px',
              }}>
                <span style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: 'var(--accent)', display: 'inline-block',
                  animation: 'pulse 1.5s infinite', boxShadow: '0 0 8px var(--accent)',
                }} />
                <span style={{ color: 'var(--accent)', fontSize: 11, fontWeight: 800 }}>
                  {liveCount} LIVE
                </span>
              </div>
            )}

            {activeTab === 'matches' && (
              <span style={{
                background: isLiveData ? 'rgba(0,230,118,0.1)' : 'rgba(255,193,7,0.1)',
                color: isLiveData ? 'var(--accent)' : '#ffc107',
                border: `1px solid ${isLiveData ? 'rgba(0,230,118,0.3)' : 'rgba(255,193,7,0.3)'}`,
                fontSize: 10, fontWeight: 700, padding: '2px 8px',
                borderRadius: 10, letterSpacing: 0.5,
              }}>
                {isLiveData ? '🟢 LIVE DATA' : '🟡 DEMO DATA'}
              </span>
            )}
          </div>

          <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
            {activeTab === 'matches'
              ? 'Live scores, match updates and scorecards • Click any match for details'
              : 'Select a series to view standings and points table'}
          </p>
        </div>

        {/* Right side — tabs + filters */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-end' }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setActiveTab('matches')} style={{
              background: activeTab === 'matches' ? 'var(--accent)' : 'transparent',
              color: activeTab === 'matches' ? '#000' : 'var(--text-muted)',
              border: activeTab === 'matches' ? 'none' : '1px solid var(--border)',
              borderRadius: 20, padding: '7px 18px',
              fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
            }}>🏏 Matches</button>

            <button onClick={() => setActiveTab('points')} style={{
              background: activeTab === 'points' ? 'var(--accent)' : 'transparent',
              color: activeTab === 'points' ? '#000' : 'var(--text-muted)',
              border: activeTab === 'points' ? 'none' : '1px solid var(--border)',
              borderRadius: 20, padding: '7px 18px',
              fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
            }}>🏆 Points Table</button>
          </div>

          {activeTab === 'matches' && (
            <div style={{ display: 'flex', gap: 8 }}>
              {['all', 'live', 'upcoming', 'finished'].map(f => (
                <button key={f} onClick={() => setFilter(f)} style={{
                  background: filter === f ? 'rgba(0,230,118,0.15)' : 'transparent',
                  color: filter === f ? 'var(--accent)' : 'var(--text-muted)',
                  border: filter === f ? '1px solid rgba(0,230,118,0.4)' : '1px solid var(--border)',
                  borderRadius: 20, padding: '5px 14px',
                  fontSize: 11, fontWeight: 700,
                  textTransform: 'capitalize', transition: 'all 0.2s', cursor: 'pointer',
                }}>
                  {f === 'live' ? '🔴 ' : ''}
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      {activeTab === 'points' ? (
        <CricketPointsTable />
      ) : loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {error && <ErrorMessage onRetry={loadMatches} />}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: 16,
          }}>
            {filtered.map(match => (
              <CricketCard key={match.id} match={match} onClick={() => setSelectedMatch(match)} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🏏</div>
              <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>No {filter} matches right now</p>
            </div>
          )}
        </>
      )}

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
      `}</style>
    </div>
  )
}

export default CricketPage
