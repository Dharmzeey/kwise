import Icon from "./Icon";

interface StarsProps {
  value: number;
  size?: number;
  showNum?: boolean;
  count?: number;
}

export default function Stars({ value, size = 14, showNum = false, count }: StarsProps) {
  const num = Number(value) || 0;
  const full = Math.round(num);
  return (
    <span className="stars">
      <span className="stars-row" aria-label={`${value} out of 5`}>
        {[1, 2, 3, 4, 5].map((i) => (
          <Icon key={i} name="star" size={size} stroke={0}
            className={i <= full ? "star on" : "star off"}
            style={{ fill: "currentColor" }} />
        ))}
      </span>
      {showNum && (
        <span className="stars-num">
          {num.toFixed(1)}{count != null ? ` (${count})` : ""}
        </span>
      )}
    </span>
  );
}
