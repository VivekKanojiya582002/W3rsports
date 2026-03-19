const API_KEY = import.meta.env.VITE_CRICKET_API_KEY
const BASE_URL = 'https://api.cricapi.com/v1'

// ── Cache system ─────────────────────────────────────────────
const cache = {}
const CACHE_TIME = 60000

async function fetchWithCache(url) {
  const now = Date.now()
  if (cache[url] && now - cache[url].timestamp < CACHE_TIME) {
    return cache[url].data
  }
  try {
    const response = await fetch(url)
    const data = await response.json()
    cache[url] = { data, timestamp: now }
    return data
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

// ── Get ALL matches (multiple pages) ────────────────────────
export async function getCurrentMatches() {
  try {
    const [page1, page2, page3] = await Promise.all([
      fetchWithCache(`${BASE_URL}/currentMatches?apikey=${API_KEY}&offset=0`),
      fetchWithCache(`${BASE_URL}/currentMatches?apikey=${API_KEY}&offset=25`),
      fetchWithCache(`${BASE_URL}/matches?apikey=${API_KEY}&offset=0`),
    ])

    const allMatches = [
      ...(page1?.data || []),
      ...(page2?.data || []),
      ...(page3?.data || []),
    ]

    const seen = new Set()
    const unique = allMatches.filter(m => {
      if (seen.has(m.id)) return false
      seen.add(m.id)
      return true
    })

    return { data: unique }
  } catch (error) {
    throw error
  }
}

// ── Get match scorecard ──────────────────────────────────────
export async function getMatchScorecard(matchId) {
  return fetchWithCache(`${BASE_URL}/match_scorecard?apikey=${API_KEY}&id=${matchId}`)
}

// ── Get match info ───────────────────────────────────────────
export async function getMatchInfo(matchId) {
  return fetchWithCache(`${BASE_URL}/match_info?apikey=${API_KEY}&id=${matchId}`)
}

// ── Get series list (multiple pages for more results) ────────
export async function getSeriesList() {
  try {
    const [page1, page2, page3, page4] = await Promise.all([
      fetchWithCache(`${BASE_URL}/series?apikey=${API_KEY}&offset=0`),
      fetchWithCache(`${BASE_URL}/series?apikey=${API_KEY}&offset=25`),
      fetchWithCache(`${BASE_URL}/series?apikey=${API_KEY}&offset=50`),
      fetchWithCache(`${BASE_URL}/series?apikey=${API_KEY}&offset=75`),
    ])

    const allSeries = [
      ...(page1?.data || []),
      ...(page2?.data || []),
      ...(page3?.data || []),
      ...(page4?.data || []),
    ]

    // Remove duplicates
    const seen = new Set()
    const unique = allSeries.filter(s => {
      if (seen.has(s.id)) return false
      seen.add(s.id)
      return true
    })

    return { data: unique }
  } catch (error) {
    throw error
  }
}