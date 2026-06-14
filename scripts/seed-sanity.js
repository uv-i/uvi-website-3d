// ── Sanity Seed Script ────────────────────────────────────────────────────────
// Imports your existing mockData content into Sanity so you don't have to type
// it all again manually in the Studio.
//
// Run this ONCE after setting up your Sanity project:
//   node scripts/seed-sanity.js
//
// Prerequisites:
//   1. Create a .env.seed file (copy from .env.seed.example) and fill in the values
//   2. Get a write token from sanity.io/manage → API → Tokens → Add token (Editor role)
// ─────────────────────────────────────────────────────────────────────────────

import { createClient } from '@sanity/client';
import { readFileSync }  from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// ── Load .env.seed without needing the dotenv package ────────────────────────
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath   = join(__dirname, '..', '.env.seed');

try {
  readFileSync(envPath, 'utf8')
    .split('\n')
    .forEach(line => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx === -1) return;
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim();
      if (key && !(key in process.env)) process.env[key] = val;
    });
} catch {
  // .env.seed not found — fall through and let the validation below catch it
}

// ── Validate env vars ─────────────────────────────────────────────────────────
const { SANITY_PROJECT_ID, SANITY_DATASET = 'production', SANITY_TOKEN } = process.env;

if (!SANITY_PROJECT_ID || !SANITY_TOKEN) {
  console.error('\n❌  Missing required environment variables.');
  console.error('    Create a .env.seed file with SANITY_PROJECT_ID and SANITY_TOKEN.');
  console.error('    See .env.seed.example for the template.\n');
  process.exit(1);
}

// ── Sanity write client ───────────────────────────────────────────────────────
const client = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset:   SANITY_DATASET,
  token:     SANITY_TOKEN,
  apiVersion: '2024-01-01',
  useCdn:     false, // Always use the live API for writes
});

// ── Seed data — mirrors src/data/mockData.js ──────────────────────────────────
const documents = [
  // ── UV Originals ──────────────────────────────────────────────────────────
  {
    _type: 'game',
    gameType: 'original',
    teaser: true,
    title: null,
    genre: 'Mobile · Casual',
    status: 'In Development',
    year: '2025 →',
    tags: ['Unity', 'C#', 'Firebase'],
    description: "A new UV Original in the works. We're not ready to talk about it yet — but it's coming.",
  },

  // ── Partner Games ─────────────────────────────────────────────────────────
  {
    _type: 'game',
    gameType: 'partner',
    teaser: false,
    title: 'Guess In 10',
    partnerName: 'Skillmatics',
    partnerUrl: 'https://www.skillmatics.in/collections/guess-in-10',
    role: 'Store Maintenance & Updates',
    genre: 'Mobile · Educational Trivia',
    status: '50K+ Downloads',
    year: '2023 → Now',
    tags: ['Unity', 'C#', 'Firebase', 'In-App Purchases', 'Android', 'iOS'],
    description: "10+ themes. 500+ question cards. Countless family game nights. Guess In 10 is Skillmatics' flagship trivia experience — and UV Interactives keeps it live and loved, quietly handling everything behind the scenes so players always get the best version of the game.",
    highlights: [
      '50K+ downloads across Android & iOS',
      'Lean, fast app with content delivered on demand — no bloated updates',
      'Seamless premium unlocks so players can go deeper without friction',
    ],
    androidLink: 'https://play.google.com/store/apps/details?id=com.skillmatics.guessin10&hl=en',
    iosLink: 'https://apps.apple.com/in/app/guess-in-10-by-skillmatics/id1532193910',
    trailerYoutubeId: null,
    playableUrl: null,
  },

  // ── Dev Lab Packages ──────────────────────────────────────────────────────
  {
    _type: 'devLabPackage',
    title: 'Coin Rush',
    category: 'Unity & C#',
    description: 'A playable coin-collecting game that teaches Unity fundamentals — scene setup, Rigidbody physics, trigger collisions, UI systems, and essential C# scripting patterns. Install via UPM from GitHub.',
    tags: ['Unity', 'C#', 'URP', 'Physics', 'Beginner'],
    githubUrl: 'https://github.com/uv-interactives/uvi-learn-coin-rush',
    status: 'Active',
  },
  {
    _type: 'devLabPackage',
    title: 'OOP Pillars',
    category: 'Unity & C#',
    description: 'Hands-on Unity package teaching the four pillars of Object-Oriented Programming — Encapsulation, Inheritance, Polymorphism, and Abstraction — through interactive game mechanics and practical C# examples.',
    tags: ['Unity', 'C#', 'OOP', 'Patterns', 'Intermediate'],
    githubUrl: 'https://github.com/uv-interactives/uvi-learn-oop-pillars',
    status: 'Active',
  },
];

// ── Run the import ────────────────────────────────────────────────────────────
async function seed() {
  console.log(`\n🌱  Seeding Sanity dataset "${SANITY_DATASET}" on project "${SANITY_PROJECT_ID}"...\n`);

  for (const doc of documents) {
    try {
      const result = await client.create(doc);
      console.log(`  ✅  ${doc._type.padEnd(16)} "${doc.title || '(teaser)'}"  →  ${result._id}`);
    } catch (err) {
      console.error(`  ❌  ${doc._type.padEnd(16)} "${doc.title}":  ${err.message}`);
    }
  }

  console.log('\n✨  Done! Open Sanity Studio to review the imported content.\n');
  console.log('    To run Studio:  cd studio && npm install && npm run dev\n');
}

seed().catch(err => {
  console.error('\n❌  Seed script crashed:', err.message);
  process.exit(1);
});
