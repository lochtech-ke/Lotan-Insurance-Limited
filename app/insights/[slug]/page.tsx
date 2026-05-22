import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getInsightBySlug, getAllInsights } from "@/lib/cms";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const posts = await getAllInsights();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getInsightBySlug(slug);
  if (!post) return { title: "Insight Not Found" };
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function InsightArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = await getInsightBySlug(slug);
  if (!post) notFound();

  return (
    <main id="main-content">
      <section className={`pt-36 pb-12 bg-gradient-to-br ${post.gradient} text-white`}>
        <div className="container-wide max-w-3xl">
          <Link href="/insights" className="text-white/70 text-sm hover:text-white mb-6 inline-block">
            ← All Insights
          </Link>
          <div className="pill pill-dark mb-4">{post.category}</div>
          <h1 className="text-3xl md:text-5xl font-heading font-extrabold mb-4">{post.title}</h1>
          <p className="text-white/80 text-lg">{post.excerpt}</p>
          <p className="text-white/50 text-sm mt-4">{post.readTime}</p>
        </div>
      </section>

      {post.bodyHtml && (
        <section className="section-padding section-light">
          <article
            className="container-wide max-w-3xl prose prose-forest prose-headings:font-heading prose-a:text-accent"
            dangerouslySetInnerHTML={{ __html: post.bodyHtml }}
          />
        </section>
      )}

      <section className="section-padding section-sage text-center">
        <Link href="/contact#quote" className="btn-primary inline-flex">
          Discuss Capital Optimization
        </Link>
      </section>
    </main>
  );
}
