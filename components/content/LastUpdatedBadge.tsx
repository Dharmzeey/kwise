export default function LastUpdatedBadge({ isoDate }: { isoDate: string }) {
  const formatted = new Date(isoDate).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return (
    <span className="ct-updated">
      Updated {formatted}
    </span>
  );
}
