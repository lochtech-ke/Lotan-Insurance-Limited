import Link from "next/link";
import type { InsightPost } from "@/lib/cms";

export function InsightCard({ post }: { post: InsightPost }) {
  const href = post.href || `/insights/${post.slug}`;
  return (
    <Link href={href} className="insight-card block no-underline text-inherit">
      <div className={`h-44 bg-gradient-to-br ${post.gradient}`} aria-hidden />
      <div className="insight-card-body">
        <div className="insight-meta mb-2">
          {post.category} · {post.readTime}
        </div>
        <h2 className="font-heading font-bold text-forest text-lg mb-2">{post.title}</h2>
        <p className="text-charcoal/55 text-sm leading-relaxed">{post.excerpt}</p>
      </div>
    </Link>
  );
}
