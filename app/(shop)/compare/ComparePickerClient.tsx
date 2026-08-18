"use client";

import { useState } from "react";
import type { DeviceListItem, SpecDiff } from "@/lib/types";
import { fetchSpecDiff } from "@/lib/api";
import SpecComparisonTable from "@/components/content/SpecComparisonTable";

export default function ComparePickerClient({ devices }: { devices: DeviceListItem[] }) {
  const [slugA, setSlugA] = useState("");
  const [slugB, setSlugB] = useState("");
  const [result, setResult] = useState<SpecDiff | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function compare() {
    if (!slugA || !slugB || slugA === slugB) {
      setError("Please pick two different devices.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      setResult(await fetchSpecDiff(slugA, slugB));
    } catch {
      setError("Could not load comparison. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="ct-picker">
      <div className="ct-picker-selects">
        <select
          className="ct-picker-select"
          value={slugA}
          onChange={(e) => setSlugA(e.target.value)}
        >
          <option value="">Select first device…</option>
          {devices.map((d) => (
            <option key={d.slug} value={d.slug}>
              {d.brand} {d.model_name}
            </option>
          ))}
        </select>

        <span className="ct-picker-vs">vs</span>

        <select
          className="ct-picker-select"
          value={slugB}
          onChange={(e) => setSlugB(e.target.value)}
        >
          <option value="">Select second device…</option>
          {devices.map((d) => (
            <option key={d.slug} value={d.slug}>
              {d.brand} {d.model_name}
            </option>
          ))}
        </select>

        <button
          className="btn btn-primary"
          onClick={compare}
          disabled={loading}
        >
          {loading ? "Loading…" : "Compare"}
        </button>
      </div>

      {error && <p className="ct-picker-error">{error}</p>}

      {result && (
        <SpecComparisonTable
          deviceA={result.device_a}
          deviceB={result.device_b}
          diff={result.diff}
        />
      )}
    </div>
  );
}
