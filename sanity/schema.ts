/**
 * Sanity Studio schema — import into your Sanity project.
 * Set NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_TOKEN in Vercel env.
 */
export const insightSchema = {
  name: "insight",
  title: "Insight",
  type: "document",
  fields: [
    { name: "title", title: "Title", type: "string" },
    { name: "slug", title: "Slug", type: "slug", options: { source: "title" } },
    { name: "excerpt", title: "Excerpt", type: "text" },
    { name: "category", title: "Category", type: "string" },
    { name: "readTime", title: "Read Time", type: "string" },
    { name: "publishedAt", title: "Published At", type: "datetime" },
    { name: "gradient", title: "Gradient Class", type: "string" },
    { name: "body", title: "Body", type: "array", of: [{ type: "block" }] },
  ],
};
