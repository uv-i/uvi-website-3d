// ── Dev Lab Package Schema ────────────────────────────────────────────────────
// Represents a teaching repo / Unity package shown on the Dev Lab page.
// The "category" field becomes the tab label — add a new tab by using a new category name.

export default {
  name: 'devLabPackage',
  title: 'Dev Lab Package',
  type: 'document',

  fields: [
    {
      name: 'title',
      title: 'Package Name',
      type: 'string',
      description: 'e.g. "Coin Rush" or "OOP Pillars"',
      validation: Rule => Rule.required(),
    },
    {
      name: 'category',
      title: 'Category / Tab Label',
      type: 'string',
      description: 'This exact text becomes a tab on the Dev Lab page. Use the same string for multiple packages in the same tab. e.g. "Unity & C#"',
      validation: Rule => Rule.required(),
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'What students will learn from this package. Shown on the card.',
    },
    {
      name: 'tags',
      title: 'Technology Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
      description: 'e.g. Unity, C#, URP, Physics, Beginner',
    },
    {
      name: 'githubUrl',
      title: 'GitHub Repository URL',
      type: 'url',
      description: 'Full URL to the repo, e.g. https://github.com/uv-interactives/uvi-learn-coin-rush',
      validation: Rule => Rule.required(),
    },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Active',       value: 'Active'       },
          { title: 'Archived',     value: 'Archived'     },
          { title: 'Coming Soon',  value: 'Coming Soon'  },
        ],
        layout: 'radio',
      },
      initialValue: 'Active',
      validation: Rule => Rule.required(),
    },
  ],

  // Controls how this document looks in the Sanity Studio list view
  preview: {
    select: {
      title:    'title',
      subtitle: 'category',
    },
    prepare({ title, subtitle }) {
      return {
        title:    title,
        subtitle: `📦 ${subtitle}`,
      };
    },
  },
};
