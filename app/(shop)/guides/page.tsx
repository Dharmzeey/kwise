import type { Metadata } from "next";
import Link from "next/link";
import { fetchGuides } from "@/lib/api";
import type { BuyingGuideListItem } from "@/lib/types";
import LastUpdatedBadge from "@/components/content/LastUpdatedBadge";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Buying Guides — Kwise World",
  description: "Persona-based buying guides to help you pick the right phone or laptop — students, content creators, budget shoppers, and more.",
  alternates: { canonical: "https://kwiseworld.com/guides" },
};

export default async function GuidesIndexPage() {
  const guides = await fetchGuides().catch(() => []);

  const byUseCase = guides.reduce<Record<string, BuyingGuideListItem[]>>((acc, g) => {
    const key = g.use_case_tag.name;
    if (!acc[key]) acc[key] = [];
    acc[key].push(g);
    return acc;
  }, {});

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">Buying guides</h1>
        <p className="ct-index-lead">
          Not sure which device fits your needs? These guides match devices to real use cases.
        </p>

        {guides.length === 0 ? (
          <p className="ct-empty">No buying guides published yet.</p>
        ) : (
          Object.entries(byUseCase).map(([tag, tagGuides]) => (
            <section key={tag} className="ct-guide-group">
              <h2 className="ct-guide-group-title">{tag}</h2>
              <div className="ct-guide-grid">
                {tagGuides.map((g) => (
                  <Link key={g.slug} href={`/guides/${g.slug}`} className="ct-guide-card">
                    <h3 className="ct-guide-card-title">{g.title}</h3>
                    <p className="ct-guide-card-intro">{g.intro}</p>
                    <div className="ct-guide-card-foot">
                      <LastUpdatedBadge isoDate={g.updated_at} />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  );
}
