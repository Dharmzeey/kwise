import type { ProductStatus } from "@/lib/types";

const MAP: Record<ProductStatus, string> = {
  "Brand New":    "st-new",
  "Foreign Used": "st-uk",
  "Nigeria-Used": "st-ng",
};

export default function StatusPill({ status }: { status: ProductStatus }) {
  return <span className={`status-pill ${MAP[status] ?? "st-new"}`}>{status}</span>;
}
