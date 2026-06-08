"use client";

import { useEffect, useState } from "react";
import { formatNaira, formatNairaShort } from "@/lib/swap/format";
import type { EstimateResponse } from "@/lib/swap/types";
import PhoneGlyph from "./ui/PhoneGlyph";

const THINKING_MS = 2000;

interface Props {
  estimate: EstimateResponse | null;
  estimate2?: EstimateResponse | null;
  compareMode?: boolean;
  loading?: boolean;
  onSave: () => void;
  onShare: () => void;
}

export default function ResultPanel({
  estimate,
  estimate2,
  compareMode,
  loading,
  onSave,
  onShare,
}: Props) {
  const [displayed,  setDisplayed]  = useState<EstimateResponse | null>(null);
  const [displayed2, setDisplayed2] = useState<EstimateResponse | null>(null);
  const [thinking,   setThinking]   = useState(false);

  useEffect(() => {
    if (!estimate) {
      setDisplayed(null);
      setDisplayed2(null);
      setThinking(false);
      return;
    }
    setThinking(true);
    const t = setTimeout(() => {
      setThinking(false);
      setDisplayed(estimate);
      setDisplayed2(estimate2 ?? null);
    }, THINKING_MS);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estimate]);

  // ── Empty state ───────────────────────────────────────────────────────────
  if (!displayed && !loading && !thinking) {
    return (
      <div className="swap-result-empty">
        <div className="swap-result-empty-dot" />
        <div>
          <div style={{ fontSize: 16, fontWeight: 500, color: "var(--ink)" }}>
            Your estimate appears here
          </div>
          <div style={{ fontSize: 13, color: "var(--ink-3)", marginTop: 4 }}>
            Finish all steps on both sides to see the price
          </div>
        </div>
      </div>
    );
  }

  // ── Skeleton / loading ───────────────────────────────────────────────────
  if (loading || thinking) {
    return (
      <div className="swap-result swap-result-skeleton">
        <div className="swap-result-header">
          <div className="swap-sk-line" style={{ width: 130, height: 11 }} />
          <div style={{ display: "flex", gap: 8 }}>
            <div className="swap-sk-pill" style={{ width: 54 }} />
            <div className="swap-sk-pill" style={{ width: 54 }} />
          </div>
        </div>
        <div className="swap-sk-flow">
          <div className="swap-sk-side">
            <div className="swap-sk-circle" />
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div className="swap-sk-line" style={{ width: 28, height: 9 }} />
              <div className="swap-sk-line" style={{ width: 90, height: 13 }} />
            </div>
          </div>
          <div className="swap-sk-arrow-block" />
          <div className="swap-sk-side">
            <div className="swap-sk-circle" />
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div className="swap-sk-line" style={{ width: 20, height: 9 }} />
              <div className="swap-sk-line" style={{ width: 100, height: 13 }} />
            </div>
          </div>
        </div>
        <div className="swap-sk-headline">
          <div className="swap-sk-line" style={{ width: 70, height: 12, margin: "0 auto 12px" }} />
          <div className="swap-sk-line" style={{ width: 180, height: 48, margin: "0 auto 10px", borderRadius: 10 }} />
          <div className="swap-sk-line" style={{ width: 110, height: 11, margin: "0 auto" }} />
        </div>
        <div className="swap-result-foot" style={{ borderTop: "1px solid var(--line)", marginTop: 24, paddingTop: 20 }}>
          <div className="swap-sk-circle" style={{ width: 18, height: 18, borderRadius: "50%" }} />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
            <div className="swap-sk-line" style={{ width: "90%", height: 10 }} />
            <div className="swap-sk-line" style={{ width: "65%", height: 10 }} />
          </div>
        </div>
      </div>
    );
  }

  // ── Result ───────────────────────────────────────────────────────────────
  return (
    <div className="swap-result">
      <div className="swap-result-header">
        <div className="swap-eyebrow">Estimated swap quote</div>
        <div className="swap-result-actions">
          <button className="btn btn-ghost btn-sm" onClick={onSave}>Save</button>
          <button className="btn btn-ghost btn-sm" onClick={onShare}>Share</button>
        </div>
      </div>

      <QuoteBlock estimate={displayed!} label={compareMode ? "Option A" : undefined} />

      {compareMode && displayed2 && (
        <>
          <div style={{ height: 1, background: "var(--line)", margin: "24px 0" }} />
          <QuoteBlock estimate={displayed2} label="Option B" />
        </>
      )}

      {displayed && (
        <div className="swap-repair-breakdown">
          {displayed.repair_breakdown.length > 0 && (
            <div className="swap-breakdown-rows">
              {displayed.repair_breakdown.map((item, i) => (
                <div key={i} className="swap-breakdown-row">
                  <span className="swap-breakdown-name">{item.defect}</span>
                  <span className="swap-breakdown-vals">
                    <span className="swap-breakdown-pct">−{item.deduction_pct}%</span>
                    {item.repair_cost_ngn > 0 && (
                      <span className="swap-breakdown-cost">+ {formatNaira(item.repair_cost_ngn)} repair</span>
                    )}
                  </span>
                </div>
              ))}
              <div className="swap-breakdown-row swap-breakdown-row-sub">
                <span>Service fee</span>
                <span>{formatNaira(displayed.service_fee_ngn)}</span>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="swap-result-foot">
        <div className="swap-result-foot-icon">i</div>
        <div>
          Quotes are an estimate based on current market value and the condition you reported.
          Final price is confirmed at inspection.
        </div>
      </div>
    </div>
  );
}

function QuoteBlock({ estimate, label }: { estimate: EstimateResponse; label?: string }) {
  const { net_ngn, direction, from_device, to_device } = estimate;
  const verb =
    direction === "upgrade" ? "You add"
    : direction === "downgrade" ? "You receive"
    : "Even swap";

  return (
    <div className="swap-quote">
      {label && <div className="swap-quote-label">{label}</div>}

      <div className="swap-quote-flow">
        <div className="swap-quote-side">
          <PhoneGlyph size={28} tone="silver" />
          <div>
            <div className="swap-quote-side-eyebrow">From</div>
            <div className="swap-quote-side-text">{from_device}</div>
          </div>
        </div>
        <div className="swap-quote-arrow">→</div>
        <div className="swap-quote-side">
          <PhoneGlyph size={28} tone="graphite" />
          <div>
            <div className="swap-quote-side-eyebrow">To</div>
            <div className="swap-quote-side-text">{to_device}</div>
          </div>
        </div>
      </div>

      <div className="swap-quote-headline">
        <div className="swap-quote-verb">{verb}</div>
        <div
          className="swap-quote-amount"
          style={{
            color:
              direction === "upgrade" ? "var(--swap-neg)"
              : direction === "downgrade" ? "var(--swap-pos)"
              : "var(--ink)",
          }}
        >
          {direction === "even" ? "Even" : formatNairaShort(Math.abs(net_ngn))}
        </div>
        {direction !== "even" && (
          <div className="swap-quote-conf">{formatNaira(Math.abs(net_ngn))} total</div>
        )}
      </div>
    </div>
  );
}
