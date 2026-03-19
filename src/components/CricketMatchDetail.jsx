import { useState, useEffect } from 'react'
import { getMatchInfo } from '../api/cricket'

// ── Flag Image ───────────────────────────────────────────────
function FlagImg({ code, size = 20 }) {
  if (!code) return <span style={{ fontSize: size }}>🏏</span>
  return (
    <img
      src={`https://flagcdn.com/w40/${code}.png`}
      alt={code}
      style={{
        width: size * 1.4, height: size,
        objectFit: 'cover', borderRadius: 3,
        display: 'inline-block',
      }}
      onError={e => { e.target.style.display = 'none' }}
    />
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
      <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Loading match info...</p>
      <style>{`@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}`}</style>
    </div>
  )
}

// ── Info Row ─────────────────────────────────────────────────
function InfoRow({ icon, label, value }) {
  if (!value) return null
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start',
      gap: 12, padding: '12px 0',
      borderBottom: '1px solid rgba(255,255,255,0.04)',
    }}>
      <span style={{ fontSize: 18, flexShrink: 0 }}>{icon}</span>
      <div>
        <div style={{ color: 'var(--text-muted)', fontSize: 11, fontWeight: 600, marginBottom: 3 }}>
          {label}
        </div>
        <div style={{ color: 'var(--text-primary)', fontSize: 13, fontWeight: 600, lineHeight: 1.5 }}>
          {value}
        </div>
      </div>
    </div>
  )
}

// ── Score Card ───────────────────────────────────────────────
function InningsScore({ score, teamName }) {
  if (!score) return null
  return (
    <div style={{
      background: 'rgba(0,230,118,0.05)',
      border: '1px solid rgba(0,230,118,0.15)',
      borderRadius: 10, padding: '12px 16px',
      marginBottom: 8,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: 'var(--text-muted)', fontSize: 12, fontWeight: 600 }}>
          {score.inning || teamName}
        </span>
        <span style={{
          color: 'var(--text-primary)', fontSize: 22,
          fontWeight: 900, fontFamily: 'monospace',
        }}>
          {score.r}/{score.w}
        </span>
      </div>
      <div style={{ color: 'var(--text-muted)', fontSize: 11, marginTop: 4 }}>
        {score.o} overs
        {score.rr && ` • Run Rate: ${score.rr}`}
      </div>
    </div>
  )
}

