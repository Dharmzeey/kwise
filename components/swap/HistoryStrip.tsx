"use client";

import type { HistoryEntry } from "@/lib/swap/types";

interface Props {
  items: HistoryEntry[];
  onClear: () => void;
  onUse: (entry: HistoryEntry) => void;
}

export default function HistoryStrip({ items, onClear, onUse }: Props) {
  if (!items.length) return null;

  return (
    <div className="swap-history">
      <div className="swap-history-head">
        <div className="swap-eyebrow">Recently checked</div>
        <button className="btn btn-ghost btn-sm" onClick={onClear}>
          Clear
        </button>
      </div>
      <div className="swap-history-row">
        {items.map((entry, i) => (
          <button key={i} className="swap-history-card" onClick={() => onUse(entry)}>
            <div className="swap-history-card-from">{entry.fromText}</div>
            <div className="swap-history-card-arrow">→</div>
            <div className="swap-history-card-to">{entry.toText}</div>
            <div className="swap-history-card-amt">{entry.amountText}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
