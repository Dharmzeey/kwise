# Kwise World — Modern SEO + GEO Implementation Brief

**Stack:** Next.js (App Router) storefront + Django backend(s), single domain via Traefik.
**Goal:** Make every key page fully crawlable by search engines AND AI engines (ChatGPT, Gemini, Perplexity, Google AI Overviews), and feed them structured, machine-readable product/trade-in data so Kwise gets surfaced and recommended.

Work top to bottom. Each task has a definition of done. Do not skip the verification steps.

---

## TASK 1 — Guarantee server-side HTML for all discoverable pages

Crawlers and AI bots must receive full content in the initial HTML response, not after client hydration.

- Render these as server components with data in the initial payload: home, products listing (PLP), product detail (PDP), pre-order, swap/trade-in estimator, blog index, blog post.
- For product/blog pages use `generateStaticParams` + ISR (revalidate on a sensible interval). Do not fetch core content (title, price, specs, condition) client-side only.
- Each page must export Next.js `generateMetadata` returning a unique `<title>`, meta description, `og:` and `twitter:` tags, and a canonical URL.

**Done when:** `curl -s https://<domain>/<a-product-url>` returns the product title, price, and condition in the raw HTML with no JS execution.

---

## TASK 2 — Crawl control (allow the AI bots)

Create/replace `robots.txt` served at the domain root (route it through Traefik to the storefront).

- `Allow: /` for general crawling.
- Explicitly allow: `Googlebot`, `Bingbot`, `GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`, `Applebot`, `CCBot`.
- Disallow only: cart, checkout, account, admin, internal API routes, and faceted-filter URLs with query params (e.g. `Disallow: /*?*sort=`).
- Reference the sitemap at the bottom: `Sitemap: https://<domain>/sitemap.xml`.

**Done when:** robots.txt loads at root and does not block any AI crawler.

---

## TASK 3 — Sitemaps

Generate sitemaps dynamically from Django data (it owns the catalog). Split into:
- `/sitemap.xml` (index) referencing the children below
- `/sitemap-products.xml` — all live product/model pages, with `lastmod`
- `/sitemap-pages.xml` — home, PLP, pre-order, swap, static
- `/sitemap-blog.xml` — blog posts with `lastmod`

Expose via a Django endpoint or Next.js route, whichever sits cleaner behind Traefik. Submit to Google Search Console and Bing Webmaster Tools (note this as a manual follow-up step for the owner).

**Done when:** all sitemaps return valid XML, include only canonical 200-status URLs, and exclude filtered/duplicate URLs.

---

## TASK 4 — Canonical + duplicate control

- Every page emits one self-referential canonical (or points to the canonical version for variants/filters).
- Faceted/sorted listing URLs must canonicalize to the clean PLP and be `noindex` if they only reorder existing content.
- Pagination: each page self-canonicalizes; do not canonicalize page 2+ back to page 1.

**Done when:** no two indexable URLs serve substantially the same content without a canonical pointing to one source.

---

## TASK 5 — JSON-LD structured data (highest leverage)

Inject valid JSON-LD `<script type="application/ld+json">` per page type. Generate from real Django data, never hardcode.

- **PDP** — `Product`: `name`, `image[]`, `description`, `brand`, `sku`, `mpn`/`gtin` (when available), and **`itemCondition`** set to `https://schema.org/UsedCondition` or `RefurbishedCondition`. Include `offers` with `price`, `priceCurrency: "NGN"`, `availability`, `url`. Add `aggregateRating` + `review[]` once reviews exist.
- **PLP / collection** — `ItemList` of the products shown, with positions and URLs.
- **Home + global** — `Organization` (logo, url, `sameAs[]` social profiles, contact) — use `LocalBusiness` with address for the Nigeria operation if applicable. Render site-wide.
- **All pages** — `BreadcrumbList` matching the visible breadcrumb.
- **Swap/trade-in page** — model this as `Service` (or a structured `Product`/`Offer` set) so the per-model, per-condition Naira trade-in values are machine-extractable. This is proprietary data — expose it cleanly.
- **Buying-guide / FAQ pages** — `FAQPage` with real Q&A.

**Done when:** every type validates with zero errors in Google's Rich Results Test and Schema.org validator, and values match what's on the rendered page.

---

## TASK 6 — `llms.txt`

Create `/llms.txt` at the root (Markdown, served as text/plain or text/markdown).

- Short description of what Kwise is (used/graded iPhone & Samsung wholesale + retail, Canada–Nigeria, trade-in/swap estimator, pre-order).
- Linked sections: Products, Trade-in/Swap, Pre-order, Buying Guides/Blog, About/Contact — each a bullet with an absolute URL and one line of context.
- Point explicitly to the most authoritative buying guides and the swap estimator.
- Keep it current; regenerate when major sections change.

**Done when:** `/llms.txt` loads as plain text and links resolve to live pages.

---

## TASK 7 — Reviews capture (critical for AI recommendation)

AI engines weight user-generated content above brand content, so reviews are not optional.

- Add a customer review capture + display on PDPs (rating + text), stored in Django.
- Render reviews server-side and feed them into the PDP `Product` schema (`review[]`, `aggregateRating`).
- Add a post-purchase review-request trigger (email/WhatsApp link) — implement the hook/endpoint; owner wires the message.

**Done when:** reviews render in initial HTML and appear inside valid Product JSON-LD.

---

## TASK 8 — Product feed for shopping surfaces

Generate a Google Merchant Center–compatible product feed from Django:
- Required fields: `id`, `title`, `description`, `link`, `image_link`, `availability`, `price` (NGN), `brand`, `condition` (used/refurbished), `mpn`/`gtin` where available.
- Serve as a scheduled-fetchable feed URL (XML or TSV). Owner connects it in Merchant Center.

**Done when:** feed validates against Merchant Center spec with no disapprovals on required fields.

---

## TASK 9 — Performance / Core Web Vitals

- All images (including AI-generated content images) go through `next/image`, correctly sized, lazy-loaded below the fold, modern formats (WebP/AVIF).
- Preload the LCP image on PDP/home; defer non-critical JS.
- Confirm caching headers via Traefik for static assets.

**Done when:** Lighthouse mobile scores LCP < 2.5s, CLS < 0.1, INP in "good" on PDP and home.

---

## TASK 10 — Measurement hooks

- Add Google Search Console + Bing Webmaster verification meta tags / DNS records (owner completes verification).
- Add analytics that capture referrer so AI-referral traffic (chatgpt.com, perplexity.ai, gemini, etc.) is identifiable.

**Done when:** verification tags are present and an AI-referral segment is filterable in analytics.

---

## Build order (priority)
1. Tasks 1–4 (foundation: render, crawl, sitemaps, canonicals) — table stakes.
2. Task 5 (structured data) — highest leverage for effort.
3. Tasks 6–7 (llms.txt + reviews) — the AI-recommendation layer.
4. Tasks 8–10 (feed, performance, measurement).

## Hard rules
- Generate all schema/feeds/sitemaps from live Django data — never hardcode or fabricate values.
- Used-phone units are unique (IMEI-level). Index per **model + grade**, not per physical unit, so units selling out don't create dead/thin URLs.
- Do not create thin, near-duplicate pages. If a page wouldn't help a human who landed on it, don't ship it.
