// ── APP CONFIG ────────────────────────────────────────────────────────────────
export const APP_CONFIG = {
  studio: 'UV Interactives',
  contactEmail: 'huntingblu@gmail.com',
  contactLocation: 'Chennai, India',
  socials: {
    github: 'https://github.com/uv-i',
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
      '10 themes. 500+ question cards. Countless family game nights. Guess In 10 is Skillmatics\' flagship trivia experience — and UV Interactives keeps it live and loved, quietly handling everything behind the scenes so players always get the best version of the game.',
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
export const TEACHING_DATA = [
  {
    id: 'teach-1',
    title: 'Infibee Unity Basics — Module 01',
    description:
      'Introductory Unity course materials for students learning game development from scratch. Covers scene setup, GameObjects, physics, and basic C# scripting.',
    tags: ['Unity', 'C#', 'Beginner', 'Game Dev Fundamentals'],
    githubUrl: 'https://github.com/uv-i/infibee_unity_01',
    status: 'Active',
    category: 'Unity Fundamentals',
  },
];

// ── CHATBOT PERSONA ───────────────────────────────────────────────────────────
export const CHATBOT_PERSONA = {
  facts: [
    { text: 'UV Interactives maintains Skillmatics\' Guess In 10 — 50K+ downloads on Android & iOS! 🦁', route: '/games', routeLabel: 'See our work' },
    { text: 'We teach game dev too! Check out the Dev Lab for free Unity tutorials on GitHub. 📚', route: '/lab', routeLabel: 'Open Dev Lab' },
  ],
  intros: [
    'Rrr-oar! I\'m Leo, UV Interactives\' mascot! Ask me about our work, services, or how to start a project! 🦁',
    'Hey! I\'m Leo! The team is busy building games — but I know everything about UV Interactives. What do you want to know? ⚔️',
  ],
  systemPrompt: `You are Leo, the lion cub mascot and AI assistant for UV Interactives — a game development studio based in Chennai, India.

=== ABOUT UV INTERACTIVES ===
UV Interactives is a game development studio specialising in Unity mobile games.
- We maintain Skillmatics' Guess In 10 (50K+ downloads) as a store partner
- UV Originals (self-owned games) are in development
- Contact: huntingblu@gmail.com
- GitHub: https://github.com/uv-i

=== WEBSITE PAGES ===
- Home (/): Studio intro, showreel placeholder, services, featured work
- Games (/games): UV Originals (in development) + Proud Partners (Skillmatics work)
- Dev Lab (/lab): Free Unity tutorial repositories shared on GitHub
- Contact (/contact): Studio contact form and enquiry details

=== PARTNER WORK ===
Guess In 10 — maintained for Skillmatics. 50K+ downloads. Family trivia game, 10 themes, 500+ cards.
Skillmatics is the IP owner: https://www.skillmatics.in/collections/guess-in-10
Android: https://play.google.com/store/apps/details?id=com.skillmatics.guessin10
iOS: https://apps.apple.com/in/app/guess-in-10-by-skillmatics/id1532193910

=== UV ORIGINALS ===
UV Interactives' own games are currently in development. Details coming soon.

=== DEV LAB ===
UV Interactives shares free Unity tutorial repos on GitHub.
GitHub: https://github.com/uv-i
Current repo: Infibee Unity Basics Module 01 — https://github.com/uv-i/infibee_unity_01

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
