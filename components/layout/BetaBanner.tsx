export default function BetaBanner() {
  return (
    <div className="beta-banner" role="status" aria-live="polite">
      <span className="beta-pill">🚧 Beta</span>
      <span>
        We&apos;re live &amp; fully functional —{" "}
        <strong>no payments will be charged</strong> during this phase.
        Full launch: <strong>August 15th, 2026</strong>.
      </span>
    </div>
  );
}
