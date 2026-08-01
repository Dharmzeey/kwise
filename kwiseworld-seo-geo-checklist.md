# Kwise World — SEO + LLM Visibility Implementation Checklist

Goal: get indexed by Bing (which powers ChatGPT/Copilot retrieval), then become citeable by LLMs for gadget queries.
Ordered by impact. Do Phase 1 first — nothing else matters until Bing can see you.

---

## Phase 1 — Get discovered (do this week)

### Search engine submission
- [ ] **Bing Webmaster Tools** — create account, verify `kwiseworld.com`, import config from Google Search Console (one click). This is likely your entire "Bing can't see me" problem.
- [ ] Submit your sitemap in Bing Webmaster Tools.
- [ ] Run **URL Inspection** on: homepage, one `/category/phones` URL, one product page. Read what it reports and fix anything flagged.
- [ ] Turn on **IndexNow** (Bing Webmaster Tools → IndexNow). Wire it into your Django backend so every product publish/update pings `https://api.indexnow.org/indexnow`. Remember: it notifies, it doesn't force indexing.
- [ ] **Google Search Console** — verify domain, submit sitemap (if not already done).

### robots.txt
- [ ] Confirm nothing is blocking `Bingbot`.
- [ ] Explicitly **allow the AI crawlers**: `GPTBot`, `OAI-SearchBot`, `ChatGPT-User`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`.
- [ ] Reference your sitemap at the bottom.

```
User-agent: *
Allow: /

User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

Sitemap: https://kwiseworld.com/sitemap.xml
```

### Sitemap
- [ ] Ensure `sitemap.xml` lists **every** live URL: all products, all category pages, the swap page, offers, about, and every future blog post.
- [ ] Generate it dynamically from Django so new products appear automatically.
- [ ] Resubmit in both Bing and Google after big changes.

---

## Phase 2 — Structured data (JSON-LD) — biggest on-site win

You currently have **no schema markup**. This is what lets Bing build rich results and lets LLMs extract facts cleanly. Add each as a `<script type="application/ld+json">` block.

### Organization schema — sitewide (in your root layout)
- [ ] Add once, site-wide. The `sameAs` array is what links "Kwise World" across platforms so crawlers treat you as one verifiable entity.

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Kwise World",
  "url": "https://kwiseworld.com",
  "logo": "https://kwiseworld.com/logo.png",
  "description": "Trusted brand-new and UK-used phones, laptops, and accessories, tested before shipping, with delivery across Nigeria.",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "92B Lagelu Plaza, Iwo Road",
    "addressLocality": "Ibadan",
    "addressCountry": "NG"
  },
  "telephone": "+2349048807490",
  "sameAs": [
    "https://www.instagram.com/kwise.world",
    "https://www.tiktok.com/@kwiseworld4",
    "https://www.threads.net/@kwise.world"
  ]
}
```

### Product schema — on every product page
- [ ] Generate per product from your Django data. Use `itemCondition` to signal new vs used — this is a real differentiator for graded gadgets.
- [ ] Condition values: `NewCondition`, `UsedCondition`, or `RefurbishedCondition`.
- [ ] `priceCurrency` = `NGN`.

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "iPhone 13 Pro Max 128GB",
  "image": ["https://media.kwiseworld.com/..."],
  "description": "Foreign-used iPhone 13 Pro Max 128GB, tested and verified.",
  "brand": { "@type": "Brand", "name": "Apple" },
  "itemCondition": "https://schema.org/UsedCondition",
  "offers": {
    "@type": "Offer",
    "priceCurrency": "NGN",
    "price": "610000",
    "availability": "https://schema.org/InStock",
    "url": "https://kwiseworld.com/product/iphone-13-pro-max-128gb",
    "seller": { "@type": "Organization", "name": "Kwise World" }
  }
}
```

### BreadcrumbList schema — on product + category pages
- [ ] Helps Bing understand site structure and shows breadcrumb rich results.

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://kwiseworld.com" },
    { "@type": "ListItem", "position": 2, "name": "Phones", "item": "https://kwiseworld.com/category/phones" },
    { "@type": "ListItem", "position": 3, "name": "iPhone 13 Pro Max 128GB" }
  ]
}
```

