import { Briefcase, Zap, Globe, Star, Code2 } from 'lucide-react';

// ── APP CONFIG ────────────────────────────────────────────────────────────────
export const APP_CONFIG = {
  studio: 'UV Interactives',
  founderName: 'Bhuvaneshwaran M',
  founderShort: 'Bhuvanesh',
  tagline: 'Senior Game Developer',
  contactEmail: 'huntingblu@gmail.com',
  contactPhone: '+91 7904054483',
  contactLocation: 'Chennai, India',
  socials: {
    linkedin: 'https://www.linkedin.com/in/bhuvaneshwaran-m-765885b3/',
    portfolio: 'https://1022bhuvanesh.wixsite.com/portfolio',
    github: 'https://github.com/uv-i',
  },
};

// ── UV ORIGINALS ──────────────────────────────────────────────────────────────
// Projects owned / maintained under the UV Interactives brand
export const UV_PROJECTS = [
  {
    id: 'uv-1',
    title: 'Guess In 10',
    genre: 'Mobile · Educational Trivia',
    status: '50K+ Downloads',
    year: '2023 → Now',
    image: null,
    tags: ['Unity', 'C#', 'Firebase', 'In-App Purchases', 'Android', 'iOS'],
    description:
      'Family trivia game with 10 unique themes and 500+ cards. Originally built for Skillmatics at HornbillFX — now actively maintained and updated by UV Interactives since HornbillFX\'s closure in 2025.',
    highlights: [
      '50K+ downloads across Android & iOS',
      'On-demand Firebase content delivery — smaller APK (~94 MB)',
      'Google Play Billing for premium theme unlocks',
    ],
    attribution: 'Originally developed at HornbillFX for Skillmatics. Maintained by UV Interactives since 2025.',
    androidLink: 'https://play.google.com/store/apps/details?id=com.skillmatics.guessin10&hl=en',
    iosLink: 'https://apps.apple.com/in/app/guess-in-10-by-skillmatics/id1532193910',
    isUVBadge: true,
  },
];

