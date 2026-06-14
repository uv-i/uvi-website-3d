// ── Sanity Studio Configuration ───────────────────────────────────────────────
// After running `npm install` in this folder:
//   1. Go to https://sanity.io/manage and find your project ID
//   2. Replace YOUR_PROJECT_ID below with it (looks like: abc12def)
//   3. Run `npm run dev` to open Studio locally at http://localhost:3333

import { defineConfig }   from 'sanity';
import { structureTool }  from 'sanity/structure';
import { visionTool }     from '@sanity/vision';
import { schemaTypes }    from './schemas/index';

export default defineConfig({
  name:  'uvi-studio',
  title: 'UV Interactives CMS',

  // ── FILL THIS IN ────────────────────────────────────────────────────────────
  projectId: 'kgcdsokn',  // e.g. 'abc12def'
  dataset:   'production',
  // ────────────────────────────────────────────────────────────────────────────

  plugins: [
    structureTool(), // Main content editing UI
    visionTool(),    // GROQ query explorer (useful for debugging)
  ],

  schema: {
    types: schemaTypes,
  },
});
