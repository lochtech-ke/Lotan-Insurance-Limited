import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = { title: "Institutional Partnerships" };

export default function PartnershipsPage() {
  return (
    <main id="main-content">
      <PageHero pill="Global Network" title="Institutional Partnerships" description="Collaborative underwriting alliances extending balance sheet scale and geographic reach." />
      <section className="section-padding section-light">
        <div className="container-wide grid md:grid-cols-3 gap-8">
          {["International Underwriters", "Development Finance Institutions", "Commercial & Investment Banks"].map((t) => (
            <article key={t} className="bento-card text-center">
              <h3 className="font-heading font-bold text-forest mb-2">{t}</h3>
              <p className="text-sm text-charcoal/60">Strategic co-structuring and regional guarantee capacity.</p>
            </article>
          ))}
        </div>
        <p className="text-center mt-12">
          <a href={`mailto:${SITE.email}`} className="btn-primary inline-flex">{SITE.email}</a>
        </p>
      </section>
    </main>
  );
}
