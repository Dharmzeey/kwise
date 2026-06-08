import type {
  DefectType,
  EstimateResponse,
  IphoneModel,
  IphoneSeries,
  StorageVariant,
} from "./types";

// Server components call Django directly (server-to-server).
// Client components call /api/swap/* which Next.js proxies to Django.
const serverBase =
  typeof window === "undefined"
    ? (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000")
    : "";

// In-session cache for GET requests
const _cache = new Map<string, unknown>();

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const isGet = !init?.method || init.method.toUpperCase() === "GET";

  if (isGet && _cache.has(path)) {
    return _cache.get(path) as T;
  }

  const res = await fetch(`${serverBase}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  if (!res.ok) throw new Error(`Swap API ${path} → ${res.status}`);
  const data: T = await res.json();

  if (isGet) _cache.set(path, data);

  return data;
}

export const swapApi = {
  series: (): Promise<IphoneSeries[]> =>
    apiFetch("/api/swap/series/"),

  models: (seriesId: number): Promise<IphoneModel[]> =>
    apiFetch(`/api/swap/models/${seriesId}/`),

  storage: (modelId: number): Promise<StorageVariant[]> =>
    apiFetch(`/api/swap/storage/${modelId}/`),

  defects: (): Promise<DefectType[]> =>
    apiFetch("/api/swap/defects/"),

  estimate: (
    fromStorageId: number,
    toStorageId: number,
    defectIds: number[]
  ): Promise<EstimateResponse> =>
    apiFetch("/api/swap/estimate/", {
      method: "POST",
      body: JSON.stringify({
        from_storage_id: fromStorageId,
        to_storage_id: toStorageId,
        defect_ids: defectIds,
      }),
    }),
};
