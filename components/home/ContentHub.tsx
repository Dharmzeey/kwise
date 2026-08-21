import Link from "next/link";
import Icon from "@/components/ui/Icon";

const CARDS = [
  {
    href: "/phones",
    icon: "star" as const,
    title: "Phone Reviews",
    desc: "Full specs, honest verdicts, and current Nigeria prices for every device we stock.",
    cta: "Browse reviews",
    tint: "blue" as const,
  },
  {
    href: "/compare",
    icon: "sliders" as const,
    title: "Compare Devices",
    desc: "Put any two phones or laptops side by side and see exactly where each one wins.",
    cta: "Start comparing",
    tint: "orange" as const,
  },
  {
    href: "/guides",
    icon: "grid" as const,
    title: "Buying Guides",
    desc: "Best picks by use case — camera, student, budget, business — ranked and explained.",
    cta: "Read the guides",
    tint: "blue" as const,
  },
];

export default function ContentHub() {
  return (
    <section className="section content-hub-section">
      <div className="container">
        <div>
          <h2>Not sure what to get? Start here.</h2>
        </div>
        <div className="content-hub-grid">
          {CARDS.map((c) => (
            <Link key={c.href} href={c.href} className={`content-hub-card content-hub-card-${c.tint}`}>
              <span className="content-hub-ic"><Icon name={c.icon} size={22} /></span>
              <h3>{c.title}</h3>
              <p>{c.desc}</p>
              <span className="content-hub-cta">{c.cta} <Icon name="arrowRight" size={15} /></span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
