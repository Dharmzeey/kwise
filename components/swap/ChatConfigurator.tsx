"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { swapApi } from "@/lib/swap/api";
import type { ConfigState, DefectType, IphoneModel, IphoneSeries, StorageVariant } from "@/lib/swap/types";
import DefectsChecklist from "./DefectsChecklist";

interface Props {
  config: ConfigState;
  onChange: (config: ConfigState) => void;
  seriesList: IphoneSeries[];
  defects: DefectType[];
  allowDefects?: boolean;
  title: string;
}

function BotMsg({ children, delay }: { children: React.ReactNode; delay?: number }) {
  return (
    <div
      className="swap-chat-row swap-chat-row-bot swap-chat-anim-bot"
      style={delay ? { animationDelay: `${delay}ms` } : undefined}
    >
      <div className="swap-chat-avatar">
        <Image src="/logo.png" alt="Kwise" width={26} height={26} />
      </div>
      <div className="swap-chat-bubble swap-chat-bubble-bot">{children}</div>
    </div>
  );
}

function UserMsg({ text, onEdit }: { text: string; onEdit?: () => void }) {
  return (
    <div className="swap-chat-row swap-chat-row-user swap-chat-anim-user">
      <div className="swap-chat-bubble swap-chat-bubble-user">
        <span>{text}</span>
        {onEdit && (
          <button className="swap-chat-edit-btn" onClick={onEdit}>
            edit
          </button>
        )}
      </div>
    </div>
  );
}

function Chips({
  items,
  selected,
  onPick,
  baseDelay = 0,
}: {
  items: { id: number; label: string }[];
  selected: number | null;
  onPick: (id: number) => void;
  baseDelay?: number;
}) {
  return (
    <div className="swap-chat-chips">
      {items.map((item, i) => (
        <button
          key={item.id}
          className={`swap-chat-chip ${selected === item.id ? "swap-chat-chip-sel" : ""}`}
          style={{ animationDelay: `${baseDelay + i * 45}ms` }}
          onClick={() => onPick(item.id)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

function Typing() {
  return (
    <div className="swap-chat-typing-row">
      <div className="swap-chat-avatar">
        <Image src="/logo.png" alt="Kwise" width={26} height={26} />
      </div>
      <div className="swap-chat-typing">
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}

export default function ChatConfigurator({
  config,
  onChange,
  seriesList,
  defects,
  allowDefects = false,
  title,
}: Props) {
  const [models, setModels] = useState<IphoneModel[]>([]);
  const [storage, setStorage] = useState<StorageVariant[]>([]);
  const [editingStep, setEditingStep] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!config.seriesId) { setModels([]); return; }
    swapApi.models(config.seriesId).then(setModels).catch(console.error);
  }, [config.seriesId]);

  useEffect(() => {
    if (!config.modelId) { setStorage([]); return; }
    swapApi.storage(config.modelId).then(setStorage).catch(console.error);
  }, [config.modelId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [config, models.length, storage.length]);

  const sp  = config.seriesId  !== null;
  const mp  = config.modelId   !== null;
  const stp = config.storageId !== null;

  const activeSeries  = seriesList.find(s => s.id === config.seriesId);
  const activeModel   = models.find(m => m.id === config.modelId);
  const activeStorage = storage.find(s => s.id === config.storageId);

  const showModel   = sp  && editingStep !== "series";
  const showStorage = mp  && !["series", "model"].includes(editingStep ?? "");
  const showDefects = allowDefects && stp && !["series", "model", "storage"].includes(editingStep ?? "");

  const seriesLocked  = sp  && editingStep !== "series";
  const modelLocked   = mp  && !["series", "model"].includes(editingStep ?? "");
  const storageLocked = stp && !["series", "model", "storage"].includes(editingStep ?? "");
  const defectsLocked = config.defectsCommitted && !["series", "model", "storage", "defects"].includes(editingStep ?? "");

  const update = (patch: Partial<ConfigState>) => onChange({ ...config, ...patch });

  const pickSeries = (id: number) => {
    onChange({ seriesId: id, modelId: null, storageId: null, defectIds: [], defectsCommitted: false });
    setEditingStep(null);
  };
  const pickModel = (id: number) => {
    update({ modelId: id, storageId: null, defectsCommitted: false });
    setEditingStep(null);
  };
  const pickStorage = (id: number) => {
    update({ storageId: id });
    setEditingStep(null);
  };

  return (
    <section className="swap-chat-card">
      <div className="swap-chat-title">{title}</div>
      <div className="swap-chat-thread">

        {/* Step 1 — Series */}
        <BotMsg>Which iPhone series?</BotMsg>
        {seriesLocked ? (
          <UserMsg
            text={`iPhone ${activeSeries?.name}`}
            onEdit={() => setEditingStep("series")}
          />
        ) : (
          <Chips
            items={seriesList.map(s => ({ id: s.id, label: s.name }))}
            selected={config.seriesId}
            onPick={pickSeries}
          />
        )}

        {/* Step 2 — Model */}
        {showModel && (
          <>
            <BotMsg delay={200}>Which model?</BotMsg>
            {modelLocked ? (
              <UserMsg
                text={activeModel?.name ?? ""}
                onEdit={() => setEditingStep("model")}
              />
            ) : models.length === 0 ? (
              <Typing />
            ) : (
              <Chips
                items={models.map(m => ({ id: m.id, label: m.name }))}
                selected={config.modelId}
                onPick={pickModel}
                baseDelay={200}
              />
            )}
          </>
        )}

        {/* Step 3 — Storage */}
        {showStorage && (
          <>
            <BotMsg delay={200}>Storage capacity?</BotMsg>
            {storageLocked ? (
              <UserMsg
                text={activeStorage?.capacity ?? ""}
                onEdit={() => setEditingStep("storage")}
              />
            ) : storage.length === 0 ? (
              <Typing />
            ) : (
              <Chips
                items={storage.map(s => ({ id: s.id, label: s.capacity }))}
                selected={config.storageId}
                onPick={pickStorage}
                baseDelay={200}
              />
            )}
          </>
        )}

        {/* Step 4 — Defects (swap-from only) */}
        {showDefects && (
          <>
            <BotMsg delay={200}>
              Any damage or issues?{" "}
              <span style={{ color: "var(--ink-3)", fontWeight: 400 }}>
                Skip if perfect.
              </span>
            </BotMsg>
            {defectsLocked ? (
              <UserMsg
                text={
                  config.defectIds.length
                    ? `${config.defectIds.length} issue${config.defectIds.length > 1 ? "s" : ""} noted`
                    : "No issues — perfect condition"
                }
                onEdit={() => setEditingStep("defects")}
              />
            ) : (
              <div className="swap-chat-defects-wrap">
                <DefectsChecklist
                  defects={defects}
                  selectedIds={config.defectIds}
                  onChange={ids => update({ defectIds: ids })}
                />
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      update({ defectsCommitted: true });
                      setEditingStep(null);
                    }}
                  >
                    Confirm condition
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        <div ref={bottomRef} />
      </div>
    </section>
  );
}
