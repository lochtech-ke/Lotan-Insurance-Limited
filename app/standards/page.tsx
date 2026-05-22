import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = { title: "Global Standards Framework" };

export default function StandardsPage() {
  const items = [
    { title: "Basel III / IV Alignment", desc: "Risk-weighted asset and capital adequacy frameworks." },
    { title: "Lender Documentation", desc: "International due diligence-ready policy wordings." },
    { title: "IRA Compliance", desc: `Licensed ${SITE.iraLicence}` },
    { title: "Audit Readiness", desc: "Transparent underwriting and claims protocols." },
  ];

  return (
    <main id="main-content">
      <PageHero pill="Global Standards" title="International Compliance Architecture" description="Lender-grade documentation and sovereign transaction readiness." dark={false} />
      <section className="section-padding section-light">
        <div className="container-wide trust-grid">
          {items.map((item) => (
            <div key={item.title} className="trust-item trust-item--light">
              <h3 className="font-heading font-bold text-forest mb-2">{item.title}</h3>
              <p className="text-sm text-charcoal/60">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
