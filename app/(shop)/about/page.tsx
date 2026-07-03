import type { Metadata } from "next";
import Icon from "@/components/ui/Icon";
import Btn from "@/components/ui/Btn";
import TrustBand from "@/components/home/TrustBand";

export const metadata: Metadata = {
  title: "About Kwise World",
  description: "We sell non-refurbished, mostly Canadian-spec phones and gadgets. Honestly graded, fairly priced — because the shortcuts everyone else takes shouldn't be normal.",
  alternates: { canonical: "https://kwiseworld.com/about" },
  openGraph: {
    title: "About Kwise World — Canadian-Spec Gadgets, Nigerian Prices",
    description: "In a market flooded with refurbished phones, Kwise World holds the line — non-refurbished Canadian-spec devices, graded honestly, priced fairly.",
    url: "https://kwiseworld.com/about",
    type: "website",
    images: [{ url: "https://kwiseworld.com/og.png", width: 1200, height: 630, alt: "About Kwise World" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Kwise World — Canadian-Spec Gadgets, Nigerian Prices",
    description: "In a market flooded with refurbished phones, Kwise World holds the line — non-refurbished Canadian-spec devices, graded honestly, priced fairly.",
    images: ["https://kwiseworld.com/og.png"],
  },
};

const VALUES = [
  {
    icon: "shieldCheck",
    title: "Not refurbished",
    desc: "We don't source phones that have been opened, repaired, and repackaged to look new. Where any work has been done on a unit, only quality original parts are used — no cheap replacements, no fakes.",
  },
  {
    icon: "truck",
    title: "Mostly Canadian spec",
    desc: "Canadian-spec phones work fully in Nigeria — every feature, every network, no restrictions. You're not getting a region-locked unit or a crippled variant.",
  },
  {
    icon: "bolt",
    title: "We tell you what it is",
    desc: "Foreign Used means it was used abroad. Nigeria-Used means it was used here. If the battery is at 89%, that's on the listing. We don't hide things.",
  },
  {
    icon: "refresh",
    title: "14-day returns",
    desc: "If what arrives is different from what we listed — wrong grade, or anything off — bring it back within 14 days and we'll sort it. We always try to match your colour preference; when the exact shade isn't in stock, we ship the closest available option.",
  },
  {
    icon: "shieldCheck",
    title: "Warranty included",
    desc: "UK-used devices come with a 2-week warranty. Brand-new devices come with 1 month. Both cover hardware faults — not customer-caused damage.",
  },
];

export default function AboutPage() {
  return (
    <div className="page">
      {/* ── Hero ── */}
      <section className="about-hero">
        <div className="container about-hero-in">
          <h1>
            We got tired of the shortcuts everyone else was taking.
          </h1>
          <p>
            If you&apos;ve bought a phone in Nigeria before, there&apos;s a good chance you&apos;ve
            been burned. Refurbished units sold as foreign used. Replaced screens that
            crack in three months. Battery health nobody mentioned until you noticed it yourself.
            It&apos;s become normal — and we don&apos;t think it should be.
          </p>
          <p>
            So we made one decision and stuck with it: only source what we can stand behind.
            Almost everything we sell is non-refurbished and Canadian-spec. We grade it
            honestly and price it for what it actually is.
          </p>
        </div>
      </section>

      <div className="container">
        {/* ── Stats ── */}
        <div className="about-stats">
          <div><strong>8,000+</strong><span>Devices delivered</span></div>
          <div><strong>4.8★</strong><span>Average rating</span></div>
          <div><strong>36</strong><span>States reached</span></div>
          <div><strong>14-day</strong><span>Returns, no drama</span></div>
        </div>

        {/* ── Trust ── */}
        <TrustBand />

        {/* ── Values ── */}
        <section className="section">
          <div className="sec-head">
            <h2>What makes us different</h2>
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
              <h2>Not sure what to get?</h2>
              <p>Send us a message on WhatsApp. We&apos;ll help you figure out what actually makes sense for your budget.</p>
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
