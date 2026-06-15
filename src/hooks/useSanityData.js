// ── Sanity Data Hooks ─────────────────────────────────────────────────────────
// HOW IT WORKS:
//   1. localStorage cache — if fresh (< 1 hr), use it instantly, no network call
//   2. Module-level in-memory store — all hook instances across pages share the
//      same in-flight fetch promise. HomePage starts the fetch; by the time the
//      user navigates to Games or Dev Lab, the result is already in memory.
//   3. If fetch fails for any reason → silently stay on mockData / stale cache
//
// Result: users never wait. The Sanity cold-start happens once in the background
// on first home page load, invisible to the user.

import { useState, useEffect } from 'react';
import { sanityClient, isSanityConfigured } from '../lib/sanityClient';
import { GAMES_QUERY, DEVLAB_QUERY }         from '../lib/sanityQueries';
import { UV_PROJECTS, PARTNER_PROJECTS, TEACHING_DATA } from '../data/mockData';

const CACHE_TTL = 60 * 60 * 1000; // 1 hour

// ── localStorage helpers ──────────────────────────────────────────────────────
function readCache(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const { data, timestamp } = JSON.parse(raw);
    if (Date.now() - timestamp > CACHE_TTL) return null;
    return data;
  } catch { return null; }
}

function writeCache(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
  } catch {}
}

// ── Module-level shared state ─────────────────────────────────────────────────
// These live outside React — shared across every hook instance on every page.
// Once HomePage kicks off the fetch, navigating to Games reuses the same promise.
const mem   = {};   // resolved data (in-memory, current session)
const inflight = {}; // in-flight promises (prevents duplicate fetches)

function fetchOnce(key, fetchFn) {
  if (mem[key])      return Promise.resolve(mem[key]);
  if (inflight[key]) return inflight[key];

  inflight[key] = fetchFn()
    .then(data => { mem[key] = data; writeCache(key, data); return data; })
    .catch(err  => { console.warn(`[Sanity] ${key} fetch failed:`, err.message); return null; })
    .finally(() => { delete inflight[key]; });

  return inflight[key];
}

// ── useGamesData ──────────────────────────────────────────────────────────────
export function useGamesData() {
  const lsCache = isSanityConfigured ? readCache('uvi_sanity_games') : null;
  const initial = mem['uvi_sanity_games'] ?? lsCache;

  const [uvProjects,      setUvProjects]      = useState(initial?.uvProjects      ?? UV_PROJECTS);
  const [partnerProjects, setPartnerProjects] = useState(initial?.partnerProjects ?? PARTNER_PROJECTS);
  const [loading,         setLoading]         = useState(false);
  const [error,           setError]           = useState(null);

  useEffect(() => {
    if (!isSanityConfigured || initial) return; // cache hit — nothing to do

    setLoading(true);
    fetchOnce('uvi_sanity_games', () =>
      sanityClient.fetch(GAMES_QUERY).then(games => {
        const uvProjects      = games.filter(g => g.gameType === 'original');
        const partnerProjects = games.filter(g => g.gameType === 'partner');
        return {
          uvProjects:      uvProjects.length      > 0 ? uvProjects      : UV_PROJECTS,
          partnerProjects: partnerProjects.length > 0 ? partnerProjects : PARTNER_PROJECTS,
        };
      })
    ).then(data => {
      if (!data) { setError('fetch failed'); return; }
      setUvProjects(data.uvProjects);
      setPartnerProjects(data.partnerProjects);
    }).finally(() => setLoading(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { uvProjects, partnerProjects, loading, error };
}

// ── useDevLabData ─────────────────────────────────────────────────────────────
export function useDevLabData() {
  const lsCache = isSanityConfigured ? readCache('uvi_sanity_devlab') : null;
  const initial = mem['uvi_sanity_devlab'] ?? lsCache;

  const [teachingData, setTeachingData] = useState(initial ?? TEACHING_DATA);
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState(null);

  useEffect(() => {
    if (!isSanityConfigured || initial) return;

    setLoading(true);
    fetchOnce('uvi_sanity_devlab', () =>
      sanityClient.fetch(DEVLAB_QUERY).then(packages => {
        if (packages.length === 0) return TEACHING_DATA;
        return packages.reduce((acc, pkg) => {
          const cat = pkg.category || 'General';
          if (!acc[cat]) acc[cat] = [];
          acc[cat].push(pkg);
          return acc;
        }, {});
      })
    ).then(data => {
      if (!data) { setError('fetch failed'); return; }
      setTeachingData(data);
    }).finally(() => setLoading(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { teachingData, loading, error };
}
