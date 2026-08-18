import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { fetchDevice, fetchDevices } from "@/lib/api";
import AuthorByline from "@/components/content/AuthorByline";
import DeviceSpecSheet from "@/components/content/DeviceSpecSheet";
import FAQAccordion from "@/components/content/FAQAccordion";
import LastUpdatedBadge from "@/components/content/LastUpdatedBadge";
import VerdictCallout from "@/components/content/VerdictCallout";

export const revalidate = 60;

export async function generateStaticParams() {
  const devices = await fetchDevices().catch(() => []);
  return devices.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const device = await fetchDevice(slug).catch(() => null);
  if (!device) return {};
  const title = `${device.brand} ${device.model_name} — Review, Specs & Price | Kwise World`;
  const desc = device.meta_description || device.verdict_summary || `Full specs and price for the ${device.brand} ${device.model_name}. Available at Kwise World.`;
  return {
    title,
    description: desc,
    alternates: { canonical: `https://kwiseworld.com/phones/${slug}` },
    openGraph: { title, description: desc, url: `https://kwiseworld.com/phones/${slug}`, type: "website" },
  };
}

export default async function DeviceProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const device = await fetchDevice(slug).catch(() => null);
  if (!device) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${device.brand} ${device.model_name}`,
    brand: { "@type": "Brand", name: device.brand },
    // NOTE: availability is intentionally omitted — is_in_stock is a manual hint
    // not yet wired to the live catalog, and wrong availability in structured
    // data is worse than none. Re-add once it reads from the real product source.
    offers: device.price_band_ngn
      ? { "@type": "AggregateOffer", priceCurrency: "NGN", lowPrice: device.price_band_ngn }
      : undefined,
    description: device.verdict_summary,
  };

  const faqJsonLd = device.faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: device.faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  } : null;

  return (
    <div className="page">
      <div className="container ct-content-page">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {faqJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />}

        <nav className="crumbs">
          <Link href="/">Home</Link>
          <span>›</span>
          <Link href="/phones">Devices</Link>
          <span>›</span>
          <span>{device.brand} {device.model_name}</span>
        </nav>

        <header className="ct-page-header">
          <div>
            <span className="ct-device-brand">{device.brand}</span>
            <h1 className="ct-page-title">{device.model_name}</h1>
            <div className="ct-page-meta">
              <LastUpdatedBadge isoDate={device.updated_at} />
              <span className={`ct-stock-pill ${device.is_in_stock ? "ct-in-stock" : "ct-out-stock"}`}>
                {device.is_in_stock ? "In stock" : "Out of stock"}
              </span>
            </div>
          </div>
          {device.price_band_ngn && (
            <div className="ct-price-block">
              <span className="ct-price-label">Price (NGN)</span>
              <span className="ct-price-value">{device.price_band_ngn}</span>
              {device.price_band_cad && <span className="ct-price-cad">{device.price_band_cad} CAD</span>}
            </div>
          )}
        </header>

        {device.verdict_summary && <VerdictCallout text={device.verdict_summary} />}

        <section className="ct-section">
          <h2 className="ct-section-title">Full specifications</h2>
          <DeviceSpecSheet device={device} />
        </section>

        {device.use_case_tags.length > 0 && (
          <div className="ct-tags">
            {device.use_case_tags.map((t) => (
              <Link key={t.slug} href={`/guides?use_case=${t.slug}`} className="ct-tag">
                {t.name}
              </Link>
            ))}
          </div>
        )}

        <FAQAccordion faqs={device.faqs} />
      </div>
    </div>
  );
}
