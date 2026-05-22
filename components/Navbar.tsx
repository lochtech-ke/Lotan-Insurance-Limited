"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { NAV_LINKS, SITE } from "@/lib/constants";

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    return () => document.body.classList.remove("menu-open");
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <nav
        id="navbar"
        className={`fixed w-full z-50 transition-all duration-300 border-b ${
          scrolled ? "scrolled py-3 bg-white/94 border-slateBorder" : "py-5 border-transparent bg-white/60"
        } backdrop-blur-lg`}
        aria-label="Main navigation"
      >
        <div className="container-wide flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 group" aria-label={`${SITE.name} — Home`}>
            <div className="w-10 h-10 rounded-xl bg-forest text-white flex items-center justify-center font-heading font-extrabold text-lg shadow-md group-hover:scale-105 transition-transform">
              L
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-extrabold text-base tracking-tight text-forest leading-none">
                {SITE.shortName}
              </span>
              <span className="text-[10px] uppercase tracking-widest text-accent font-semibold mt-1">
                {SITE.tagline}
              </span>
            </div>
          </Link>

          <div className="hidden xl:flex items-center gap-7">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link ${isActive(link.href) ? "active" : ""}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-5">
            <Link href="/contact" className="text-sm font-bold text-forest hover:text-accent transition-colors">
              Client Login
            </Link>
            <Link href="/contact#quote" className="btn-primary">
              <span>Get a Quote</span>
              <ArrowUpRight className="w-4 h-4" aria-hidden />
            </Link>
          </div>

          <button
            type="button"
            className="lg:hidden text-forest p-2 rounded-lg hover:bg-forest/5"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      <div
        id="mobile-menu"
        className={`fixed inset-0 bg-forest/98 backdrop-blur-xl z-40 flex flex-col justify-center items-center transition-all duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none hidden"
        }`}
        role="dialog"
        aria-modal="true"
      >
        <button
          type="button"
          className="absolute top-6 right-6 text-white p-2"
          onClick={() => setOpen(false)}
          aria-label="Close menu"
        >
          <X className="w-8 h-8" />
        </button>
        <div className="flex flex-col items-center space-y-7 text-center px-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="mobile-link text-2xl font-heading font-semibold text-white hover:text-accent"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contact#quote"
            className="bg-accent hover:bg-white hover:text-forest text-white text-lg font-bold px-10 py-4 rounded-full shadow-glow"
            onClick={() => setOpen(false)}
          >
            Get a Quote
          </Link>
        </div>
      </div>
    </>
  );
}
