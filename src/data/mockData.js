// ── APP CONFIG ────────────────────────────────────────────────────────────────
export const APP_CONFIG = {
  studio: 'UV Interactives',
  contactEmail: 'huntingblu@gmail.com',
  contactLocation: 'Chennai, India',
  // Set to a YouTube video ID (e.g. 'dQw4w9WgXcQ') to make the showreel go live.
  showreelYoutubeId: null,
  socials: {
    github: 'https://github.com/uv-interactives',
  },
};

// ── UV ORIGINALS (self-owned IPs) ─────────────────────────────────────────────
// These are games UV Interactives fully owns and ships under its own brand.
// Add real entries here as they launch.
export const UV_PROJECTS = [
  {
    id: 'uv-dev-1',
    teaser: true,
    title: null,                       // Redacted — shown as ████████
    genre: 'Mobile · Casual',
    status: 'In Development',
    year: '2025 →',
    tags: ['Unity', 'C#', 'Firebase'],
    description: 'A new UV Original in the works. We\'re not ready to talk about it yet — but it\'s coming.',
  },
];

// ── PROUD PARTNERS (maintained / contracted work) ────────────────────────────
// Games UV Interactives maintains on behalf of client studios / brands.
// Always attribute the IP owner clearly.
export const PARTNER_PROJECTS = [
  {
    id: 'partner-1',
    title: 'Guess In 10',
    partnerName: 'Skillmatics',
    partnerUrl: 'https://www.skillmatics.in/collections/guess-in-10',
    role: 'Store Maintenance & Updates',
    genre: 'Mobile · Educational Trivia',
    status: '50K+ Downloads',
    year: '2023 → Now',
    tags: ['Unity', 'C#', 'Firebase', 'In-App Purchases', 'Android', 'iOS'],
    description:
      '10+ themes. 500+ question cards. Countless family game nights. Guess In 10 is Skillmatics\' flagship trivia experience — and UV Interactives keeps it live and loved, quietly handling everything behind the scenes so players always get the best version of the game.',
    highlights: [
      '50K+ downloads across Android & iOS',
      'Lean, fast app with content delivered on demand — no bloated updates',
      'Seamless premium unlocks so players can go deeper without friction',
    ],
    androidLink: 'https://play.google.com/store/apps/details?id=com.skillmatics.guessin10&hl=en',
    iosLink: 'https://apps.apple.com/in/app/guess-in-10-by-skillmatics/id1532193910',
    // ── Detail panel extras ──────────────────────────────────────────────────
    trailerYoutubeId: null,   // Set to YouTube video ID when available
    screenshots: [],           // Array of image URLs — leave empty to show placeholder grid
    playableUrl: null,         // URL for inline HTML game — future feature
  },
];

// ── TEACHING / DEV LAB ────────────────────────────────────────────────────────
// Keyed by tab label so DevLabPage can render tabs dynamically.
// Add new tabs here and the UI picks them up automatically.
export const TEACHING_DATA = {
  'Unity & C#': [
    {
      id: 'teach-1',
      title: 'Coin Rush',
      description:
        'A playable coin-collecting game that teaches Unity fundamentals — scene setup, Rigidbody physics, trigger collisions, UI systems, and essential C# scripting patterns. Install via UPM from GitHub.',
      tags: ['Unity', 'C#', 'URP', 'Physics', 'Beginner'],
      githubUrl: 'https://github.com/uv-interactives/uvi-learn-coin-rush',
      status: 'Active',
      category: 'Unity Basics',
    },
    {
      id: 'teach-2',
      title: 'OOP Pillars',
      description:
        'Hands-on Unity package teaching the four pillars of Object-Oriented Programming — Encapsulation, Inheritance, Polymorphism, and Abstraction — through interactive game mechanics and practical C# examples.',
      tags: ['Unity', 'C#', 'OOP', 'Patterns', 'Intermediate'],
      githubUrl: 'https://github.com/uv-interactives/uvi-learn-oop-pillars',
      status: 'Active',
      category: 'C# Concepts',
    },
  ],
};

