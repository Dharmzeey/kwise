import type { Metadata } from "next";
import Icon from "@/components/ui/Icon";
import Btn from "@/components/ui/Btn";
import TrustBand from "@/components/home/TrustBand";

export const metadata: Metadata = {
  title: "About Kwise World — Our Story",
  description: "Kwise World is a Nigerian gadget store built on integrity. Every phone, laptop, and accessory is tested before it ships.",
  alternates: { canonical: "https://kwiseworld.com/about" },
  openGraph: {
    title: "About Kwise World — Our Story",
    description: "Kwise World is a Nigerian gadget store built on integrity. Every phone, laptop, and accessory is tested before it ships.",
    url: "https://kwiseworld.com/about",
    type: "website",
    images: [{ url: "https://kwiseworld.com/og.png", width: 1200, height: 630, alt: "About Kwise World" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Kwise World — Our Story",
    description: "Kwise World is a Nigerian gadget store built on integrity. Every phone, laptop, and accessory is tested before it ships.",
    images: ["https://kwiseworld.com/og.png"],
  },
};

const VALUES = [
  {
    icon: "shieldCheck",
    title: "Honest grading",
    desc: "Brand New, Foreign Used, Nigeria-Used — we label it plainly and disclose every flaw.",
  },
  {
    icon: "bolt",
    title: "Real value",
    desc: "Fair prices on quality tech, plus single-unit deals you won't find twice.",
  },
  {
    icon: "whatsapp",
    title: "Human support",
    desc: "Talk to a real person before and after you buy. We're here for the long run.",
  },
  {
    icon: "refresh",
    title: "Fair returns",
    desc: "If it isn't what we said it was, send it back within 7 days. Simple.",
  },
];

export default function AboutPage() {
  return (
    <div className="page">
      {/* ── Hero ── */}
      <section className="about-hero">
        <div className="container about-hero-in">
          <h1>
            Integrity — we mean what we say.
          </h1>
          <p>
            Kwise World started on Iwo Road with one rule: describe every device
            honestly, price it fairly, and stand behind it. From sealed flagships to
            carefully-graded used gadgets, what you read is what you get.
          </p>
        </div>
      </section>

      <div className="container">
        {/* ── Stats ── */}
        <div className="about-stats">
          <div><strong>8,000+</strong><span>Devices delivered</span></div>
          <div><strong>4.8★</strong><span>Average rating</span></div>
          <div><strong>36</strong><span>States reached</span></div>
          <div><strong>7-day</strong><span>Returns, no drama</span></div>
        </div>

        {/* ── Trust ── */}
        <TrustBand />

        {/* ── Values ── */}
        <section className="section">
          <div className="sec-head sec-head-center">
            <h2>What we stand for</h2>
          </div>
          <div className="value-grid">
            {VALUES.map((v) => (
              <div className="value-card" key={v.title}>
                <span className="value-ic">
                  <Icon name={v.icon} size={24} />
                </span>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="about-cta">
          <div className="about-cta-in">
            <div>
              <h2>Questions before you buy?</h2>
              <p>Chat with a real person on WhatsApp. We&apos;ll help you pick the right device.</p>
            </div>
            <div className="about-cta-btns">
              <Btn kind="orange" size="lg" href="https://wa.me/2349048807490" icon="whatsapp">
                Chat on WhatsApp
              </Btn>
              <Btn kind="ghost" size="lg" href="/category/all" iconAfter="arrowRight">
                Shop now
              </Btn>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
