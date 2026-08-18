import type { BuyingGuideEntry } from "@/lib/types";
import Link from "next/link";
import DeviceSpecSheet from "./DeviceSpecSheet";

export default function RankedDeviceList({ entries }: { entries: BuyingGuideEntry[] }) {
  return (
    <ol className="ct-ranked-list">
      {entries.map((entry) => (
        <li key={entry.id} className="ct-ranked-item">
          <div className="ct-ranked-header">
            <span className="ct-rank-badge">#{entry.rank}</span>
            <div>
              <h3 className="ct-ranked-name">
                <Link href={`/phones/${entry.device.slug}`}>
                  {entry.device.brand} {entry.device.model_name}
                </Link>
              </h3>
              {entry.device.price_band_ngn && (
                <span className="ct-ranked-price">{entry.device.price_band_ngn}</span>
              )}
            </div>
            <span className={`ct-stock-pill ${entry.device.is_in_stock ? "ct-in-stock" : "ct-out-stock"}`}>
              {entry.device.is_in_stock ? "In stock" : "Out of stock"}
            </span>
          </div>
          <p className="ct-ranked-blurb">{entry.blurb}</p>
          <DeviceSpecSheet device={entry.device} />
        </li>
      ))}
    </ol>
  );
}
