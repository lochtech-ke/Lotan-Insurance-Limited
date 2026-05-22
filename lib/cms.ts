import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

export type InsightPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  gradient: string;
  href?: string;
  bodyHtml?: string;
};

const CONTENT_DIR = path.join(process.cwd(), "content", "insights");

/** Sanity CMS — enable with NEXT_PUBLIC_SANITY_PROJECT_ID + SANITY_API_TOKEN */
async function fetchSanityInsights(): Promise<InsightPost[] | null> {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
  const token = process.env.SANITY_API_TOKEN;

  if (!projectId) return null;

  try {
    const { createClient } = await import("@sanity/client");
    const client = createClient({
      projectId,
      dataset,
      apiVersion: "2024-01-01",
      useCdn: true,
      token,
    });

    const query = `*[_type == "insight"] | order(publishedAt desc) {
      "slug": slug.current,
      title,
      excerpt,
      category,
      readTime,
      "date": publishedAt,
      gradient
    }`;

    const posts = await client.fetch<InsightPost[]>(query);
    return posts.map((p) => ({ ...p, href: `/insights/${p.slug}` }));
  } catch {
    return null;
  }
}

function readFileInsights(): InsightPost[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];

  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".md"));

  return files
    .map((filename) => {
      const slug = filename.replace(/\.md$/, "");
      const raw = fs.readFileSync(path.join(CONTENT_DIR, filename), "utf8");
      const { data, content } = matter(raw);
      return {
        slug,
        title: data.title as string,
        excerpt: data.excerpt as string,
        category: data.category as string,
        readTime: (data.readTime as string) || "5 min read",
        date: (data.date as string) || new Date().toISOString(),
        gradient: (data.gradient as string) || "from-forest to-emerald/80",
        href: `/insights/${slug}`,
        bodyHtml: undefined,
        _content: content,
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) as (InsightPost & {
      _content?: string;
    })[];
}

export async function getAllInsights(): Promise<InsightPost[]> {
  const sanity = await fetchSanityInsights();
  if (sanity?.length) return sanity;

  return readFileInsights().map(({ _content, ...post }) => post);
}

export async function getInsightBySlug(slug: string): Promise<InsightPost | null> {
  const sanityPosts = await fetchSanityInsights();
  if (sanityPosts?.length) {
    const post = sanityPosts.find((p) => p.slug === slug);
    if (!post) return null;
    return post;
  }

  const filePath = path.join(CONTENT_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const processed = await remark().use(html).process(content);

  return {
    slug,
    title: data.title as string,
    excerpt: data.excerpt as string,
    category: data.category as string,
    readTime: (data.readTime as string) || "5 min read",
    date: (data.date as string) || new Date().toISOString(),
    gradient: (data.gradient as string) || "from-forest to-emerald/80",
    bodyHtml: processed.toString(),
  };
}
