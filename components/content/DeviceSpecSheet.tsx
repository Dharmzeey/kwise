import type { Device } from "@/lib/types";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <tr className="ct-spec-row">
      <th className="ct-spec-key">{label}</th>
      <td className="ct-spec-val">{value}</td>
    </tr>
  );
}

export default function DeviceSpecSheet({ device }: { device: Device }) {
  return (
    <div className="ct-spec-sheet">
      <table className="ct-spec-table">
        <tbody>
          <Row label="Chipset"      value={device.chipset} />
          <Row label="RAM"          value={device.ram_options.join(", ") || "—"} />
          <Row label="Storage"      value={device.storage_options.join(", ") || "—"} />
          {device.display_specs.size       && <Row label="Display size"   value={device.display_specs.size} />}
          {device.display_specs.type       && <Row label="Display type"   value={device.display_specs.type} />}
          {device.display_specs.refresh_rate && <Row label="Refresh rate" value={device.display_specs.refresh_rate} />}
          {device.battery_capacity_mah      && <Row label="Battery"       value={`${device.battery_capacity_mah} mAh`} />}
          {device.battery_wh                && <Row label="Battery"       value={`${device.battery_wh} Wh`} />}
          {device.price_band_ngn && <Row label="Price (NGN)" value={device.price_band_ngn} />}
          {device.price_band_cad && <Row label="Price (CAD)" value={device.price_band_cad} />}
          {device.conditions_available.length > 0 && (
            <Row label="Available as" value={device.conditions_available.join(", ")} />
          )}
        </tbody>
      </table>

      {(device.pros.length > 0 || device.cons.length > 0) && (
        <div className="ct-pros-cons">
          {device.pros.length > 0 && (
            <div className="ct-pros">
              <h4 className="ct-pros-cons-label">Pros</h4>
              <ul>{device.pros.map((p, i) => <li key={i}>{p}</li>)}</ul>
            </div>
          )}
          {device.cons.length > 0 && (
            <div className="ct-cons">
              <h4 className="ct-pros-cons-label">Cons</h4>
              <ul>{device.cons.map((c, i) => <li key={i}>{c}</li>)}</ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
