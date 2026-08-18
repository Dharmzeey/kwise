import type { Metadata } from "next";
import { fetchComparisons, fetchDevices } from "@/lib/api";
import ComparePickerClient from "./ComparePickerClient";
import Link from "next/link";
import LastUpdatedBadge from "@/components/content/LastUpdatedBadge";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Compare Phones & Devices — Kwise World",
  description: "Pick any two devices and get a side-by-side spec comparison. Editorial comparisons with full verdicts also available.",
  alternates: { canonical: "https://kwiseworld.com/compare" },
};

export default async function CompareIndexPage() {
  const [comparisons, devices] = await Promise.all([
    fetchComparisons().catch(() => []),
    fetchDevices().catch(() => []),
  ]);

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">Compare devices</h1>

        {/* Interactive picker — client component */}
        <section className="ct-section">
          <h2 className="ct-section-title">Pick any two devices</h2>
          <ComparePickerClient devices={devices} />
        </section>

        {/* Editorial comparisons */}
        {comparisons.length > 0 && (
          <section className="ct-section">
            <h2 className="ct-section-title">Editorial comparisons</h2>
            <div className="ct-guide-grid">
              {comparisons.map((c) => (
                <Link key={c.slug} href={`/compare/${c.slug}`} className="ct-guide-card">
                  <h3 className="ct-guide-card-title">{c.title}</h3>
                  <p className="ct-guide-card-intro">
                    {c.device_a.brand} {c.device_a.model_name} vs {c.device_b.brand} {c.device_b.model_name}
                  </p>
                  <div className="ct-guide-card-foot">
                    <LastUpdatedBadge isoDate={c.updated_at} />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
