import type { SpecDiffRow, Device } from "@/lib/types";

interface Props {
  deviceA: Device;
  deviceB: Device;
  diff: SpecDiffRow[];
  winnerByCategory?: Record<string, "a" | "b" | "tie">;
}

export default function SpecComparisonTable({ deviceA, deviceB, diff, winnerByCategory = {} }: Props) {
  return (
    <div className="ct-cmp-wrap">
      <table className="ct-cmp-table">
        <thead>
          <tr>
            <th className="ct-cmp-spec-col">Spec</th>
            <th className="ct-cmp-dev-col">{deviceA.brand} {deviceA.model_name}</th>
            <th className="ct-cmp-dev-col">{deviceB.brand} {deviceB.model_name}</th>
          </tr>
        </thead>
        <tbody>
          {diff.map((row) => {
            const label = row.label.toLowerCase().replace(/\s+/g, "_");
            const winner = winnerByCategory[label];
            return (
              <tr key={row.label} className="ct-cmp-row">
                <td className="ct-cmp-label">{row.label}</td>
                <td className={`ct-cmp-val${winner === "a" ? " ct-cmp-winner" : ""}`}>
                  {row.a_value}
                </td>
                <td className={`ct-cmp-val${winner === "b" ? " ct-cmp-winner" : ""}`}>
                  {row.b_value}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
