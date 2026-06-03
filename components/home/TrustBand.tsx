import Icon from "@/components/ui/Icon";

const ITEMS = [
  { icon: "shieldCheck", title: "Tested & verified",    desc: "Every device checked before it ships." },
  { icon: "truck",       title: "Nationwide delivery",  desc: "Based in Ibadan, we ship to all 36 states." },
  { icon: "refresh",     title: "7-day returns",        desc: "Not as described? Send it back." },
  { icon: "whatsapp",    title: "Real human support",   desc: "Chat with us before and after you buy." },
];

export default function TrustBand() {
  return (
    <section className="section">
      <div className="container trust-grid">
        {ITEMS.map((item) => (
          <div className="trust-item" key={item.title}>
            <span className="trust-ic"><Icon name={item.icon} size={22} /></span>
            <div>
              <strong>{item.title}</strong>
              <p>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
