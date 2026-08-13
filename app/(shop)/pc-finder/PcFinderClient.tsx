"use client";

import { useMemo, useState } from "react";
import Icon from "@/components/ui/Icon";
import type { Laptop } from "./laptops";

/* ── Types ─────────────────────────────────────────────────────────────────── */
type UseCase  = "light" | "school" | "office" | "power";
type Budget   = "120" | "180" | "280" | "any";
type Screen   = "compact" | "standard" | "large" | "any";
type MustHave = "touch" | "kbl" | "convertible";

interface Answers { useCase: UseCase; budget: Budget; screen: Screen; mustHaves: MustHave[] }

const INITIAL: Answers = { useCase: "office", budget: "any", screen: "any", mustHaves: [] };

const BUDGET_CEILING: Record<Budget, number | null> = {
  "120": 120_000, "180": 180_000, "280": 280_000, "any": null,
};

/* ── Scoring ────────────────────────────────────────────────────────────────── */
const PROC_TIER: Record<string, number> = {
  pentium: 1, celeron: 1, amd: 2, i3: 3, i5: 4, i7: 5,
};

function score(l: Laptop, a: Answers): number {
  const tier = PROC_TIER[l.processor];
  let s = 0;

  // ── 1. PROCESSOR × USE-CASE FIT (0–50) — dominant signal
  // Each use case has its own table. Processor type must outweigh everything else.
  if (a.useCase === "light") {
    // Light tasks: Pentium/Celeron/AMD is ideal. i3 fine. i5/i7 costly overkill.
    if      (tier === 1) s += 50;  // Pentium/Celeron — right-sized
    else if (tier === 2) s += 44;  // AMD — great for everyday use
    else if (tier === 3) s += 30;  // i3 — slightly overpowered but perfectly fine
    else if (tier === 4) s += 16;  // i5 — overkill, spending more than needed
    else                 s += 8;   // i7 — serious overkill
  } else if (a.useCase === "school") {
    // School: i3 is the sweet spot. i5 great too. AMD decent. Pentium borderline.
    if      (tier === 3) s += 50;  // i3 — smooth for Zoom, assignments, research
    else if (tier === 4) s += 42;  // i5 — handles school easily with headroom
    else if (tier === 2) s += 30;  // AMD — solid for most school tasks
    else if (tier === 5) s += 36;  // i7 — overkill but fine
    else                 s += 16;  // Pentium/Celeron — can manage but may lag
  } else if (a.useCase === "office") {
    // Office: i5 is the standard. i7 excellent. i3 borderline for multitasking.
    if      (tier === 4) s += 50;  // i5 — Excel, Zoom, multitasking — built for this
    else if (tier === 5) s += 44;  // i7 — handles any office workload comfortably
    else if (tier === 3) s += 20;  // i3 — workable for lighter office tasks only
    else if (tier === 2) s += 6;   // AMD — underpowered for serious office work
    else                 s += 2;   // Pentium/Celeron — not suited for office
  } else {
    // Power/creative: i7 ideal. Modern i5 (8th gen+) capable. Older processors won't cut it.
    if      (tier === 5)                    s += 50;  // i7 — built for heavy workloads
    else if (tier === 4 && l.gen >= 10)     s += 44;  // 10th+ gen i5 — excellent
    else if (tier === 4 && l.gen >= 8)      s += 38;  // 8th gen i5 — capable
    else if (tier === 4 && l.gen >= 6)      s += 20;  // older i5 — struggles with heavy apps
    else if (tier === 4)                    s += 8;   // pre-6th gen i5 — too old for power use
    else if (tier === 3 && l.gen >= 8)      s += 6;   // modern i3 — borderline
    else                                    s += 0;   // Pentium/AMD/old i3 — not suitable
  }

  // ── 2. RAM — weighted by use case (0–20)
  if (a.useCase === "light") {
    s += l.ram >= 4 ? 20 : 8;                          // 4GB is sufficient for light
  } else if (a.useCase === "school") {
    s += l.ram >= 8 ? 20 : l.ram >= 4 ? 13 : 0;
  } else {
    // office & power: 8GB is a real requirement, 4GB is a significant handicap
    s += l.ram >= 8 ? 20 : l.ram >= 4 ? 5 : 0;
  }

  // ── 3. Storage type (0–10, penalty for HDD on power)
  if (l.storageType === "ssd") {
    s += a.useCase === "power" ? 10 : 7;
  } else if (a.useCase === "power") {
    s -= 6;  // HDD is a real bottleneck for demanding workloads
  }

  // ── 4. Generation — normalized, not raw (0–10)
  // Capped so gen can influence ranking within same tier, but never override tier
  if (a.useCase === "light" || a.useCase === "school") {
    s += l.gen >= 8 ? 6 : l.gen >= 5 ? 4 : l.gen >= 3 ? 2 : 0;
  } else if (a.useCase === "office") {
    s += l.gen >= 10 ? 10 : l.gen >= 8 ? 8 : l.gen >= 6 ? 5 : l.gen >= 4 ? 3 : 1;
  } else {
    // Power: generation is critical — newer = meaningfully more capable
    s += l.gen >= 10 ? 10 : l.gen >= 8 ? 8 : l.gen >= 6 ? 3 : 0;
  }

  // ── 5. GPU — heavily weighted for power, minor bonus otherwise (0–15)
  if (l.gpu) {
    s += a.useCase === "power" ? 15 : a.useCase === "office" ? 4 : 2;
  }

  // ── 6. Screen match (0–12)
  if (a.screen !== "any") {
    const compact  = l.screen <= 13.3;
    const standard = l.screen === 14.0;
    const large    = l.screen >= 15.6;
    if      (a.screen === "compact"  && compact)                s += 12;
    else if (a.screen === "standard" && standard)               s += 12;
    else if (a.screen === "large"    && large)                  s += 12;
    else if (a.screen === "compact"  && standard)               s += 5;
    else if (a.screen === "standard" && (compact || large))     s += 4;
    else if (a.screen === "large"    && standard)               s += 5;
  } else {
    s += 5;
  }

  // ── 7. Must-have features — each selected feature scored independently
  // Having the feature: +20. Missing it: penalty pushes laptop out of top results.
  if (a.mustHaves.length === 0) {
    s += 5; // neutral bonus when no preference set
  } else {
    if (a.mustHaves.includes("touch"))       s += l.touch       ? 20 : -25;
    if (a.mustHaves.includes("kbl"))         s += l.kbl         ? 20 : -15;
    if (a.mustHaves.includes("convertible")) s += l.convertible ? 20 : -25;
  }

  // ── 8. Business-line reliability bonus (0–4)
  const n = l.name.toLowerCase();
  if (n.includes("elitebook") || n.includes("thinkpad"))    s += 4;
  else if (n.includes("latitude") || n.includes("probook")) s += 2;

  // ── 9. Budget utilization — small reward for using more of the selected budget (0–8)
  // A user picking ₦280k signals intent to spend more than a ₦180k user.
  // This breaks ties between equally-spec'd laptops at different price points.
  const budgetCeiling = BUDGET_CEILING[a.budget];
  if (budgetCeiling) {
    s += Math.round((l.price / budgetCeiling) * 8);
  }

  return s;
}

