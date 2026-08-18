export default function VerdictCallout({ text }: { text: string }) {
  return (
    <div className="ct-verdict">
      <span className="ct-verdict-label">Verdict</span>
      <p className="ct-verdict-text">{text}</p>
    </div>
  );
}
