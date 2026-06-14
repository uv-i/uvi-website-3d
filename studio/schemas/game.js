// ── Game Schema ───────────────────────────────────────────────────────────────
// Covers both UV Originals (self-owned IP) and Partner Games (client work).
// The "gameType" field controls which tab a game appears on in the Games page.

export default {
  name: 'game',
  title: 'Game',
  type: 'document',

  fields: [
    // ── Classification ───────────────────────────────────────────────────────
    {
      name: 'gameType',
      title: 'Game Type',
      type: 'string',
      description: 'UV Original = a game UV Interactives owns. Partner Game = client work we maintain.',
      options: {
        list: [
          { title: 'UV Original (self-owned IP)', value: 'original' },
          { title: 'Partner Game (client work)',  value: 'partner'  },
        ],
        layout: 'radio',
      },
      validation: Rule => Rule.required(),
    },

    // ── Core fields ──────────────────────────────────────────────────────────
    {
      name: 'title',
      title: 'Game Title',
      type: 'string',
      description: 'Leave empty for teaser-mode projects whose title is not yet revealed.',
    },
    {
      name: 'teaser',
      title: 'Hide Title (Teaser Mode)',
      type: 'boolean',
      description: 'Check this to show ████████ instead of the real title on the website.',
      initialValue: false,
    },
    {
      name: 'genre',
      title: 'Genre / Platform',
      type: 'string',
      description: 'e.g. "Mobile · Casual" or "Mobile · Educational Trivia"',
    },
    {
      name: 'status',
      title: 'Status Text',
      type: 'string',
      description: 'Shown as a badge. e.g. "In Development", "50K+ Downloads", "Live"',
    },
    {
      name: 'year',
      title: 'Year / Timeline',
      type: 'string',
      description: 'e.g. "2025 →" for in-progress or "2023 → Now" for ongoing work',
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
    },
    {
      name: 'tags',
      title: 'Technology Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
      description: 'e.g. Unity, C#, Firebase, iOS, Android',
    },

    // ── Partner-only fields (leave blank for UV Originals) ───────────────────
    {
      name: 'partnerName',
      title: 'Partner / IP Owner Name',
      type: 'string',
      description: 'PARTNER GAMES ONLY. e.g. "Skillmatics". Leave blank for UV Originals.',
    },
    {
      name: 'partnerUrl',
      title: 'Partner Website URL',
      type: 'url',
      description: 'PARTNER GAMES ONLY. Link to the partner brand\'s website.',
    },
    {
      name: 'role',
      title: "UV Interactives' Role",
      type: 'string',
      description: 'PARTNER GAMES ONLY. e.g. "Store Maintenance & Updates"',
    },
    {
      name: 'highlights',
      title: 'Bullet-point Highlights',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Short achievement bullets shown on the game card. e.g. "50K+ downloads across Android & iOS"',
    },
    {
      name: 'androidLink',
      title: 'Google Play Store URL',
      type: 'url',
    },
    {
      name: 'iosLink',
      title: 'Apple App Store URL',
      type: 'url',
    },
    {
      name: 'trailerYoutubeId',
      title: 'Trailer YouTube Video ID',
      type: 'string',
      description: 'Just the ID part of the URL (e.g. "dQw4w9WgXcQ"), not the full link. Leave empty if no trailer yet.',
    },
    {
      name: 'screenshots',
      title: 'Screenshots',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      description: 'Upload game screenshots. These appear in the detail panel.',
    },
    {
      name: 'playableUrl',
      title: 'Playable Game URL',
      type: 'url',
      description: 'For future WebGL embeds. Leave empty for now.',
    },
  ],

  // Controls how this document looks in the Sanity Studio list view
  preview: {
    select: {
      title:    'title',
      subtitle: 'gameType',
      media:    'screenshots.0',
    },
    prepare({ title, subtitle, media }) {
      return {
        title:    title || '████████ (Teaser)',
        subtitle: subtitle === 'original' ? '🎮 UV Original' : '🤝 Partner Game',
        media,
      };
    },
  },
};
