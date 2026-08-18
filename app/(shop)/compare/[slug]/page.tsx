import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { fetchComparison, fetchComparisons } from "@/lib/api";
import AuthorByline from "@/components/content/AuthorByline";
import FAQAccordion from "@/components/content/FAQAccordion";
import LastUpdatedBadge from "@/components/content/LastUpdatedBadge";
import SpecComparisonTable from "@/components/content/SpecComparisonTable";
import VerdictCallout from "@/components/content/VerdictCallout";

export const revalidate = 60;

export async function generateStaticParams() {
  const comparisons = await fetchComparisons().catch(() => []);
  return comparisons.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const comparison = await fetchComparison(slug).catch(() => null);
  if (!comparison) return {};
  const title = `${comparison.title} | Kwise World`;
  return {
    title,
    description: comparison.meta_description || comparison.intro,
    alternates: { canonical: `https://kwiseworld.com/compare/${slug}` },
    openGraph: { title, description: comparison.meta_description || comparison.intro, url: `https://kwiseworld.com/compare/${slug}`, type: "article" },
  };
}

export default async function ComparisonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const comparison = await fetchComparison(slug).catch(() => null);
  if (!comparison) notFound();

  const { device_a, device_b } = comparison;

  const diff = [
    { label: "Chipset",       a_value: device_a.chipset,                                b_value: device_b.chipset },
    { label: "RAM",           a_value: device_a.ram_options.join(", ") || "—",          b_value: device_b.ram_options.join(", ") || "—" },
    { label: "Storage",       a_value: device_a.storage_options.join(", ") || "—",      b_value: device_b.storage_options.join(", ") || "—" },
    { label: "Display size",  a_value: device_a.display_specs.size || "—",              b_value: device_b.display_specs.size || "—" },
    { label: "Display type",  a_value: device_a.display_specs.type || "—",              b_value: device_b.display_specs.type || "—" },
    { label: "Refresh rate",  a_value: device_a.display_specs.refresh_rate || "—",      b_value: device_b.display_specs.refresh_rate || "—" },
    { label: "Battery",       a_value: device_a.battery_capacity_mah ? `${device_a.battery_capacity_mah} mAh` : "—", b_value: device_b.battery_capacity_mah ? `${device_b.battery_capacity_mah} mAh` : "—" },
    { label: "Price (NGN)",   a_value: device_a.price_band_ngn || "—",                  b_value: device_b.price_band_ngn || "—" },
  ];

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: comparison.title,
    datePublished: comparison.published_at,
    dateModified: comparison.updated_at,
    author: comparison.author ? { "@type": "Person", name: comparison.author.name } : undefined,
  };

  const faqJsonLd = comparison.faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: comparison.faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  } : null;

  return (
    <div className="page">
      <div className="container ct-content-page">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
        {faqJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />}

        <nav className="crumbs">
          <Link href="/">Home</Link>
          <span>›</span>
          <Link href="/compare">Compare</Link>
          <span>›</span>
          <span>{comparison.title}</span>
        </nav>

        <header className="ct-page-header">
          <div>
            <h1 className="ct-page-title">{comparison.title}</h1>
            <div className="ct-page-meta">
              {comparison.author && <AuthorByline author={comparison.author} />}
              <LastUpdatedBadge isoDate={comparison.updated_at} />
            </div>
          </div>
        </header>

        <VerdictCallout text={comparison.overall_recommendation} />

        <p className="ct-intro-prose">{comparison.intro}</p>

        <section className="ct-section">
          <h2 className="ct-section-title">Spec comparison</h2>
          <SpecComparisonTable
            deviceA={device_a}
            deviceB={device_b}
            diff={diff}
            winnerByCategory={comparison.winner_by_category}
          />
        </section>

        {Object.keys(comparison.winner_by_category).length > 0 && (
          <section className="ct-section">
            <h2 className="ct-section-title">Category winners</h2>
            <div className="ct-winners-grid">
              {Object.entries(comparison.winner_by_category).map(([cat, winner]) => {
                const winnerLabel =
                  winner === "tie"
                    ? "Tie"
                    : winner === "a"
                    ? `${device_a.brand} ${device_a.model_name}`
                    : `${device_b.brand} ${device_b.model_name}`;
                return (
                  <div key={cat} className="ct-winner-card">
                    <span className="ct-winner-cat">{cat}</span>
                    <span className="ct-winner-name">{winnerLabel}</span>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        <div className="ct-device-links">
          <Link href={`/phones/${device_a.slug}`} className="ct-device-link">
            Full profile: {device_a.brand} {device_a.model_name} →
          </Link>
          <Link href={`/phones/${device_b.slug}`} className="ct-device-link">
            Full profile: {device_b.brand} {device_b.model_name} →
          </Link>
        </div>

        <FAQAccordion faqs={comparison.faqs} />
      </div>
    </div>
  );
}
