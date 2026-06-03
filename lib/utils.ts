/**
 * Kwise World — utility helpers.
 */

/** Format a number as Nigerian Naira (₦). */
export function formatNaira(amount: number): string {
  return "₦" + amount.toLocaleString("en-NG");
}

/** Clamp a value between min and max. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Compute cart delivery fee based on subtotal. */
export function deliveryFee(subtotal: number): number {
  return subtotal === 0 ? 0 : subtotal >= 500_000 ? 0 : 5_000;
}

/** Simple class-name joiner (no deps). */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

/** Format a date string to a human-friendly relative label. */
export function relativeDate(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  return `${Math.floor(days / 365)} years ago`;
}
