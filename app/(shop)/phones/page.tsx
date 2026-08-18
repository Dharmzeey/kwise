import type { Metadata } from "next";
import Link from "next/link";
import { fetchDevices } from "@/lib/api";
import LastUpdatedBadge from "@/components/content/LastUpdatedBadge";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Phone & Device Profiles — Kwise World",
  description: "Detailed spec sheets, price bands, and verdicts for every phone and device in the Kwise World catalog.",
  alternates: { canonical: "https://kwiseworld.com/phones" },
};

export default async function PhonesIndexPage() {
  const devices = await fetchDevices().catch(() => []);

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">Device profiles</h1>
        <p className="ct-index-lead">
          Specs, price bands, and straight verdicts for every device we stock.
        </p>

        {devices.length === 0 ? (
          <p className="ct-empty">No device profiles published yet.</p>
        ) : (
          <div className="ct-device-grid">
            {devices.map((d) => (
              <Link key={d.slug} href={`/phones/${d.slug}`} className="ct-device-card">
                <div className="ct-device-card-top">
                  <span className="ct-device-brand">{d.brand}</span>
                  <span className={`ct-stock-pill ${d.is_in_stock ? "ct-in-stock" : "ct-out-stock"}`}>
                    {d.is_in_stock ? "In stock" : "Out of stock"}
                  </span>
                </div>
                <h2 className="ct-device-name">{d.model_name}</h2>
                {d.price_band_ngn && <p className="ct-device-price">{d.price_band_ngn}</p>}
                {d.verdict_summary && (
                  <p className="ct-device-verdict">{d.verdict_summary}</p>
                )}
                <div className="ct-device-card-foot">
                  <LastUpdatedBadge isoDate={d.updated_at} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