### Review / AggregateRating schema
- [ ] Your homepage claims "Excellent Reviews" with no machine-readable data. Collect real reviews, then attach `AggregateRating` to products and/or the Organization. Don't fake this — schema spam gets penalized.

### FAQPage schema — on guide pages (see Phase 3)
- [ ] Add to every buying-guide page. Question-style Q&A blocks are among the most extractable formats for LLMs.

---

## Phase 3 — Content (this is what actually gets you cited)

Right now you're a catalog with almost no text an LLM can quote. Write answer-first pages targeting what Nigerians actually ask ChatGPT. Lead every section with a self-contained, quotable answer in the first 2–3 sentences, use question headings, keep facts fresh.

### Buying guides / articles to write
- [ ] **UK-used vs Nigeria-used vs Foreign-used phones — what's the difference?** (you already use these grades — own the definition)
- [ ] **How to check if an iPhone is original before buying in Nigeria**
- [ ] **iPhone 13 Pro Max price in Nigeria (2026)** — update the number regularly; recency is a ranking signal in AI answers
- [ ] **Best UK-used laptops for students in Nigeria under ₦300k**
- [ ] **How the Kwise swap/trade-in process works** (feeds your SwapAPI feature)
- [ ] **What to check before buying a used laptop (battery health, IMEI, warranty)**

### Content structure rules (apply to each article)
- [ ] First 2–3 sentences = the direct answer. No throat-clearing intro.
- [ ] Question-style H2/H3 headings.
- [ ] Cite primary sources where you make claims (manufacturer specs, official pricing) — links to high-trust sources raise your own trust score.
- [ ] Add FAQPage schema.
- [ ] Put a "last updated" date AND actually refresh the data.

---

## Phase 4 — llms.txt (cheap hygiene, low expectations)

- [ ] Add `https://kwiseworld.com/llms.txt` — site name, one-line description, links to key pages (categories, top guides, swap, about) with short descriptions.
- [ ] Reality check: large-scale analysis found ~zero correlation between having llms.txt and AI citations, and no major engine confirms it reads the file. Ship it in 20 minutes for completeness, then spend real effort on Phases 3 and 5.

---

## Phase 5 — Off-site brand mentions (strongest citation predictor)

This outweighs almost everything on your own domain for LLM citation. Brand mentions across independent sites are the #1 predictor of being cited.

- [ ] **Google Business Profile** — claim it (Iwo Road, Ibadan address). Feeds local + trust signals.
- [ ] **Nairaland** — genuine threads/answers where Kwise World naturally comes up (phone/laptop buying advice).
- [ ] **Reddit** — r/Nigeria and phone/tech subs; be useful, not spammy.
- [ ] **YouTube / TikTok reviews** — you already run content; make sure units and the Kwise World name appear in titles/descriptions with a link.
- [ ] **Nigerian tech blogs** — get mentioned or featured.
- [ ] **Consistency** — identical business name, Ibadan address, phone, and links everywhere. Inconsistency breaks the entity link.

---

## Priority order (if you only do things in sequence)

1. Bing Webmaster Tools + sitemap + IndexNow  ← unblocks everything
2. robots.txt (allow AI crawlers)
3. Organization + Product + Breadcrumb JSON-LD
4. First 2–3 buying guides with FAQ schema
5. Google Business Profile + first off-site mentions
6. llms.txt (last, lowest priority)

---

## How to measure

- [ ] Weekly: search 3 target queries (e.g. "where to buy UK-used iPhone in Nigeria") on ChatGPT, Perplexity, and Google AI Overview. Log date / platform / cited or not.
- [ ] Bing Webmaster Tools: watch indexed page count climb.
- [ ] Analytics: watch referral traffic from `chatgpt.com`, `perplexity.ai`, `bing.com`.
- [ ] Perplexity gives the fastest feedback loop (results in ~2–4 weeks); use it as your early signal.
