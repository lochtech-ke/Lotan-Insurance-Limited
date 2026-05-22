import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = { title: "Executive Advisory" };

export default function ExecutiveAdvisoryPage() {
  return (
    <main id="main-content">
      <PageHero pill="Executive Advisory" title="C-Suite Capital Architecture Advisory" description="Confidential structured risk advisory for CFOs, treasurers, and board risk committees.">
        <Link href="/contact#quote" className="btn-white inline-flex mt-4">Schedule Executive Consultation</Link>
      </PageHero>
      <section className="section-padding section-light">
        <div className="container-wide grid md:grid-cols-2 gap-6">
          {["Capital Optimization Review", "Structured Risk Design", "Regulatory Navigation", "Portfolio Governance"].map((t) => (
            <article key={t} className="bento-card">
              <h3 className="font-heading font-bold text-forest mb-2">{t}</h3>
              <p className="text-sm text-charcoal/60">Objective, product-agnostic institutional guidance.</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
