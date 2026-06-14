/**
 * Keyword → route mappings for Leo's in-chat navigation chips.
 * Keeps routing concerns out of the ChatBot component.
 */
export const PAGE_LINKS = [
  { keywords: ['dev lab', '/lab', 'teaching repo', 'unity tutorial', 'unity repo', 'tutorial repo'], route: '/lab',     label: 'Dev Lab'   },
  { keywords: ['guess in 10', 'guessin10', 'guess in10'],                                           route: '/games',   label: 'Guess In 10', state: { tab: 'partners', gameIndex: 0 } },
  { keywords: ['uv originals', 'uv original', 'originals tab', 'our games', 'game library'],        route: '/games',   label: 'Our Games' },
  { keywords: ['games page', 'games tab', 'client work', 'client tab', 'see all games', 'fortnite project', 'projects page'], route: '/games', label: 'Games' },
  { keywords: ['contact page', 'contact form', 'start a project', 'work with us', 'get in touch', 'reach out', 'send a message'], route: '/contact', label: 'Contact Us' },
];

/**
 * Scans an AI reply for keyword matches and returns unique page links to surface as chips.
 * @param {string} text
 * @returns {{ route: string, label: string, state?: object }[]}
 */
export const extractPageLinks = (text) => {
  const lower = text.toLowerCase();
  const found = [];
  for (const page of PAGE_LINKS) {
    if (page.keywords.some(kw => lower.includes(kw))) {
      if (!found.find(f => f.route === page.route)) found.push(page);
    }
  }
  return found;
};
