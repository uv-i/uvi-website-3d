// ── GROQ Queries ──────────────────────────────────────────────────────────────
// GROQ is Sanity's query language — think SQL but for JSON documents.
// These queries are used in src/hooks/useSanityData.js.

// Fetches all games, ordered: UV Originals first, then Partners, oldest first.
export const GAMES_QUERY = `
  *[_type == "game"] | order(gameType asc, _createdAt asc) {
    "id": _id,
    gameType,
    title,
    teaser,
    genre,
    status,
    year,
    tags,
    description,
    partnerName,
    partnerUrl,
    role,
    highlights,
    androidLink,
    iosLink,
    trailerYoutubeId,
    playableUrl,
    "screenshots": screenshots[].asset->url
  }
`;

// Fetches all Dev Lab packages, grouped by category for the tab UI.
export const DEVLAB_QUERY = `
  *[_type == "devLabPackage"] | order(category asc, _createdAt asc) {
    "id": _id,
    title,
    description,
    tags,
    githubUrl,
    status,
    category
  }
`;
