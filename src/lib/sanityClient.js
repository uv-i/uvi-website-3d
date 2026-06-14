// ── Sanity Client ─────────────────────────────────────────────────────────────
// Configured once here and imported wherever data is needed.
//
// Environment variables (set in .env.local for dev, Vercel dashboard for prod):
//   VITE_SANITY_PROJECT_ID  — your project ID from sanity.io/manage
//   VITE_SANITY_DATASET     — usually "production"
//
// These are intentionally public — Sanity's read API for a public dataset
// doesn't require a secret token. CORS and dataset settings control access.

import { createClient } from '@sanity/client';

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID;
const dataset   = import.meta.env.VITE_SANITY_DATASET || 'production';

// True when both env vars are present — used to decide whether to fetch from CMS
// or fall back to the local mockData.js values.
export const isSanityConfigured = Boolean(projectId);

export const sanityClient = isSanityConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion: '2024-01-01', // Pin to a stable API version; update once a year
      useCdn: true,             // Reads from Sanity's global CDN — fast, cached
    })
  : null;
