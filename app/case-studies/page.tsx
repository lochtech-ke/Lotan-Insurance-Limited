import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = { title: "Case Studies" };

export default function CaseStudiesPage() {
  const cases = [
    { stat: "$42M", label: "Performance security mobilized", title: "Regional Highway Programme", desc: "EPC performance bond enabling financial close without immobilizing cash reserves." },
    { stat: "RWA", label: "Risk-weight optimization", title: "Commercial Lender Portfolio", desc: "Credit protection framework supporting expanded corporate lending facilities." },
    { stat: "14", label: "Concurrent bid instruments", title: "Pan-African Logistics Group", desc: "Master guarantee programme across multiple procurement jurisdictions." },
  ];

  return (
    <main id="main-content">
      <PageHero pill="Proven Outcomes" title="Institutional Case Studies" description="Representative engagements demonstrating capital unlocking across sectors." />
      <section className="section-padding section-light">
        <div className="container-wide space-y-8">
          {cases.map((c) => (
            <article key={c.title} className="bento-card grid lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-3">
                <div className="stat-number text-accent text-3xl">{c.stat}</div>
                <p className="text-xs text-charcoal/50 uppercase tracking-wider">{c.label}</p>
              </div>
              <div className="lg:col-span-9">
                <h2 className="font-heading font-bold text-xl text-forest mb-2">{c.title}</h2>
                <p className="text-charcoal/65 text-sm">{c.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="section-padding section-sage text-center">
        <Link href="/contact#quote" className="btn-primary inline-flex">Get a Quote</Link>
      </section>
    </main>
  );
}