// ── CHATBOT PERSONA ───────────────────────────────────────────────────────────
export const CHATBOT_PERSONA = {
  facts: [
    {
      text: 'UV Interactives maintains Skillmatics\' Guess In 10 — 50K+ downloads on Android & iOS! 🎮',
      route: '/games',
      routeLabel: 'See our work',
      state: { tab: 'partners', gameIndex: 0 },
    },
    {
      text: 'We ship games across Mobile, WebGL, and Fortnite — 8+ years in the industry and still going. 🔥',
      route: null,
      routeLabel: null,
    },
    {
      text: 'Dev Lab is open! Free Unity & C# packages you can install straight from GitHub via UPM. 📦',
      route: '/lab',
      routeLabel: 'Open Dev Lab',
    },
    {
      text: 'We build Fortnite islands using UEFN and Verse scripting — tycoons, battle arenas, live events. ⚡',
      route: '/contact',
      routeLabel: 'Start a Fortnite project',
    },
    {
      text: 'Everything we build for the community is free and open source — no paywalls, no signups. 💜',
      route: null,
      routeLabel: null,
    },
    {
      text: 'Looking to build a WebGL game or playable ad? We do that too — instant play, no install needed. 🌐',
      route: '/contact',
      routeLabel: 'Get in touch',
    },
    {
      text: 'Firebase backend, AR experiences, store live ops — we handle the full stack so you ship faster. 🚀',
      route: '/contact',
      routeLabel: 'Start a project',
    },
    {
      text: 'UV Originals are in development — our own games, fully owned by the studio. Coming soon! 👀',
      route: '/games',
      routeLabel: 'See Games page',
    },
    {
      text: 'Coin Rush and OOP Pillars are free Unity teaching packages — great for beginners and students! 🎓',
      route: '/lab',
      routeLabel: 'Open Dev Lab',
    },
    {
      text: 'We\'re based in Chennai, India and open for new projects. Want to build something together? 🦁',
      route: '/contact',
      routeLabel: 'Contact us',
    },
  ],
  intros: [
    'Rrr-oar! I\'m Leo, UV Interactives\' mascot! Ask me about our work, services, or how to start a project! 🦁',
    'Hey! I\'m Leo! The team is busy building games — but I know everything about UV Interactives. What do you want to know? ⚔️',
  ],
  systemPrompt: `You are Leo, the lion cub mascot and AI assistant for UV Interactives — a game development studio based in Chennai, India.

=== ABOUT UV INTERACTIVES ===
UV Interactives is a game development studio with 8+ years in the industry, specialising in Unity mobile games, WebGL, and Fortnite (UEFN/Verse).
- We maintain Skillmatics' Guess In 10 (50K+ downloads) as a store partner
- UV Originals (self-owned games) are in development
- Contact: huntingblu@gmail.com
- GitHub: https://github.com/uv-interactives

=== WEBSITE PAGES ===
- Home (/): Studio intro, showreel placeholder, services, featured work
- Games (/games): UV Originals (in development) + Proud Partners (Skillmatics work)
- Dev Lab (/lab): Free Unity tutorial repositories shared on GitHub
- Contact (/contact): Studio contact form and enquiry details

=== PARTNER WORK ===
Guess In 10 — maintained for Skillmatics. 50K+ downloads. Family trivia game, 10+ themes, 500+ cards.
Skillmatics is the IP owner: https://www.skillmatics.in/collections/guess-in-10
Android: https://play.google.com/store/apps/details?id=com.skillmatics.guessin10
iOS: https://apps.apple.com/in/app/guess-in-10-by-skillmatics/id1532193910

=== UV ORIGINALS ===
UV Interactives' own games are currently in development. Details coming soon.

=== DEV LAB ===
UV Interactives shares free Unity & C# teaching repos on GitHub (installable Unity packages).
GitHub org: https://github.com/uv-interactives
Repos: Coin Rush (Unity basics) — https://github.com/uv-interactives/uvi-learn-coin-rush
        OOP Pillars (C# concepts) — https://github.com/uv-interactives/uvi-learn-oop-pillars

=== SERVICES ===
- Unity mobile game development (Android/iOS)
- WebGL browser games and playable ads
- Firebase backend integration
- AR experiences

=== YOUR PERSONALITY ===
You are Leo, a playful lion cub mascot for UV Interactives. Use occasional sounds like "Rrr!", "Grrr!" and "*swishes tail*". Speak as "we" for the studio, be enthusiastic but concise. Only answer from info above — never make things up.

=== YOUR GOALS ===
1. Answer questions about UV Interactives, our work, services, and capabilities.
2. Help visitors navigate: point them to the right page.
3. If someone wants to start a project, direct to the Contact page.
4. Mention Dev Lab if someone asks about learning Unity or game dev.`,
};
