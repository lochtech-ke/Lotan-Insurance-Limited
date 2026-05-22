import Link from "next/link";
import { ArrowRight, Layers, Shield, Globe, Check } from "lucide-react";
import { HeroCanvas } from "@/components/HeroCanvas";
import { InsightCard } from "@/components/InsightCard";
import { ContactForm } from "@/components/ContactForm";
import { getAllInsights } from "@/lib/cms";

export async function HomeContent() {
  const insights = (await getAllInsights()).slice(0, 3);

  return (
    <>
      <section className="hero-cinematic" aria-labelledby="hero-heading">
        <HeroCanvas />
        <div className="hero-mesh" aria-hidden />
        <div className="hero-glow-orb hero-glow-orb--1" aria-hidden />
        <div className="hero-glow-orb hero-glow-orb--2" aria-hidden />
        <div className="container-wide w-full relative z-10">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            <div className="lg:col-span-7">
              <div className="pill pill-light mb-6">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald" />
                </span>
                <span>Financial Architecture · Capital Optimization · Risk Engineering</span>
              </div>
              <h1 id="hero-heading" className="hero-headline text-forest mb-6">
                Engineering
                <br />
                <span className="text-gradient">Financial Architecture.</span>
              </h1>
              <p className="hero-sub mb-8">
                Unlocking capital through structured risk. Lotan positions insurance as a strategic financial instrument — transforming balance sheet constraints into deployable corporate capital.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <Link href="/contact#quote" className="btn-primary w-full sm:w-auto justify-center">
                  Schedule Strategic Consultation
                  <ArrowRight className="w-5 h-5" aria-hidden />
                </Link>
                <Link href="/#solutions" className="btn-outline w-full sm:w-auto justify-center">
                  Explore Solutions
                  <Layers className="w-5 h-5" aria-hidden />
                </Link>
              </div>
              <div className="flex flex-wrap gap-6 text-xs font-semibold text-charcoal/45 uppercase tracking-wider">
                <span className="flex items-center gap-2"><Shield className="w-3.5 h-3.5 text-accent" /> IRA Regulated</span>
                <span className="flex items-center gap-2"><Globe className="w-3.5 h-3.5 text-accent" /> Global Transaction Ready</span>
              </div>
            </div>
            <div className="lg:col-span-5 hero-metrics">
              <div className="metric-card metric-card--dark">
                <div className="metric-value text-gradient-light">Capital</div>
                <div className="metric-label text-white/60">Structured risk → deployable liquidity</div>
              </div>
              <div className="metric-card">
                <div className="metric-value text-forest">Tier-1</div>
                <div className="metric-label">Institutional underwriting standards</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="marquee-section" aria-hidden>
        <div className="marquee-track">
          <div className="marquee-inner">
            {["Basel III / IV Capital Framework", "International Transaction Readiness", "Project Finance & EPC", "Trade Finance Ecosystems", "DFI Partnerships", "Credit Protection & Guarantees"].flatMap((t) => [t, t]).map((t, i) => (
              <span key={i} className="marquee-item"><span className="marquee-dot" />{t}</span>
            ))}
          </div>
        </div>
      </div>

      <section id="architecture" className="section-padding section-forest relative overflow-hidden">
        <div className="container-wide relative z-10 grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <div className="pill pill-dark mb-5">Financial Architecture</div>
            <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-white mb-6">Structured Risk as a Capital Instrument</h2>
            <p className="text-white/70 text-lg leading-relaxed mb-8">
              Insurance-led structures connecting risk transfer, treasury optimization, and capital efficiency for multinationals, infrastructure developers, and DFIs.
            </p>
            <Link href="/contact" className="btn-white inline-flex">Discuss Capital Optimization <ArrowRight className="w-4 h-4" /></Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {["Risk Transfer", "Treasury Strategy", "Capital Markets", "Governance"].map((t) => (
              <div key={t} className="glass-card rounded-2xl p-6">
                <div className="text-accent text-xs font-bold uppercase tracking-widest mb-2">{t}</div>
                <p className="text-white/75 text-sm">Institutional-grade structuring aligned to lender due diligence.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="solutions" className="section-padding section-light">
        <div className="container-wide">
          <div className="section-header">
            <div className="pill pill-light mb-4">Capital Unlocking Instruments</div>
            <h2 className="section-title">Core Capital Instruments</h2>
            <p className="section-desc">Sophisticated risk-transfer solutions engineered to bypass liquidity constraints.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <article className="product-card product-card-featured">
              <div className="product-tag">Credit Optimization</div>
              <h3 className="text-2xl font-heading font-bold mb-4">Loan Enablement Instrument</h3>
              <p className="text-white/70 text-sm mb-8 flex-grow">Structured credit protection lowering risk-weighted asset pressure for lenders.</p>
              <Link href="/products#credit-protection" className="text-accent font-bold text-sm inline-flex items-center gap-2">Explore <ArrowRight className="w-4 h-4" /></Link>
            </article>
            {[
              { tag: "Project Support", title: "Project Financing Enabler", href: "/products#performance-bond" },
              { tag: "Liquidity", title: "Mobilization Capital", href: "/products#advance-payment" },
              { tag: "Tender", title: "Competitive Financing Tool", href: "/products#bid-bond" },
            ].map((p) => (
              <article key={p.href} className="product-card product-card-light">
                <div className="product-tag">{p.tag}</div>
                <h3 className="text-2xl font-heading font-bold text-forest mb-4">{p.title}</h3>
                <Link href={p.href} className="text-emerald font-bold text-sm inline-flex items-center gap-2 mt-auto">Details <ArrowRight className="w-4 h-4" /></Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="why-us" className="section-padding section-sage">
        <div className="container-wide">
          <div className="section-header">
            <h2 className="section-title">Why Sophisticated Capital Optimizers Choose Lotan</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {["Objective Financial Engineering", "Capital Market Ready", "Proven Capital Unlocking", "Balance Sheet Optimization", "Enabling Growth", "Financial Architecture Expertise"].map((t) => (
              <article key={t} className="bento-card">
                <h4 className="font-heading font-bold text-lg text-forest mb-2">{t}</h4>
                <p className="text-charcoal/60 text-sm">Institutional advisory driven by balance sheet outcomes, not product bias.</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="trust" className="section-padding section-dark">
        <div className="container-wide">
          <div className="section-header">
            <h2 className="section-title text-white">Institutional Trust & Compliance</h2>
          </div>
          <div className="trust-grid">
            <div className="trust-item">
              <Shield className="w-6 h-6 text-accent mb-4" />
              <h4 className="font-heading font-bold text-white mb-2">IRA Licensed</h4>
              <p className="text-white/60 text-sm">IRA/05/26054/2026</p>
            </div>
            <div className="trust-item">
              <Check className="w-6 h-6 text-accent mb-4" />
              <h4 className="font-heading font-bold text-white mb-2">Basel-Aligned</h4>
              <p className="text-white/60 text-sm">Capital framework parameters for lenders.</p>
            </div>
          </div>
          <p className="text-center mt-8"><Link href="/standards" className="text-accent font-semibold hover:underline">View Global Standards Framework →</Link></p>
        </div>
      </section>

      <section id="insights" className="section-padding section-sage">
        <div className="container-wide">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div>
              <div className="pill pill-light mb-4">Thought Leadership</div>
              <h2 className="section-title text-left">Financial Architecture Insights</h2>
            </div>
            <Link href="/insights" className="btn-outline shrink-0 self-start">View All Insights</Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {insights.map((post) => (
              <InsightCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </section>

      <section id="quote" className="section-padding section-light">
        <div className="container-wide max-w-4xl">
          <div className="cta-banner p-8 md:p-14 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold mb-4 relative z-10">Request Structured Risk Advisory</h2>
            <p className="text-white/75 mb-8 relative z-10 text-sm">Also available: <Link href="/contact" className="text-accent underline">Contact page</Link> · <Link href="/contact#quote" className="text-white/80 underline">Get a Quote</Link></p>
            <ContactForm className="relative z-10 bg-white p-6 md:p-8 rounded-2xl shadow-2xl border border-slateBorder text-left" />
          </div>
        </div>
      </section>
    </>
  );
}
