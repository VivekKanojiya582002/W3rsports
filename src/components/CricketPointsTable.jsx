import { useState, useEffect } from 'react'
import { getSeriesList } from '../api/cricket'

const API_KEY = import.meta.env.VITE_CRICKET_API_KEY
const BASE_URL = 'https://api.cricapi.com/v1'

// ── Flag Image ───────────────────────────────────────────────
function FlagImg({ code, size = 18 }) {
  if (!code) return null
  return (
    <img
      src={`https://flagcdn.com/w40/${code}.png`}
      alt={code}
      style={{
        width: size * 1.4, height: size,
        objectFit: 'cover', borderRadius: 3,
      }}
      onError={e => { e.target.style.display = 'none' }}
    />
  )
}

// ── Get country code from team name ─────────────────────────
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
  const pakistan = ['pakistan', 'karachi', 'lahore', 'peshawar', 'quetta',
    'islamabad', 'multan',
  ]
  const newZealand = ['new zealand', 'auckland', 'wellington', 'canterbury',
    'otago', 'central districts', 'northern districts',
  ]
  const others = {
    'west indies': 'bb', 'windies': 'bb', 'sri lanka': 'lk',
    'bangladesh': 'bd', 'zimbabwe': 'zw', 'afghanistan': 'af',
    'ireland': 'ie', 'scotland': 'gb-sct', 'netherlands': 'nl',
    'nepal': 'np', 'uae': 'ae', 'oman': 'om', 'malaysia': 'my',
    'singapore': 'sg', 'namibia': 'na', 'uganda': 'ug', 'kenya': 'ke',
    'botswana': 'bw', 'lesotho': 'ls', 'nigeria': 'ng', 'ghana': 'gh',
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

// ── Loading Spinner ──────────────────────────────────────────
function LoadingSpinner({ text = 'Loading...' }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '60px 24px', gap: 16,
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: '50%',
        border: '3px solid var(--border)',
        borderTop: '3px solid var(--accent)',
        animation: 'spin 0.8s linear infinite',
      }} />
      <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>{text}</p>
      <style>{`@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}`}</style>
    </div>
  )
}