// ── Main Match Detail ────────────────────────────────────────
function CricketMatchDetail({ match, onBack }) {
  const [matchInfo, setMatchInfo] = useState(null)
  const [loading, setLoading] = useState(true)

  const isLive = match.status === 'live'

  useEffect(() => {
    async function loadInfo() {
      setLoading(true)
      try {
        const data = await getMatchInfo(match.matchId)
        if (data?.data) setMatchInfo(data.data)
      } catch (err) {
        console.error('Match info error:', err)
      } finally {
        setLoading(false)
      }
    }
    if (match.matchId) loadInfo()
    else setLoading(false)
  }, [match.matchId])

  return (
    <div style={{ padding: '24px', maxWidth: 900, margin: '0 auto' }}>

      {/* Score Header Card */}
      <div style={{
        background: 'linear-gradient(135deg, #0a2a15 0%, #0f2218 100%)',
        border: `1px solid ${isLive ? 'rgba(0,230,118,0.3)' : 'var(--border)'}`,
        borderRadius: 16, padding: '24px',
        marginBottom: 20, position: 'relative', overflow: 'hidden',
      }}>
        {/* Live top border glow */}
        {isLive && (
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 2,
            background: 'linear-gradient(90deg, transparent, var(--accent), transparent)',
          }} />
        )}

        {/* Back Button */}
        <button onClick={onBack} style={{
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid var(--border)',
          borderRadius: 8, padding: '6px 14px',
          color: 'var(--text-primary)', fontSize: 13,
          fontWeight: 600, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 6,
          marginBottom: 20,
        }}>← Back to Matches</button>

        {/* Tournament Info */}
        <div style={{
          display: 'flex', alignItems: 'center',
          gap: 8, marginBottom: 20, flexWrap: 'wrap',
        }}>
          <FlagImg code={match.flagCode} size={18} />
          <span style={{ color: 'var(--text-muted)', fontSize: 12, fontWeight: 600 }}>
            {match.tournament}
          </span>
          <span style={{
            background: 'rgba(0,230,118,0.15)', color: 'var(--accent)',
            fontSize: 10, fontWeight: 700, padding: '2px 8px',
            borderRadius: 10, letterSpacing: 1,
          }}>{match.type}</span>
          {isLive && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 5,
              background: 'rgba(0,230,118,0.12)',
              border: '1px solid rgba(0,230,118,0.3)',
              borderRadius: 20, padding: '3px 10px', marginLeft: 'auto',
            }}>
              <span style={{
                width: 6, height: 6, borderRadius: '50%',
                background: 'var(--accent)', display: 'inline-block',
                animation: 'pulse 1.5s infinite', boxShadow: '0 0 8px var(--accent)',
              }} />
              <span style={{ color: 'var(--accent)', fontSize: 11, fontWeight: 800 }}>LIVE</span>
            </div>
          )}
        </div>

        {/* Teams Score */}
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', gap: 16,
        }}>
          {/* Home Team */}
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{
              width: 56, height: 56, borderRadius: 14,
              background: match.home.color + '33',
              border: `2px solid ${match.home.color}66`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 10px',
              fontWeight: 800, fontSize: 16, color: '#fff',
              fontFamily: 'Rajdhani, sans-serif',
            }}>{match.home.shortName}</div>
            <div style={{ color: 'var(--text-primary)', fontSize: 15, fontWeight: 700, marginBottom: 4 }}>
              {match.home.name}
            </div>
            <div style={{
              color: 'var(--text-primary)', fontSize: 30,
              fontWeight: 900, fontFamily: 'monospace',
            }}>{match.home.score}</div>
            {match.home.overs !== '—' && (
              <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>
                ({match.home.overs} overs)
              </div>
            )}
          </div>

          {/* VS */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: 13, fontWeight: 700, marginBottom: 8 }}>VS</div>
            <div style={{
              color: isLive ? 'var(--accent)' : 'var(--text-muted)',
              fontSize: 12, fontWeight: 700, fontFamily: 'monospace',
            }}>{match.minute}</div>
          </div>

          {/* Away Team */}
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{
              width: 56, height: 56, borderRadius: 14,
              background: match.away.color + '33',
              border: `2px solid ${match.away.color}66`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 10px',
              fontWeight: 800, fontSize: 16, color: '#fff',
              fontFamily: 'Rajdhani, sans-serif',
            }}>{match.away.shortName}</div>
            <div style={{ color: 'var(--text-primary)', fontSize: 15, fontWeight: 700, marginBottom: 4 }}>
              {match.away.name}
            </div>
            <div style={{
              color: 'var(--text-primary)', fontSize: 30,
              fontWeight: 900, fontFamily: 'monospace',
            }}>{match.away.score}</div>
            {match.away.overs !== '—' && (
              <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>
                ({match.away.overs} overs)
              </div>
            )}
          </div>
        </div>

        {/* Status Bar */}
        <div style={{
          marginTop: 16, padding: '10px 16px',
          background: isLive ? 'rgba(0,230,118,0.06)' : 'rgba(255,255,255,0.03)',
          borderRadius: 8,
          border: `1px solid ${isLive ? 'rgba(0,230,118,0.15)' : 'var(--border)'}`,
          textAlign: 'center',
        }}>
          <span style={{
            color: isLive ? 'var(--accent)' : 'var(--text-muted)',
            fontSize: 13, fontWeight: 600,
          }}>{match.statusText}</span>
        </div>
      </div>

      {/* Match Info Section */}
      {loading ? <LoadingSpinner /> : matchInfo ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

          {/* Left — Innings Scores */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 14, padding: '20px',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              marginBottom: 16,
              paddingBottom: 12, borderBottom: '1px solid var(--border)',
            }}>
              <span style={{ fontSize: 18 }}>📊</span>
              <span style={{ color: 'var(--text-primary)', fontSize: 14, fontWeight: 700 }}>
                Innings Scores
              </span>
            </div>

            {matchInfo.score && matchInfo.score.length > 0 ? (
              matchInfo.score.map((s, i) => (
                <InningsScore key={i} score={s} />
              ))
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                No scores available yet
              </p>
            )}
          </div>

          {/* Right — Match Info */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 14, padding: '20px',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              marginBottom: 16,
              paddingBottom: 12, borderBottom: '1px solid var(--border)',
            }}>
              <span style={{ fontSize: 18 }}>ℹ️</span>
              <span style={{ color: 'var(--text-primary)', fontSize: 14, fontWeight: 700 }}>
                Match Info
              </span>
            </div>

            <InfoRow icon="🏟️" label="Venue" value={matchInfo.venue} />
            <InfoRow icon="🪙" label="Toss" value={matchInfo.tossWinner
              ? `${matchInfo.tossWinner} won the toss and chose to ${matchInfo.tossChoice}`
              : null}
            />
            <InfoRow icon="📅" label="Date" value={matchInfo.dateTimeGMT
              ? new Date(matchInfo.dateTimeGMT).toLocaleDateString('en-IN', {
                weekday: 'short', day: 'numeric', month: 'long', year: 'numeric'
              })
              : null}
            />
            <InfoRow icon="🏏" label="Match Type" value={matchInfo.matchType?.toUpperCase()} />
            <InfoRow icon="👨‍⚖️" label="Umpires" value={
              matchInfo.umpire1 && matchInfo.umpire2
                ? `${matchInfo.umpire1}, ${matchInfo.umpire2}`
                : matchInfo.umpire1 || null
            } />
            <InfoRow icon="⭐" label="Match Referee" value={matchInfo.matchReferee} />
            <InfoRow icon="🏆" label="Series" value={matchInfo.series_id ? match.tournament : null} />
          </div>

          {/* Bottom — Teams Info */}
          {matchInfo.teamInfo && matchInfo.teamInfo.length > 0 && (
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 14, padding: '20px',
              gridColumn: '1 / -1',
            }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                marginBottom: 16,
                paddingBottom: 12, borderBottom: '1px solid var(--border)',
              }}>
                <span style={{ fontSize: 18 }}>🏏</span>
                <span style={{ color: 'var(--text-primary)', fontSize: 14, fontWeight: 700 }}>
                  Teams
                </span>
              </div>
              <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                {matchInfo.teamInfo.map((team, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {team.img && (
                      <img src={team.img} alt={team.name}
                        style={{ width: 40, height: 40, objectFit: 'contain' }}
                        onError={e => e.target.style.display = 'none'}
                      />
                    )}
                    <div>
                      <div style={{ color: 'var(--text-primary)', fontSize: 14, fontWeight: 700 }}>
                        {team.name}
                      </div>
                      <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>
                        {team.shortname}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        // No info available — show what we have
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 14, padding: '32px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
          <h3 style={{ color: 'var(--text-primary)', fontSize: 16, fontWeight: 700, marginBottom: 8 }}>
            Detailed Info Not Available
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
            Match scores are shown above. Detailed scorecard requires a paid API plan.
          </p>
        </div>
      )}

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
      `}</style>
    </div>
  )
}

export default CricketMatchDetail
