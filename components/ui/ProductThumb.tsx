import Image from "next/image";
import Icon from "./Icon";
import type { ProductTint } from "@/lib/types";

interface ThumbProps {
  image?: string | null;
  thumb: string;
  tint: ProductTint;
  name?: string;
  size?: "card" | "lg" | "hero" | "fill";
}

const ICON_SIZE: Record<string, number> = { hero: 120, lg: 96, card: 64, fill: 120 };
const HEIGHT: Record<string, string | number> = { hero: 260, lg: 200, card: "100%", fill: "100%" };

export default function ProductThumb({ image, thumb, tint, name, size = "card" }: ThumbProps) {
  const iconSize = ICON_SIZE[size] ?? 64;

  if (image) {
    return (
      <div
        className={`thumb thumb-${tint}`}
        style={{ height: HEIGHT[size] ?? "100%" }}
      >
        <Image
          src={image}
          alt={name ?? "Product photo"}
          fill
          sizes="(max-width: 480px) 50vw, (max-width: 900px) 33vw, 25vw"
          style={{ objectFit: "contain", padding: "8px" }}
        />
      </div>
    );
  }

  return (
    <div
      className={`thumb thumb-${tint}`}
      role="img"
      aria-label={name ? `${name} photo` : "Product photo"}
      style={{ height: HEIGHT[size] ?? "100%" }}
    >
      <div className="thumb-glow" />
      <Icon name={thumb} size={iconSize} stroke={1.2} className="thumb-icon" />
    </div>
  );
}