// ── Points Table Row ─────────────────────────────────────────
function TableRow({ team, rank, highlight }) {
  const code = getCountryCode(team.team)
  return (
    <tr style={{
      background: highlight ? 'rgba(0,230,118,0.05)' : 'transparent',
      borderBottom: '1px solid rgba(255,255,255,0.04)',
      transition: 'background 0.15s',
    }}
      onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,230,118,0.08)'}
      onMouseLeave={e => e.currentTarget.style.background = highlight ? 'rgba(0,230,118,0.05)' : 'transparent'}
    >
      {/* Rank */}
      <td style={{ padding: '12px 16px', textAlign: 'center' }}>
        <span style={{
          width: 24, height: 24, borderRadius: '50%',
          background: rank <= 4 ? 'rgba(0,230,118,0.15)' : 'rgba(255,255,255,0.05)',
          color: rank <= 4 ? 'var(--accent)' : 'var(--text-muted)',
          fontSize: 12, fontWeight: 700,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        }}>{rank}</span>
      </td>

      {/* Team */}
      <td style={{ padding: '12px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {team.img ? (
            <img src={team.img} alt={team.team}
              style={{ width: 28, height: 28, objectFit: 'contain' }}
              onError={e => e.target.style.display = 'none'}
            />
          ) : (
            <div style={{
              width: 28, height: 28, borderRadius: 6,
              background: 'rgba(0,230,118,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 10, fontWeight: 800, color: 'var(--accent)',
              fontFamily: 'Rajdhani, sans-serif',
            }}>
              {team.team?.substring(0, 3).toUpperCase()}
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {code && <FlagImg code={code} size={14} />}
            <span style={{ color: 'var(--text-primary)', fontSize: 13, fontWeight: 600 }}>
              {team.team}
            </span>
          </div>
        </div>
      </td>

      {/* Stats */}
      {[team.matches, team.wins, team.loss, team.ties ?? '-', team.nr ?? '-', team.pts, team.nrr].map((val, i) => (
        <td key={i} style={{
          padding: '12px 16px', textAlign: 'center',
          color: i === 5 ? 'var(--accent)' : 'var(--text-muted)',
          fontSize: 13,
          fontWeight: i === 5 ? 700 : 400,
          fontFamily: 'monospace',
        }}>
          {val ?? '-'}
        </td>
      ))}
    </tr>
  )
}

// ── Series Card ──────────────────────────────────────────────
function SeriesCard({ series, isSelected, onClick }) {
  return (
    <div onClick={onClick} style={{
      background: isSelected ? 'rgba(0,230,118,0.1)' : 'var(--bg-card)',
      border: `1px solid ${isSelected ? 'rgba(0,230,118,0.4)' : 'var(--border)'}`,
      borderRadius: 12, padding: '14px 16px',
      cursor: 'pointer', transition: 'all 0.2s',
    }}
      onMouseEnter={e => {
        if (!isSelected) e.currentTarget.style.borderColor = 'rgba(0,230,118,0.25)'
      }}
      onMouseLeave={e => {
        if (!isSelected) e.currentTarget.style.borderColor = 'var(--border)'
      }}
    >
      <div style={{ color: 'var(--text-primary)', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
        {series.name}
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {series.startDate && (
          <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>
            📅 {new Date(series.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
        )}
        {series.odi !== undefined && (
          <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>
            ODI: {series.odi} • T20: {series.t20} • TEST: {series.test}
          </span>
        )}
      </div>
    </div>
  )
}

// ── Main Points Table ────────────────────────────────────────
function CricketPointsTable() {
  const [series, setSeries] = useState([])
  const [selectedSeries, setSelectedSeries] = useState(null)
  const [pointsTable, setPointsTable] = useState([])
  const [loadingSeries, setLoadingSeries] = useState(true)
  const [loadingTable, setLoadingTable] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Load series list
  useEffect(() => {
    async function loadSeries() {
      setLoadingSeries(true)
      try {
        const data = await getSeriesList()
        if (data?.data) {
          setSeries(data.data)
        }
      } catch (err) {
        console.error('Series error:', err)
      } finally {
        setLoadingSeries(false)
      }
    }
    loadSeries()
  }, [])

  // Load points table for selected series
  async function loadPointsTable(seriesId) {
    setLoadingTable(true)
    setPointsTable([])
    try {
      const res = await fetch(
        `${BASE_URL}/series_points?apikey=${API_KEY}&id=${seriesId}`
      )
      const data = await res.json()
      if (data?.data) {
        setPointsTable(data.data)
      }
    } catch (err) {
      console.error('Points table error:', err)
    } finally {
      setLoadingTable(false)
    }
  }

  function handleSeriesSelect(s) {
    setSelectedSeries(s)
    loadPointsTable(s.id)
  }

  const filteredSeries = series.filter(s =>
    s.name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div style={{ padding: '24px' }}>

      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center',
        gap: 10, marginBottom: 8,
      }}>
        <span style={{ fontSize: 28 }}>🏆</span>
        <h1 style={{
          fontFamily: 'Rajdhani, sans-serif', fontSize: 28,
          fontWeight: 700, color: 'var(--text-primary)', letterSpacing: 1,
        }}>Points Table</h1>
      </div>
      <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 24 }}>
        Select a series to view standings
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 20 }}>

        {/* Left — Series List */}
        <div>
          {/* Search */}
          <input
            type="text"
            placeholder="🔍 Search series..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%', padding: '10px 14px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 10, color: 'var(--text-primary)',
              fontSize: 13, marginBottom: 12,
              outline: 'none', boxSizing: 'border-box',
            }}
          />

          {/* Series Cards */}
          <div style={{
            display: 'flex', flexDirection: 'column', gap: 8,
            maxHeight: '70vh', overflowY: 'auto',
            paddingRight: 4,
          }}>
            {loadingSeries ? (
              <LoadingSpinner text="Loading series..." />
            ) : filteredSeries.length > 0 ? (
              filteredSeries.map(s => (
                <SeriesCard
                  key={s.id}
                  series={s}
                  isSelected={selectedSeries?.id === s.id}
                  onClick={() => handleSeriesSelect(s)}
                />
              ))
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: 13, textAlign: 'center', padding: 20 }}>
                No series found
              </p>
            )}
          </div>
        </div>

        {/* Right — Points Table */}
        <div>
          {!selectedSeries ? (
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 14, padding: '60px 24px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🏆</div>
              <h3 style={{ color: 'var(--text-primary)', fontSize: 16, fontWeight: 700, marginBottom: 8 }}>
                Select a Series
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                Click any series on the left to view its points table
              </p>
            </div>
          ) : loadingTable ? (
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 14,
            }}>
              <LoadingSpinner text="Loading points table..." />
            </div>
          ) : pointsTable.length > 0 ? (
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 14, overflow: 'hidden',
            }}>
              {/* Table Header */}
              <div style={{
                padding: '16px 20px',
                borderBottom: '1px solid var(--border)',
                background: 'var(--bg-nav)',
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <span style={{ fontSize: 18 }}>🏆</span>
                <span style={{ color: 'var(--text-primary)', fontSize: 14, fontWeight: 700 }}>
                  {selectedSeries.name}
                </span>
              </div>

              {/* Table */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                      {['#', 'Team', 'M', 'W', 'L', 'T', 'NR', 'PTS', 'NRR'].map(h => (
                        <th key={h} style={{
                          padding: '10px 16px',
                          color: 'var(--accent)', fontSize: 11,
                          fontWeight: 700, textAlign: h === 'Team' ? 'left' : 'center',
                          letterSpacing: 0.5,
                          background: 'rgba(0,0,0,0.2)',
                        }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {pointsTable.map((team, i) => (
                      <TableRow
                        key={i}
                        team={team}
                        rank={i + 1}
                        highlight={i < 4}
                      />
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Legend */}
              <div style={{
                padding: '12px 20px',
                borderTop: '1px solid var(--border)',
                display: 'flex', gap: 16,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{
                    width: 10, height: 10, borderRadius: 2,
                    background: 'rgba(0,230,118,0.2)',
                  }} />
                  <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>
                    Qualification zone
                  </span>
                </div>
                <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>
                  M=Matches • W=Won • L=Lost • T=Tied • NR=No Result • PTS=Points • NRR=Net Run Rate
                </span>
              </div>
            </div>
          ) : (
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 14, padding: '60px 24px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
              <h3 style={{ color: 'var(--text-primary)', fontSize: 16, fontWeight: 700, marginBottom: 8 }}>
                No Points Table Available
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                This series may not have a points table yet, or it's a bilateral series.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CricketPointsTable
