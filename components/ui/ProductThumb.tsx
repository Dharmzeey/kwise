import Icon from "./Icon";
import type { ProductTint } from "@/lib/types";

interface ThumbProps {
  thumb: string;
  tint: ProductTint;
  name?: string;
  size?: "card" | "lg" | "hero" | "fill";
}

const ICON_SIZE: Record<string, number> = { hero: 120, lg: 96, card: 64, fill: 120 };
const HEIGHT: Record<string, string | number> = { hero: 260, lg: 200, card: "100%", fill: "100%" };

export default function ProductThumb({ thumb, tint, name, size = "card" }: ThumbProps) {
  const iconSize = ICON_SIZE[size] ?? 64;
  return (
    <div
      className={`thumb thumb-${tint}`}
      role="img"
      aria-label={name ? `${name} photo placeholder` : "Product photo"}
      style={{ height: HEIGHT[size] ?? "100%" }}
    >
      <div className="thumb-glow" />
      <Icon name={thumb} size={iconSize} stroke={1.2} className="thumb-icon" />
      <span className="thumb-tag">Product photo</span>
    </div>
  );
}