function matchReason(l: Laptop, a: Answers): string {
  const parts: string[] = [];
  const tier = PROC_TIER[l.processor];
  const proc = PROC_LABEL[l.processor];
  const genStr = l.gen > 0 ? ` ${l.gen}th Gen` : "";

  if (a.useCase === "light") {
    if (tier <= 2) parts.push(`${proc} — right-sized for browsing & everyday tasks`);
    else if (tier === 3) parts.push(`Core i3${genStr} — smooth for daily use`);
    else parts.push(`${proc}${genStr} — powerful, handles light tasks effortlessly`);
  } else if (a.useCase === "school") {
    if (tier === 3) parts.push(`Core i3${genStr} — smooth for assignments & Zoom`);
    else if (tier >= 4) parts.push(`${proc}${genStr} — more than enough for school`);
    else if (tier === 2) parts.push("AMD — decent for most school tasks");
    else parts.push("handles basic school needs");
  } else if (a.useCase === "office") {
    if (tier === 4) parts.push(`Core i5${genStr} — Excel, Zoom & multitasking ready`);
    else if (tier === 5) parts.push(`Core i7${genStr} — handles any office workload`);
    else parts.push(`${proc} — may feel slow with multiple apps open`);
  } else {
    if (tier === 5) parts.push(`Core i7${genStr} — built for demanding workloads`);
    else if (tier === 4 && l.gen >= 8) parts.push(`Core i5${genStr} — capable for coding & creative work`);
    else parts.push(`${proc}${genStr} — may struggle with heavy workloads`);
  }

  if (l.gpu && a.useCase === "power") parts.push("dedicated Nvidia GPU — graphics-ready");
  else if (l.storageType === "ssd") parts.push(`${l.storage}GB SSD — fast boot, snappy apps`);
  else if (l.ram >= 8) parts.push("8GB RAM — solid for multitasking");
  if (a.mustHaves.includes("touch") && l.touch) parts.push("touchscreen included");
  if (a.mustHaves.includes("kbl") && l.kbl) parts.push("backlit keyboard");
  if (a.mustHaves.includes("convertible") && l.convertible) parts.push("folds to tablet mode");

  return parts.slice(0, 2).join(" · ");
}

