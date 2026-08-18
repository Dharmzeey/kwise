import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { fetchGuide, fetchGuides } from "@/lib/api";
import AuthorByline from "@/components/content/AuthorByline";
import FAQAccordion from "@/components/content/FAQAccordion";
import LastUpdatedBadge from "@/components/content/LastUpdatedBadge";
import RankedDeviceList from "@/components/content/RankedDeviceList";
import VerdictCallout from "@/components/content/VerdictCallout";

export const revalidate = 60;

export async function generateStaticParams() {
  const guides = await fetchGuides().catch(() => []);
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const guide = await fetchGuide(slug).catch(() => null);
  if (!guide) return {};
  const title = `${guide.title} | Kwise World`;
  return {
    title,
    description: guide.meta_description || guide.intro,
    alternates: { canonical: `https://kwiseworld.com/guides/${slug}` },
    openGraph: { title, description: guide.meta_description || guide.intro, url: `https://kwiseworld.com/guides/${slug}`, type: "article" },
  };
}

export default async function BuyingGuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = await fetchGuide(slug).catch(() => null);
  if (!guide) notFound();

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: guide.title,
    description: guide.intro,
    itemListElement: guide.entries.map((e) => ({
      "@type": "ListItem",
      position: e.rank,
      name: `${e.device.brand} ${e.device.model_name}`,
      url: `https://kwiseworld.com/phones/${e.device.slug}`,
    })),
  };

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    datePublished: guide.published_at,
    dateModified: guide.updated_at,
    author: guide.author ? { "@type": "Person", name: guide.author.name } : undefined,
  };

  const faqJsonLd = guide.faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: guide.faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  } : null;

  return (
    <div className="page">
      <div className="container ct-content-page">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
        {faqJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />}

        <nav className="crumbs">
          <Link href="/">Home</Link>
          <span>›</span>
          <Link href="/guides">Guides</Link>
          <span>›</span>
          <span>{guide.title}</span>
        </nav>

        <header className="ct-page-header">
          <div>
            <span className="ct-use-case-tag">{guide.use_case_tag.name}</span>
            <h1 className="ct-page-title">{guide.title}</h1>
            <div className="ct-page-meta">
              {guide.author && <AuthorByline author={guide.author} />}
              <LastUpdatedBadge isoDate={guide.updated_at} />
            </div>
          </div>
        </header>

        <VerdictCallout text={guide.intro} />

        {guide.body && <div className="ct-body-prose">{guide.body}</div>}

        <section className="ct-section">
          <h2 className="ct-section-title">
            Top {guide.entries.length} picks
          </h2>
          <RankedDeviceList entries={guide.entries} />
        </section>

        <FAQAccordion faqs={guide.faqs} />
      </div>
    </div>
  );
}
