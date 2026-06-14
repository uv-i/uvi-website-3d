// ── Sanity Data Hooks ─────────────────────────────────────────────────────────
// These hooks fetch live content from Sanity CMS.
//
// HOW IT WORKS:
//   - If VITE_SANITY_PROJECT_ID is set → fetch from Sanity on page load
//   - If the env var is missing (local dev without CMS) → use mockData.js instantly
//   - If the Sanity fetch fails for any reason → fall back to mockData.js silently
//
// This means the site NEVER breaks, even if Sanity is misconfigured.

import { useState, useEffect } from 'react';
import { sanityClient, isSanityConfigured } from '../lib/sanityClient';
import { GAMES_QUERY, DEVLAB_QUERY }         from '../lib/sanityQueries';
import { UV_PROJECTS, PARTNER_PROJECTS, TEACHING_DATA } from '../data/mockData';

// ── useGamesData ──────────────────────────────────────────────────────────────
// Returns UV Originals and Partner Projects, either from Sanity or mockData.js.
//
// Usage in a component:
//   const { uvProjects, partnerProjects, loading } = useGamesData();

export function useGamesData() {
  const [uvProjects,      setUvProjects]      = useState(UV_PROJECTS);
  const [partnerProjects, setPartnerProjects] = useState(PARTNER_PROJECTS);
  const [loading,         setLoading]         = useState(isSanityConfigured);
  const [error,           setError]           = useState(null);

  useEffect(() => {
    // Skip fetch if Sanity isn't configured — use mockData.js as-is
    if (!isSanityConfigured) return;

    sanityClient
      .fetch(GAMES_QUERY)
      .then(games => {
        const originals = games.filter(g => g.gameType === 'original');
        const partners  = games.filter(g => g.gameType === 'partner');
        // Only override if Sanity actually returned data (prevents empty-state flash)
        if (originals.length > 0) setUvProjects(originals);
        if (partners.length  > 0) setPartnerProjects(partners);
      })
      .catch(err => {
        console.warn('[Sanity] Games fetch failed — showing local data instead:', err.message);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  return { uvProjects, partnerProjects, loading, error };
}

// ── useDevLabData ─────────────────────────────────────────────────────────────
// Returns TEACHING_DATA shape (object keyed by category/tab name), either from
// Sanity or mockData.js.
//
// Usage in a component:
//   const { teachingData, loading } = useDevLabData();
//   const tabs = Object.keys(teachingData);

export function useDevLabData() {
  const [teachingData, setTeachingData] = useState(TEACHING_DATA);
  const [loading,      setLoading]      = useState(isSanityConfigured);
  const [error,        setError]        = useState(null);

  useEffect(() => {
    if (!isSanityConfigured) return;

    sanityClient
      .fetch(DEVLAB_QUERY)
      .then(packages => {
        if (packages.length === 0) return; // Don't replace mockData with an empty set
        // Group the flat array by category to match the TEACHING_DATA shape
        const grouped = packages.reduce((acc, pkg) => {
          const cat = pkg.category || 'General';
          if (!acc[cat]) acc[cat] = [];
          acc[cat].push(pkg);
          return acc;
        }, {});
        setTeachingData(grouped);
      })
      .catch(err => {
        console.warn('[Sanity] Dev Lab fetch failed — showing local data instead:', err.message);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  return { teachingData, loading, error };
}
