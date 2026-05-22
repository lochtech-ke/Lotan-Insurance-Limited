import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { InsightCard } from "@/components/InsightCard";
import { getAllInsights } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Insights & Thought Leadership",
  description: "Financial architecture insights — capital optimization, risk engineering, and institutional market intelligence.",
};

export default async function InsightsPage() {
  const posts = await getAllInsights();

  return (
    <main id="main-content">
      <PageHero
        pill="Thought Leadership"
        title="Financial Architecture Insights"
        description="Strategic intelligence on risk engineering, capital optimization, and institutional market trends."
      />

      <section className="section-padding section-light">
        <div className="container-wide">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <InsightCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding section-sage text-center">
        <div className="container-wide max-w-2xl">
          <h2 className="section-title mb-4">Receive Institutional Intelligence</h2>
          <p className="section-desc mb-8">Schedule a strategic consultation for tailored capital architecture advisory.</p>
          <Link href="/contact#quote" className="btn-primary inline-flex">
            Schedule Strategic Consultation
          </Link>
        </div>
      </section>
    </main>
  );
}
