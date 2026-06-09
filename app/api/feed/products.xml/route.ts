import { fetchProducts } from "@/lib/api";
import type { ProductListItem } from "@/lib/types";

const BASE = "https://kwiseworld.com";

async function fetchAllProducts(): Promise<ProductListItem[]> {
  const all: ProductListItem[] = [];
  let page = 1;
  while (true) {
    const data = await fetchProducts({ page }).catch(() => null);
    if (!data) break;
    all.push(...data.results);
    if (!data.next) break;
    page++;
  }
  return all;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const products = await fetchAllProducts();

  const items = products
    .filter((p) => !p.sold_out)
    .map((p) => {
      const condition = p.status === "Brand New" ? "new" : "used";
      const image = p.image ? escapeXml(p.image) : "";
      return `  <item>
    <g:id>${escapeXml(p.id)}</g:id>
    <g:title>${escapeXml(p.name)}</g:title>
    <g:link>${BASE}/product/${escapeXml(p.id)}</g:link>
    <g:image_link>${image}</g:image_link>
    <g:availability>in stock</g:availability>
    <g:price>${p.price.toFixed(2)} NGN</g:price>
    <g:brand>${escapeXml(p.brand_slug)}</g:brand>
    <g:condition>${condition}</g:condition>
    <g:product_type>${escapeXml(p.category_slug)}</g:product_type>
  </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
<channel>
  <title>Kwise World Products</title>
  <link>${BASE}</link>
  <description>Tested and verified gadgets from Kwise World Nigeria</description>
${items}
</channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
