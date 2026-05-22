# Lotan Insurance Agency Limited — Financial Architecture Platform

Next.js 15 institutional website with CMS-backed insights, Lighthouse-optimized delivery, and secure lead capture.

**Live:** [www.lia.insure](https://www.lia.insure)

## Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router) |
| Styling | Tailwind CSS + Tier-One design system (`css/main.css`) |
| Motion | Framer Motion-ready architecture, optimized canvas hero |
| CMS | Markdown (`content/insights/`) + optional **Sanity** |
| APIs | `/api/leads`, `/api/chat` (Next.js Route Handlers) |
| Fonts | `next/font` (Inter + Sora) — no render-blocking CDN |
| Deploy | Vercel (auto-detects Next.js) |

## Quick Start

```bash
# Requires Node.js 18+
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

```bash
npm run build
npm start
npm run test:e2e   # requires dev server running
```

### Legacy Python server (optional)

Static HTML archives live in `legacy/`. To run the old stack:

```bash
python backend.py   # http://localhost:8080
PORT=8080 python e2e_test.py
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage — financial architecture, solutions, trust, insights preview |
| `/contact` | **Contact & consultation** — full form + office details |
| `/about` | Identity, values, IRA compliance |
| `/products` | Capital instruments (CPP, bonds, guarantees) |
| `/insights` | Thought leadership index (CMS) |
| `/insights/[slug]` | Article detail (SSG) |
| `/case-studies` | Institutional outcomes |
| `/executive-advisory` | C-suite advisory |
| `/partnerships` | Global partnerships |
| `/standards` | Basel / IRA / governance framework |

## CMS — Insights

### Default: Git-based Markdown

Add files to `content/insights/*.md` with frontmatter:

```yaml
---
title: "Article Title"
excerpt: "Short description"
category: "Capital Optimization"
readTime: "8 min read"
date: "2026-03-15"
gradient: "from-forest to-emerald/80"
---
```

### Optional: Sanity CMS

Set in Vercel / `.env.local`:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_token
```

Schema reference: `sanity/schema.ts`

When Sanity env vars are present, insights are fetched from Sanity; otherwise Markdown is used.

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | No | Enables Sanity CMS |
| `SANITY_API_TOKEN` | No | Sanity read token |

## Regulatory

**IRA Licence:** IRA/05/26054/2026

## Lighthouse Optimizations

- `next/font` with `display: swap`
- No Tailwind CDN / no GSAP CDN on critical path
- Static generation for insight articles
- Compressed responses, security headers via `next.config.ts`
- Semantic HTML, skip links, ARIA on navigation and forms

## Project Structure

```
app/              # Next.js App Router pages & API routes
components/       # React UI (Navbar, ContactForm, ChatWidget, …)
content/insights/ # Markdown CMS articles
lib/              # CMS, chat, database helpers
legacy/           # Archived static HTML (pre-migration)
css/main.css      # Institutional design system v4
```

---

**Lotan Insurance Agency Limited** — Architects of Financial Value.
