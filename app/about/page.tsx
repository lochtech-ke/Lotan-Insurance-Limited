import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About Us",
  description: "About Lotan Insurance Agency — identity, mission, values, and IRA regulatory compliance.",
};

export default function AboutPage() {
  return (
    <main id="main-content">
      <PageHero pill="Who We Are" title="Our Identity." description="Elite risk protection bridging complexity and transactional certainty for institutional capital allocators." />

      <section className="section-padding section-light">
        <div className="container-wide max-w-3xl mx-auto text-center">
          <p className="text-lg text-charcoal/75 leading-relaxed mb-6">
            {SITE.name} was built to provide credit protection frameworks and performance security guarantees meeting international project finance standards.
          </p>
          <Link href="/contact#quote" className="btn-primary inline-flex"><span>Get a Quote</span></Link>
        </div>
      </section>

      <section className="section-padding section-sage">
        <div className="container-wide grid md:grid-cols-2 gap-8">
          <article className="bento-card">
            <h3 className="font-heading font-bold text-xl text-forest mb-3">Our Mission</h3>
            <p className="text-charcoal/60">Deliver transparent, financially backed guarantee products empowering institutions to execute project timelines with maximum risk coverage.</p>
          </article>
          <article className="bento-card">
            <h3 className="font-heading font-bold text-xl text-forest mb-3">Our Vision</h3>
            <p className="text-charcoal/60">Premier guarantee and credit protection partner across East Africa, driving major capital infrastructure deployments.</p>
          </article>
        </div>
      </section>

      <section className="section-padding section-forest">
        <div className="container-wide text-center">
          <h2 className="text-4xl font-heading font-extrabold text-white mb-12">Our Core Values</h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
            {["Integrity", "Client Focus", "Reliability", "Expertise", "Partnership"].map((v) => (
              <div key={v} className="glass-card rounded-2xl p-6">
                <div className="text-accent font-heading font-bold mb-2">{v}</div>
                <p className="text-white/65 text-sm">Institutional excellence in underwriting and advisory.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding section-light text-center">
        <h3 className="text-3xl font-heading font-extrabold text-forest mb-4">Regulatory &amp; Compliance Framework</h3>
        <p className="text-charcoal/70 max-w-2xl mx-auto mb-6">
          Fully registered under the Insurance Regulatory Authority (IRA) of Kenya.
        </p>
        <div className="inline-flex items-center gap-3 px-8 py-4 bg-mint rounded-full border border-slateBorder font-heading font-bold text-forest">
          IRA LICENCE: {SITE.iraLicence}
        </div>
      </section>
    </main>
  );
}