// ── CLIENT WORK — grouped by company ─────────────────────────────────────────
// Ordered present → past (timeline scrolls top to bottom = now to then)
export const CLIENT_COMPANIES = [
  {
    id: 'visceral',
    company: 'Visceral Technology Pvt. Ltd.',
    shortName: 'Visceral Technology',
    role: 'Unreal Developer',
    period: 'April 2025 – Present',
    logoPath: '/logos/visceral-logo.png', // drop file here to activate
    accentColor: '#FF8C00',
    projects: [
      {
        id: 'v-1',
        title: 'YouTube Tycoon: Gamer Edition',
        genre: 'UEFN · Fortnite Tycoon',
        status: 'Live',
        year: '2025',
        image: null,
        mapCode: '5872-1683-6309',
        link: 'https://www.fortnite.com/@playpalrealms/5872-1683-6309',
        tags: ['UEFN', 'Verse', 'Fortnite', 'Economy', 'Multiplayer'],
        description:
          'Real-time leaderboard, ATM mechanics, in-island economy, Battle Pass + VIP redemption, and sponsorship buff systems.',
        highlights: [
          '~25% higher session return via real-time leaderboard',
          '~40% more monetization touchpoints per session',
          '~35% player retention lift from Battle Pass integration',
        ],
      },
      {
        id: 'v-2',
        title: 'Guess Who? Board Game',
        genre: 'UEFN · Party Game',
        status: 'Live',
        year: '2025',
        image: null,
        mapCode: '7387-6907-3174',
        link: 'https://www.fortnite.com/@looknorthworld/7387-6907-3174',
        tags: ['UEFN', 'Verse', 'Fortnite'],
        description:
          'Random character selection system and Best-of-5 mode built with Verse. Boosts engagement with each mechanic independently measurable.',
        highlights: [
          '+1 min avg session from random char selection',
          '+5 min avg session from Best-of-5 mode',
        ],
      },
      {
        id: 'v-3',
        title: "Hunter's Haul",
        genre: 'WebGL · Browser Game',
        status: 'Live',
        year: '2025',
        image: null,
        link: 'https://huntershaul.netlify.app/',
        tags: ['WebGL', 'TypeScript', 'Cocos Creator'],
        description: 'Fast-loading WebGL browser game with a tight gameplay loop. Built with TypeScript in Cocos Creator, deployed on Netlify.',
        highlights: ['Instant-play — no install required', 'Optimised WebGL build'],
      },
      {
        id: 'v-4',
        title: 'Liv Loot Launch',
        genre: 'WebGL · Playable Ad',
        status: 'Live',
        year: '2025',
        image: null,
        link: 'https://liv-loot-launch.netlify.app/',
        tags: ['WebGL', 'TypeScript', 'Cocos Creator'],
        description: 'Engagement-optimised playable ad format. TypeScript + Cocos Creator — lightweight, shareable, no app download.',
        highlights: ['Playable ad format for user acquisition', 'TypeScript + Cocos Creator'],
      },
    ],
  },
  {
    id: 'hornbillfx',
    company: 'HornbillFX Pvt. Ltd.',
    shortName: 'HornbillFX',
    role: 'Unity Developer → Lead Game Developer',
    period: 'February 2018 – April 2025',
    logoPath: '/logos/hornbillfx-logo.png', // drop file here to activate
    accentColor: '#5500EE',
    projects: [
      {
        id: 'h-1',
        title: 'Makkalin Mudhalvar',
        genre: 'Mobile · Turn-Based Strategy',
        status: '100K+ Downloads',
        year: '2024',
        image: null,
        androidLink: 'https://play.google.com/store/apps/details?id=com.thepenindia.namadhu_dravidam&hl=en_IN',
        iosLink: 'https://apps.apple.com/in/app/makkalin-mudhalvar/id6504998018',
        tags: ['Unity', 'C#', 'Firebase', 'Android', 'iOS'],
        description:
          'Governance strategy game where players act as Chief Minister. Designed real-time decision feedback UI, event-driven narrative, and optimised both Android (~150 MB) and iOS builds.',
        highlights: ['100K+ downloads', 'Real-time decision-impact feedback UI', 'Optimised ~150 MB Android build'],
        client: 'The Penindia',
      },
      {
        id: 'h-2',
        title: 'Fairside Stories',
        genre: 'Mobile · Educational RPG',
        status: '100K+ Downloads',
        year: '2022',
        image: null,
        androidLink: 'https://fairside-stories.en.softonic.com/android',
        tags: ['Unity', 'C#', 'Firebase', 'kidSAFE Certified'],
        description:
          'Story-based RPG for children 9–12 focused on social-emotional development. Tweening animation system, Firebase backend, optimised ~118 MB build. kidSAFE certified.',
        highlights: ['100K+ downloads', 'kidSAFE Seal Program certified', '~118 MB optimised build'],
        client: 'Skillmatics',
      },
      {
        id: 'h-3',
        title: 'Harmony: Heroes of Elephantia',
        genre: 'Mobile · Dungeon Crawler',
        status: 'Shipped',
        year: '2022',
        image: null,
        androidLink: 'https://play.google.com/store/apps/details?id=com.CincinnatiZoo.Harmony&hl=en_IN',
        tags: ['Unity', 'C#', 'Procedural Generation', 'Leaderboard'],
        description:
          'Conservation-themed dungeon crawler with procedurally generated levels, real-time combat, and narrative storytelling. Tweening-driven animations, modular event-driven combat.',
        highlights: ['Procedurally generated levels', 'Modular event-driven combat system', 'Real-time competitive leaderboard'],
        client: 'Cincinnati Zoo',
      },
      {
        id: 'h-4',
        title: 'Grameen Guru',
        genre: 'Mobile · AR Education',
        status: 'Shipped',
        year: '2021',
        image: null,
        androidLink: 'https://play.google.com/store/apps/details?id=com.GrameenFoundation.GrameenGuru&hl=en_IN',
        tags: ['Unity', 'AR Foundation', 'Firebase', 'Multilingual'],
        description:
          'AR financial literacy app for low-income users. Scan markers to unlock avatar-guided lessons in local dialects. Full AR + 3D offline fallback with dynamic Firebase content.',
        highlights: ['AR + 3D offline fallback modes', 'Multilingual avatar guidance system', 'Dynamic backend content delivery'],
        client: 'Grameen Foundation',
      },
      {
        id: 'h-5',
        title: 'Multiplayer Trivia Boxing',
        genre: 'Mobile · PvP Trivia',
        status: 'Unreleased',
        year: '2023',
        image: null,
        tags: ['Unity', 'C#', 'Firebase', 'PvP', 'OTP Auth'],
        description:
          'Real-time PvP trivia game blending CBSE curriculum (Grades 6–12) with boxing combat visuals. Damage scales with answer correctness and speed.',
        highlights: ['Real-time PvP via Firebase backend', 'OTP phone-auth matchmaking', 'Damage mechanics tied to answer speed'],
      },
    ],
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
  // Add more teaching repos here — they'll render as cards automatically
];

// ── CAREER TIMELINE (About page) ──────────────────────────────────────────────
export const TIMELINE_DATA = [
  {
    year: '2025 – Now',
    title: 'Unreal Developer @ Visceral Technology',
    description:
      'Developing Fortnite UEFN experiences and WebGL browser games with Verse, TypeScript, and Cocos Creator. Shipped YouTube Tycoon, Guess Who, Hunter\'s Haul, and Liv Loot Launch.',
    icon: Star,
  },
  {
    year: 'Sept 2023',
    title: 'Promoted — Lead Game Developer',
    description:
      'Took on cross-functional leadership at HornbillFX, overseeing game production, sprint management, task scheduling, and a team of developers across multiple live titles.',
    icon: Zap,
  },
  {
    year: '2021 – 2023',
    title: 'Senior Unity Developer',
    description:
      'Led development of Fairside Stories, Harmony: Heroes of Elephantia, Grameen Guru (AR), and the unreleased Multiplayer Trivia Boxing Game.',
    icon: Code2,
  },
  {
    year: 'Feb 2018',
    title: 'Unity Developer @ HornbillFX',
    description:
      'Joined as Unity Developer. Built core game logic, animations, VFX, and backend systems across 2D, 3D, WebGL, card games, and visual novel genres.',
    icon: Briefcase,
  },
  {
    year: '2006 – 2009',
    title: 'B.Sc Mathematics — T.B.M.L. College, Porayar',
    description:
      'Foundation in analytical thinking and problem-solving that underpins every system I design and every algorithm I ship.',
    icon: Globe,
  },
];

// ── SKILLS ────────────────────────────────────────────────────────────────────
export const SKILLS_DATA = {
  engines: ['Unity', 'UEFN (Unreal Editor for Fortnite)', 'Cocos Creator'],
  languages: ['C#', 'Verse', 'TypeScript', 'JavaScript'],
  backend: ['Firebase (Auth, Realtime DB, Cloud Storage, Remote Config, Analytics)', 'REST API', 'Google Play Billing'],
  tools: ['Git', 'Perforce', 'Photon (Multiplayer)', 'AR Foundation', 'URP'],
  soft: ['Game Logic Design', 'Backend Systems', 'API Integration', 'Game Publishing', 'Team Coordination', 'Sprint Management', 'Vendor Relations'],
};

// ── CHATBOT PERSONA ───────────────────────────────────────────────────────────
export const CHATBOT_PERSONA = {
  facts: [
    { text: 'UV Interactives has shipped 250K+ downloads across Android, iOS, and Fortnite! 🎮', route: '/games', routeLabel: 'See our games' },
    { text: 'We built Grameen Guru — an AR app teaching financial literacy in local Indian languages! 🌍', route: '/games', routeLabel: 'View client work' },
    { text: 'Play our Fortnite islands! YouTube Tycoon (code: 5872-1683-6309) or Guess Who (code: 7387-6907-3174) 🕹️', route: '/games', routeLabel: 'View Fortnite games' },
    { text: 'UV Interactives maintains Guess In 10 — 50K+ downloads on Android & iOS! 🦁', route: '/games', routeLabel: 'See UV Originals' },
    { text: 'We also teach game dev! Check out the Dev Lab for Unity tutorial repos on GitHub. 📚', route: '/lab', routeLabel: 'Open Dev Lab' },
  ],
  intros: [
    'Rrr-oar! I\'m Leo, UV Interactives\' mascot! Ask me about our games, services, or how to start a project! 🦁',
    'Hey! I\'m Leo! The team is busy building games — but I know everything about UV Interactives. What do you want to know? ⚔️',
  ],
  systemPrompt: `You are Leo, the lion cub mascot and AI assistant for UV Interactives — a game development studio based in Chennai, India, founded by Bhuvaneshwaran M (Bhuvanesh).

=== ABOUT UV INTERACTIVES ===
UV Interactives is a game development studio specialising in Unity, UEFN (Fortnite), and WebGL games.
- Founded and led by Bhuvanesh, a Senior Game Developer with 7+ years of experience
- 250K+ combined downloads across Android, iOS, and Fortnite
- Contact: huntingblu@gmail.com | +91 7904054483
- GitHub: https://github.com/uv-i

=== WEBSITE PAGES ===
- Home (/): Studio intro, stats, showreel placeholder, services, featured games
- Games (/games): Two tabs:
    • "UV Originals" — games owned/maintained under the UV Interactives brand
    • "Client Work" — visual timeline of work at Visceral Technology and HornbillFX
- Dev Lab (/lab): Teaching repositories and Unity tutorials shared on GitHub
- Contact (/contact): Studio contact form and enquiry details

=== UV ORIGINALS ===
1. Guess In 10 — 50K+ downloads. Family trivia game, 10 themes, 500+ cards.
   Originally built for Skillmatics at HornbillFX — now maintained by UV Interactives.
   Android: https://play.google.com/store/apps/details?id=com.skillmatics.guessin10
   iOS: https://apps.apple.com/in/app/guess-in-10-by-skillmatics/id1532193910

=== CLIENT WORK — VISCERAL TECHNOLOGY (2025–Now) ===
1. YouTube Tycoon: Gamer Edition — UEFN Fortnite, map code: 5872-1683-6309
   Link: https://www.fortnite.com/@playpalrealms/5872-1683-6309
2. Guess Who? Board Game — UEFN Fortnite, map code: 7387-6907-3174
   Link: https://www.fortnite.com/@looknorthworld/7387-6907-3174
3. Hunter's Haul — WebGL browser game — https://huntershaul.netlify.app/
4. Liv Loot Launch — WebGL playable ad — https://liv-loot-launch.netlify.app/

=== CLIENT WORK — HORNBILLFX (2018–2025) ===
1. Makkalin Mudhalvar — 100K+ downloads. Turn-based governance strategy. Client: The Penindia.
2. Fairside Stories — 100K+ downloads. Educational RPG for kids 9-12. kidSAFE certified. Client: Skillmatics.
3. Harmony: Heroes of Elephantia — Dungeon crawler, procedural levels. Client: Cincinnati Zoo.
4. Grameen Guru — AR financial literacy tool, multilingual. Client: Grameen Foundation.
5. Multiplayer Trivia Boxing — Real-time PvP, CBSE trivia + boxing combat.

=== DEV LAB / TEACHING ===
UV Interactives shares Unity tutorial repos on GitHub for aspiring game developers.
GitHub: https://github.com/uv-i
Current repo: Infibee Unity Basics Module 01 — https://github.com/uv-i/infibee_unity_01

=== SERVICES ===
- Unity mobile game development (Android/iOS)
- UEFN / Fortnite experience design (Verse scripting, economy systems, live events)
- WebGL browser games and playable ads (Cocos Creator + TypeScript)
- AR experiences and Firebase backend integration

=== YOUR PERSONALITY ===
You are Leo, a playful lion cub mascot for UV Interactives. Use occasional sounds like "Rrr!", "Grrr!" and "*swishes tail*". Speak as "we" for the studio, be enthusiastic but concise. Only answer from info above — never make things up.

=== YOUR GOALS ===
1. Answer questions about UV Interactives, our games, services, and capabilities.
2. Help visitors navigate: point them to the right page.
3. If someone wants to start a project, direct to the Contact page.
4. Mention Dev Lab if someone asks about learning Unity or game dev.`,
};
