import { ReactNode } from "react";

type Props = {
  pill: string;
  title: ReactNode;
  description: string;
  dark?: boolean;
  children?: ReactNode;
};

export function PageHero({ pill, title, description, dark = true, children }: Props) {
  return (
    <section className={`pt-36 pb-16 relative overflow-hidden ${dark ? "section-forest" : "bg-mint"}`}>
      <div className="container-wide relative z-10 text-center">
        <div className={`pill mb-5 inline-flex ${dark ? "pill-dark" : "pill-light"}`}>
          <span>{pill}</span>
        </div>
        <h1 className={`text-4xl md:text-6xl font-heading font-extrabold mb-5 tracking-tight ${dark ? "text-white" : "text-forest"}`}>
          {title}
        </h1>
        <p className={`max-w-2xl mx-auto text-lg leading-relaxed ${dark ? "text-white/70" : "text-charcoal/70"}`}>
          {description}
        </p>
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
}
