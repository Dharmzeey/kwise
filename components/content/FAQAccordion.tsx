"use client";

import { useState } from "react";
import type { FAQItem } from "@/lib/types";

export default function FAQAccordion({ faqs }: { faqs: FAQItem[] }) {
  const [open, setOpen] = useState<number | null>(null);

  if (!faqs.length) return null;

  return (
    <section className="ct-faq">
      <h2 className="ct-section-title">Frequently asked questions</h2>
      <div className="ct-faq-list">
        {faqs.map((faq) => (
          <div key={faq.id} className="ct-faq-item">
            <button
              className="ct-faq-q"
              aria-expanded={open === faq.id}
              onClick={() => setOpen(open === faq.id ? null : faq.id)}
            >
              {faq.question}
              <span className="ct-faq-icon">{open === faq.id ? "−" : "+"}</span>
            </button>
            {open === faq.id && (
              <div className="ct-faq-a">{faq.answer}</div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
