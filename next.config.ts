import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/about.html", destination: "/about", permanent: true },
      { source: "/products.html", destination: "/products", permanent: true },
      { source: "/insights.html", destination: "/insights", permanent: true },
      { source: "/case-studies.html", destination: "/case-studies", permanent: true },
      { source: "/executive-advisory.html", destination: "/executive-advisory", permanent: true },
      { source: "/partnerships.html", destination: "/partnerships", permanent: true },
      { source: "/standards.html", destination: "/standards", permanent: true },
      { source: "/index.html#quote", destination: "/contact", permanent: false },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