/* ── Chip helper ────────────────────────────────────────────────────────────── */
function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button type="button" className={`pc-finder-chip${active ? " active" : ""}`}
      onClick={onClick} aria-pressed={active}>
      {label}
    </button>
  );
}

/* ── Result card ────────────────────────────────────────────────────────────── */
const PROC_COLOR: Record<string, string> = {
  pentium: "pf-badge-grey", celeron: "pf-badge-grey", amd: "pf-badge-red",
  i3: "pf-badge-sky", i5: "pf-badge-blue", i7: "pf-badge-purple",
};
const PROC_LABEL: Record<string, string> = {
  pentium: "Pentium", celeron: "Celeron", amd: "AMD",
  i3: "Core i3", i5: "Core i5", i7: "Core i7",
};

function LaptopCard({ laptop, reason, topPick, ceiling }: {
  laptop: Laptop; reason: string; topPick: boolean; ceiling: number | null;
}) {
  const waText = encodeURIComponent(`Hi, I'm interested in the ${laptop.name}. Is it available?`);

  // Show savings badge when laptop is notably cheaper than the selected ceiling
  const savesAmount = ceiling && laptop.price < ceiling * 0.70
    ? Math.round((ceiling - laptop.price) / 1000)
    : null;

  // "Near limit" only when genuinely close — 88%+ of ceiling (e.g. ₦246k+ in a ₦280k search)
  const nearLimit = ceiling && laptop.price >= ceiling * 0.88;

  return (
    <div className={`pf-card${topPick ? " pf-card-top" : ""}`}>
      {topPick && (
        <div className="pf-top-badge">
          <Icon name="star" size={10} stroke={2} /> Top pick
        </div>
      )}

      <div className="pf-card-badges">
        <span className={`pf-badge ${PROC_COLOR[laptop.processor]}`}>
          {PROC_LABEL[laptop.processor]}{laptop.gen > 0 ? ` · ${laptop.gen}th Gen` : ""}
        </span>
        {savesAmount && <span className="pf-badge pf-badge-green">Saves ₦{savesAmount}k</span>}
        {nearLimit   && <span className="pf-badge pf-badge-amber">Near limit</span>}
        {laptop.touch       && <span className="pf-badge pf-badge-outline">Touch</span>}
        {laptop.kbl         && <span className="pf-badge pf-badge-outline">KBL</span>}
        {laptop.convertible && <span className="pf-badge pf-badge-outline">2-in-1</span>}
        {laptop.gpu         && <span className="pf-badge pf-badge-outline">GPU</span>}
      </div>

      <h3 className="pf-card-name">{laptop.name}</h3>

      <div className="pf-card-specs">
        <span>{laptop.ram}GB RAM</span>
        <span>{laptop.storage}GB {laptop.storageType.toUpperCase()}</span>
        <span>{laptop.screen}"</span>
      </div>

      <div className="pf-card-footer">
        <span className="pf-price">₦{laptop.price.toLocaleString()}</span>
        <a
          href={`https://wa.me/2349048807490?text=${waText}`}
          target="_blank" rel="noopener noreferrer"
          className="pf-ask-btn"
        >
          <Icon name="whatsapp" size={13} /> Ask about this
        </a>
      </div>

      <p className="pf-reason">
        <Icon name="check" size={12} stroke={2.5} /> {reason}
      </p>
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────────────────────── */
export default function PcFinderClient({ laptops }: { laptops: Laptop[] }) {
  const [answers, setAnswers] = useState<Answers>(INITIAL);

  function set<K extends keyof Answers>(key: K, val: Answers[K]) {
    setAnswers(prev => ({ ...prev, [key]: val }));
  }

  const results = useMemo(() => {
    const ceiling = BUDGET_CEILING[answers.budget];
    const inBudget = ceiling ? laptops.filter(l => l.price <= ceiling) : laptops;
    // If nothing fits the budget, show the 6 cheapest as a fallback
    const pool = inBudget.length >= 3 ? inBudget : [...laptops].sort((a, b) => a.price - b.price).slice(0, 8);
    return [...pool]
      .sort((a, b) => score(b, answers) - score(a, answers) || a.price - b.price);
  }, [answers, laptops]);

  const budgetLabel: Record<Budget, string> = {
    "120": "Under ₦120k", "180": "Up to ₦180k", "280": "Up to ₦280k", "any": "₦280k+ / All",
  };

  return (
    <div className="page pc-finder-page">
      <section className="pc-finder-hero">
        <div className="container">
          <p className="pc-finder-kicker"><Icon name="laptop" size={15} /> PC Finder</p>
          <h1>Find the right laptop — without overspending.</h1>
          <p>Four questions. We match you to what&apos;s actually in stock, based on what you&apos;ll really use it for.</p>
        </div>
      </section>

      <div className="container pc-finder-layout">

        {/* ── Form ── */}
        <section className="pc-finder-form" aria-label="Laptop finder questions">
          <div className="pc-finder-form-head">
            <h2>Answer 4 questions</h2>
            <p>Results update as you go.</p>
          </div>

          {/* Q1 — Budget (first because it's the hardest constraint) */}
          <div className="pc-finder-question" role="group" aria-labelledby="q1">
            <p id="q1" className="pc-finder-q-label"><span className="q-num">1</span> What&apos;s your budget?</p>
            <div className="pc-finder-chips">
              {(["120","180","280","any"] as Budget[]).map(b => (
                <Chip key={b} label={budgetLabel[b]} active={answers.budget === b} onClick={() => set("budget", b)} />
              ))}
            </div>
          </div>

          {/* Q2 — Use case */}
          <div className="pc-finder-question" role="group" aria-labelledby="q2">
            <p id="q2" className="pc-finder-q-label"><span className="q-num">2</span> What will you mainly use it for?</p>
            <div className="pc-finder-use-cases">
              {([
                { val: "light",  label: "Light / everyday",    desc: "YouTube, browsing, basic typing" },
                { val: "school", label: "School & study",       desc: "Assignments, research, Zoom calls" },
                { val: "office", label: "Work & office",        desc: "Excel, multitasking, presentations" },
                { val: "power",  label: "Heavy / creative",     desc: "Coding, video editing, demanding apps" },
              ] as Array<{ val: UseCase; label: string; desc: string }>).map(({ val, label, desc }) => (
                <button key={val} type="button"
                  className={`pc-finder-use-card${answers.useCase === val ? " active" : ""}`}
                  onClick={() => set("useCase", val)} aria-pressed={answers.useCase === val}>
                  <span className="pc-finder-use-title">{label}</span>
                  <span className="pc-finder-use-desc">{desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Q3 — Screen size */}
          <div className="pc-finder-question" role="group" aria-labelledby="q3">
            <p id="q3" className="pc-finder-q-label"><span className="q-num">3</span> What screen size do you prefer?</p>
            <div className="pc-finder-chips">
              <Chip label='Compact — 11"–13"' active={answers.screen === "compact"}  onClick={() => set("screen","compact")} />
              <Chip label='Standard — 14"'     active={answers.screen === "standard"} onClick={() => set("screen","standard")} />
              <Chip label='Large — 15.6"'       active={answers.screen === "large"}   onClick={() => set("screen","large")} />
              <Chip label="No preference"        active={answers.screen === "any"}     onClick={() => set("screen","any")} />
            </div>
          </div>

          {/* Q4 — Must-have (multi-select) */}
          <div className="pc-finder-question" role="group" aria-labelledby="q4" style={{ marginBottom: 0 }}>
            <p id="q4" className="pc-finder-q-label">
              <span className="q-num">4</span> Must-have features?
              <span className="pc-finder-q-sub"> Pick as many as you need.</span>
            </p>
            <div className="pc-finder-chips">
              {(["touch","kbl","convertible"] as MustHave[]).map(f => (
                <Chip
                  key={f}
                  label={f === "touch" ? "Touchscreen" : f === "kbl" ? "Backlit keyboard" : "Convertible / 2-in-1"}
                  active={answers.mustHaves.includes(f)}
                  onClick={() => setAnswers(prev => ({
                    ...prev,
                    mustHaves: prev.mustHaves.includes(f)
                      ? prev.mustHaves.filter(v => v !== f)
                      : [...prev.mustHaves, f],
                  }))}
                />
              ))}
              {answers.mustHaves.length > 0 && (
                <Chip label="Clear" active={false}
                  onClick={() => setAnswers(prev => ({ ...prev, mustHaves: [] }))} />
              )}
            </div>
          </div>

          {/* Live count */}
          <div className="pc-finder-match-bar">
            <span className="pc-finder-match-count">
              <Icon name="check-circle" size={13} />
              {results.length > 0 ? `${results.length} matches found` : "No matches — widening search…"}
            </span>
            <a href="#pf-results" className="pc-finder-see-results">
              See results <Icon name="arrow-down" size={12} />
            </a>
          </div>

          <div className="pc-finder-help">
            <p>Not sure what to pick? We&apos;ll help.</p>
            <a href="https://wa.me/2349048807490?text=Hi%2C+I+need+help+picking+a+laptop"
              target="_blank" rel="noopener noreferrer" className="pc-finder-wa">
              <Icon name="whatsapp" size={15} /> Chat on WhatsApp
            </a>
          </div>
        </section>

        {/* ── Results ── */}
        <section id="pf-results" className="pc-finder-results" aria-live="polite">
          <div className="pc-finder-results-head">
            <div>
              <p className="pc-finder-kicker">Best matches from our stock</p>
              <h2>
                {answers.budget !== "any" ? `${budgetLabel[answers.budget]} · ` : ""}
                {({ light: "Light use", school: "School & study", office: "Work & office", power: "Heavy / creative" } as const)[answers.useCase]}
              </h2>
            </div>
            <span className="pc-finder-count">{results.length} shown</span>
          </div>
          <p className="pc-finder-note">
            Ranked by how well they fit your answers. All specs shown are as listed — check with us before buying.
          </p>

          <div className="pc-finder-grid">
            {results.map((laptop, i) => (
              <LaptopCard
                key={laptop.id}
                laptop={laptop}
                reason={matchReason(laptop, answers)}
                topPick={i === 0}
                ceiling={BUDGET_CEILING[answers.budget]}
              />
            ))}
          </div>

          <div className="pf-browse-all">
            <p>Want to see everything, or have a specific model in mind?</p>
            <div className="pf-browse-actions">
              <a href="/category/laptops" className="btn btn-secondary">Browse all laptops</a>
              <a href="https://wa.me/2349048807490" target="_blank" rel="noopener noreferrer"
                className="pc-finder-wa">
                <Icon name="whatsapp" size={15} /> Chat with us
              </a>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
