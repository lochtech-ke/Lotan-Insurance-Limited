export const SITE = {
  name: "Lotan Insurance Agency Limited",
  shortName: "LOTAN",
  tagline: "Insurance Agency",
  url: "https://www.lia.insure",
  email: "info@lia.insure",
  phone: "+254 700 000 000",
  address: "Nairobi, Kenya",
  iraLicence: "IRA/05/26054/2026",
  description:
    "Engineering financial architecture. Unlocking capital through structured risk for institutional capital allocators.",
} as const;

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Solutions" },
  { href: "/insights", label: "Insights" },
  { href: "/executive-advisory", label: "Advisory" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
] as const;

export const FOOTER_SOLUTIONS = [
  { href: "/products#credit-protection", label: "Credit Protection Policy" },
  { href: "/products#performance-bond", label: "Performance Security Bond" },
  { href: "/products#advance-payment", label: "Advance Payment Guarantee" },
  { href: "/products#bid-bond", label: "Bid Bond" },
] as const;
