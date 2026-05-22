import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Institutional Products & Guarantees",
  description: "Credit protection policies, performance bonds, advance payment guarantees, and bid bonds.",
};

const products = [
  { id: "credit-protection", title: "Credit Protection Policy", desc: "Balance sheet hedge safeguarding lenders and corporate borrowers." },
  { id: "performance-bond", title: "Performance Security Bond", desc: "Guarantees contractual execution for EPC and infrastructure projects." },
  { id: "advance-payment", title: "Advance Payment Guarantee", desc: "Secures upfront mobilization without cash drag on retained earnings." },
  { id: "bid-bond", title: "Bid Bond", desc: "Bid security without tying up physical cash collateral." },
];

export default function ProductsPage() {
  return (
    <main id="main-content">
      <PageHero pill="Capital Unlocking Instruments" title={<>Structured <span className="text-gradient-light">Products.</span></>} description="Lender-grade guarantees and credit protection for institutional deployment." />

      {products.map((p, i) => (
        <section key={p.id} id={p.id} className={`section-padding ${i % 2 ? "section-sage" : "section-light"} border-b border-slateBorder`}>
          <div className="container-wide max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-forest mb-4">{p.title}</h2>
            <p className="text-charcoal/70 text-lg leading-relaxed mb-8">{p.desc}</p>
            <Link href="/contact#quote" className="btn-primary inline-flex">Request Structuring Proposal</Link>
          </div>
        </section>
      ))}
    </main>
  );
}
