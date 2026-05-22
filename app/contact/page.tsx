import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { ContactForm } from "@/components/ContactForm";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact & Consultation",
  description: "Schedule strategic consultation with Lotan Insurance Agency. Institutional inquiry, capital optimization, and structured risk advisory.",
};

export default function ContactPage() {
  return (
    <main id="main-content">
      <PageHero
        pill="Contact & Consultation"
        title={
          <>
            Initiate <span className="text-gradient-light">Strategic Advisory</span>
          </>
        }
        description="Connect with our financial architecture desk for institutional inquiries, capital instrument structuring, and executive consultation."
      />

      <section className="section-padding section-light">
        <div className="container-wide">
          <div className="grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-5 space-y-8">
              <div>
                <h2 className="font-heading font-bold text-2xl text-forest mb-4">Corporate Office</h2>
                <ul className="space-y-5 text-charcoal/70">
                  <li className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-accent shrink-0 mt-0.5" aria-hidden />
                    <span>{SITE.address}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-accent shrink-0 mt-0.5" aria-hidden />
                    <a href={`mailto:${SITE.email}`} className="hover:text-accent font-semibold">
                      {SITE.email}
                    </a>
                  </li>
                  <li className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-accent shrink-0 mt-0.5" aria-hidden />
                    <span>{SITE.phone}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-accent shrink-0 mt-0.5" aria-hidden />
                    <span>Mon–Fri · 08:00–18:00 EAT</span>
                  </li>
                </ul>
              </div>

              <div className="p-6 rounded-2xl bg-mint border border-slateBorder">
                <h3 className="font-heading font-bold text-forest mb-2">Regulatory Status</h3>
                <p className="text-sm text-charcoal/60 leading-relaxed mb-3">
                  Fully licensed under the Insurance Regulatory Authority (IRA) of Kenya.
                </p>
                <p className="font-heading font-bold text-forest text-sm">IRA Licence: {SITE.iraLicence}</p>
              </div>

              <p className="text-sm text-charcoal/50">
                Prefer the homepage form?{" "}
                <Link href="/#quote" className="text-accent font-semibold hover:underline">
                  Get a Quote
                </Link>
              </p>
            </div>

            <div className="lg:col-span-7" id="quote">
              <div className="cta-banner p-8 md:p-10">
                <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-white mb-2 relative z-10">
                  Request Structured Risk Advisory
                </h2>
                <p className="text-white/75 mb-8 text-sm relative z-10">
                  Submit your institutional inquiry. Our advisory team responds within one business day.
                </p>
                <ContactForm className="relative z-10 bg-white p-6 md:p-8 rounded-2xl shadow-2xl border border-slateBorder" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
