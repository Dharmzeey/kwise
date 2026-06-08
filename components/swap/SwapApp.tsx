"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { swapApi } from "@/lib/swap/api";
import { formatNaira, formatNairaShort } from "@/lib/swap/format";
import type { ConfigState, DefectType, EstimateResponse, HistoryEntry, IphoneSeries } from "@/lib/swap/types";
import ChatConfigurator from "./ChatConfigurator";
import SwapHeroSection from "./HeroSection";
import HistoryStrip from "./HistoryStrip";
import ResultPanel from "./ResultPanel";
import SwapToast from "./SwapToast";

interface Props {
  seriesList: IphoneSeries[];
  defects: DefectType[];
}

function emptyConfig(): ConfigState {
  return { seriesId: null, modelId: null, storageId: null, defectIds: [], defectsCommitted: false };
}

function isFromReady(cfg: ConfigState) {
  return cfg.storageId !== null && cfg.defectsCommitted;
}
function isToReady(cfg: ConfigState) {
  return cfg.storageId !== null;
}

function useHistory() {
  const [items, setItems] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("swap.history") ?? "[]");
      if (saved.length) setItems(saved);
    } catch {}
  }, []);

  const push = useCallback((entry: HistoryEntry) => {
    setItems((prev) => {
      const next = [entry, ...prev].slice(0, 6);
      try { localStorage.setItem("swap.history", JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setItems([]);
    try { localStorage.removeItem("swap.history"); } catch {}
  }, []);

  return { items, push, clear };
}

function useToast() {
  const [message, setMessage] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flash = useCallback((msg: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setMessage(msg);
    timerRef.current = setTimeout(() => setMessage(null), 2600);
  }, []);
  return { message, flash };
}

export default function SwapApp({ seriesList, defects }: Props) {
  const [fromConfig, setFromConfig] = useState<ConfigState>(emptyConfig);
  const [toConfig, setToConfig]     = useState<ConfigState>(emptyConfig);
  const [toConfig2, setToConfig2]   = useState<ConfigState>(emptyConfig);
  const [compareMode, setCompareMode] = useState(false);
  const [estimate, setEstimate]   = useState<EstimateResponse | null>(null);
  const [estimate2, setEstimate2] = useState<EstimateResponse | null>(null);
  const [loading, setLoading]     = useState(false);
  const { items: history, push: pushHistory, clear: clearHistory } = useHistory();
  const { message: toast, flash } = useToast();

  const lastKey = useRef("");
  useEffect(() => {
    if (!isFromReady(fromConfig) || !isToReady(toConfig)) {
      setEstimate(null);
      setEstimate2(null);
      return;
    }
    const key = JSON.stringify([fromConfig.storageId, fromConfig.defectIds, toConfig.storageId]);
    if (key === lastKey.current) return;
    lastKey.current = key;
    setLoading(true);

    const requests: Promise<void>[] = [
      swapApi
        .estimate(fromConfig.storageId!, toConfig.storageId!, fromConfig.defectIds)
        .then((res) => {
          setEstimate(res);
          const amtText =
            res.direction === "even"
              ? "Even swap"
              : (res.direction === "upgrade" ? "Add " : "Receive ") +
                formatNairaShort(Math.abs(res.net_ngn));
          pushHistory({
            fromText: res.from_device,
            toText: res.to_device,
            amountText: amtText,
            fromConfig,
            toConfig,
            ts: Date.now(),
          });
        }),
    ];

    if (compareMode && isToReady(toConfig2)) {
      requests.push(
        swapApi
          .estimate(fromConfig.storageId!, toConfig2.storageId!, fromConfig.defectIds)
          .then(setEstimate2)
      );
    }

    Promise.all(requests)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [fromConfig, toConfig, toConfig2, compareMode]);

  const handleSave = () => flash("Quote saved to your history");

  const handleShare = async () => {
    if (!estimate) return;
    const text =
      `Swap: ${estimate.from_device} → ${estimate.to_device}\n` +
      (estimate.direction === "even"
        ? "Even swap"
        : (estimate.direction === "upgrade" ? "You add " : "You receive ") +
          formatNaira(Math.abs(estimate.net_ngn)));
    try {
      await navigator.clipboard.writeText(text);
      flash("Quote copied to clipboard");
    } catch {
      flash("Couldn't copy — try Save instead");
    }
  };

  const handleReset = () => {
    setFromConfig(emptyConfig());
    setToConfig(emptyConfig());
    setToConfig2(emptyConfig());
    setCompareMode(false);
    setEstimate(null);
    setEstimate2(null);
    lastKey.current = "";
  };

  const handleUseHistory = (entry: HistoryEntry) => {
    setFromConfig(entry.fromConfig);
    setToConfig(entry.toConfig);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="swap-page">
      <SwapHeroSection />

      <div className="swap-page-actions">
        <button className="btn btn-ghost btn-sm" onClick={handleReset}>
          New quote
        </button>
      </div>

      <div id="estimator" className="swap-estimator">
        <div className="swap-grid">
          {/* Left — Swap From */}
          <div className="swap-col">
            <ChatConfigurator
              config={fromConfig}
              onChange={setFromConfig}
              seriesList={seriesList}
              defects={defects}
              allowDefects
              title="Swapping from"
            />
          </div>

          {/* Right — Swap To */}
          <div className="swap-col">
            <div className="swap-to-stack">
              <ChatConfigurator
                config={toConfig}
                onChange={setToConfig}
                seriesList={seriesList}
                defects={[]}
                allowDefects={false}
                title={compareMode ? "Swap to · Option A" : "Swapping to"}
              />

              <div className="swap-compare-row">
                <button
                  className={`swap-compare-toggle ${compareMode ? "swap-compare-toggle-on" : ""}`}
                  onClick={() => setCompareMode((v) => !v)}
                >
                  <span className="swap-compare-dot" />
                  {compareMode ? "Comparing two options" : "Compare two swap-to options"}
                </button>
              </div>

              {compareMode && (
                <ChatConfigurator
                  config={toConfig2}
                  onChange={setToConfig2}
                  seriesList={seriesList}
                  defects={[]}
                  allowDefects={false}
                  title="Swap to · Option B"
                />
              )}
            </div>
          </div>
        </div>

        <div className="swap-result-wrap">
          <ResultPanel
            estimate={estimate}
            estimate2={compareMode ? estimate2 : undefined}
            compareMode={compareMode}
            loading={loading}
            onSave={handleSave}
            onShare={handleShare}
          />
        </div>

        <HistoryStrip
          items={history}
          onClear={clearHistory}
          onUse={handleUseHistory}
        />
      </div>

      <SwapToast message={toast} />
    </div>
  );
}
