import Link from "next/link";
import { MapPin, Mail } from "lucide-react";
import { SITE, FOOTER_SOLUTIONS } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="bg-sage pt-16 pb-10 border-t border-slateBorder">
      <div className="container-wide">
        <div className="grid md:grid-cols-12 gap-10 mb-14">
          <div className="md:col-span-4">
            <Link href="/" className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-lg bg-forest text-white flex items-center justify-center font-heading font-extrabold">
                L
              </div>
              <span className="font-heading font-extrabold text-lg text-forest">{SITE.shortName} Insurance Agency</span>
            </Link>
            <p className="text-charcoal/55 text-sm max-w-sm leading-relaxed">{SITE.description}</p>
          </div>
          <div className="md:col-span-2">
            <h5 className="text-xs font-bold text-forest uppercase tracking-widest mb-5">Solutions</h5>
            <ul className="space-y-3">
              {FOOTER_SOLUTIONS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="footer-link">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-2">
            <h5 className="text-xs font-bold text-forest uppercase tracking-widest mb-5">Company</h5>
            <ul className="space-y-3">
              <li><Link href="/about" className="footer-link">About Lotan</Link></li>
              <li><Link href="/#architecture" className="footer-link">Financial Architecture</Link></li>
              <li><Link href="/executive-advisory" className="footer-link">Executive Advisory</Link></li>
              <li><Link href="/contact" className="footer-link">Contact</Link></li>
            </ul>
          </div>
          <div className="md:col-span-2">
            <h5 className="text-xs font-bold text-forest uppercase tracking-widest mb-5">Intelligence</h5>
            <ul className="space-y-3">
              <li><Link href="/insights" className="footer-link">Insights</Link></li>
              <li><Link href="/case-studies" className="footer-link">Case Studies</Link></li>
              <li><Link href="/partnerships" className="footer-link">Partnerships</Link></li>
              <li><Link href="/standards" className="footer-link">Global Standards</Link></li>
            </ul>
          </div>
          <div className="md:col-span-2">
            <h5 className="text-xs font-bold text-forest uppercase tracking-widest mb-5">Office</h5>
            <ul className="space-y-3 text-sm text-charcoal/55">
              <li className="flex items-start gap-2">
                <MapPin className="text-accent w-4 h-4 shrink-0 mt-0.5" aria-hidden />
                {SITE.address}
              </li>
              <li className="flex items-start gap-2">
                <Mail className="text-accent w-4 h-4 shrink-0 mt-0.5" aria-hidden />
                {SITE.email}
              </li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-slateBorder flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-charcoal/50">
          <p>&copy; 2026 {SITE.name}. All rights reserved.</p>
          <div className="flex flex-wrap gap-5 items-center justify-center">
            <span className="font-semibold text-forest">IRA Licence No: {SITE.iraLicence}</span>
            <Link href="#" className="footer-link">Privacy Policy</Link>
            <Link href="#" className="footer-link">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
