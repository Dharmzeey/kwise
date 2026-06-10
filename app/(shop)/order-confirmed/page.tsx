"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { fetchOrder } from "@/lib/api";
import type { Order } from "@/lib/types";
import Icon from "@/components/ui/Icon";
import Btn from "@/components/ui/Btn";

function OrderConfirmedInner() {
  const params = useSearchParams();
  const ref = params.get("ref") ?? "";

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [polls, setPolls] = useState(0);

  useEffect(() => {
    if (!ref) { setLoading(false); return; }

    fetchOrder(ref)
      .then((o) => {
        setOrder(o);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [ref, polls]);

  // Poll every 4 seconds while payment is still unpaid (webhook may be in flight)
  useEffect(() => {
    if (!order || order.payment_status === "paid") return;
    const id = setTimeout(() => setPolls((p) => p + 1), 4000);
    return () => clearTimeout(id);
  }, [order, polls]);

  if (loading) {
    return (
      <div className="page">
        <div className="container">
          <div className="checkout-done">
            <div className="cd-spinner" />
            <p>Confirming your payment…</p>
          </div>
        </div>
      </div>
    );
  }

  // Payment confirmed — show timeline
  if (order?.payment_status === "paid") {
    const steps: { key: "confirmed" | "dispatched" | "delivered"; label: string; ts: string | null }[] = [
      { key: "confirmed",  label: "Order confirmed",  ts: order.confirmed_at },
      { key: "dispatched", label: "Dispatched",        ts: order.dispatched_at },
      { key: "delivered",  label: "Delivered",         ts: order.delivered_at },
    ];
    const activeIdx = steps.map((s) => !!s.ts).lastIndexOf(true);

    return (
      <div className="page">
        <div className="container">
          <div className="checkout-done">
            <span className="cd-check cd-check--green">
              <Icon name="check" size={40} />
            </span>
            <h1>Payment confirmed!</h1>
            <p>
              Thank you for shopping with Kwise World. We&apos;ll reach out on
              WhatsApp shortly to arrange delivery.
            </p>
            <div className="cd-ref">
              Order reference <strong>{order.reference}</strong>
            </div>

            <ol className="order-timeline">
              {steps.map((step, i) => (
                <li
                  key={step.key}
                  className={`ot-step${i <= activeIdx ? " ot-step--done" : ""}${i === activeIdx ? " ot-step--current" : ""}`}
                >
                  <span className="ot-dot" />
                  <div className="ot-body">
                    <span className="ot-label">{step.label}</span>
                    {step.ts && (
                      <span className="ot-time">
                        {new Date(step.ts).toLocaleString("en-NG", {
                          day: "numeric", month: "short", year: "numeric",
                          hour: "2-digit", minute: "2-digit",
                        })}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ol>

            <div className="cd-btns">
              <Btn kind="primary" size="lg" href="/" iconAfter="arrowRight">
                Back to home
              </Btn>
              <Btn kind="ghost" size="lg" href="/category/all">
                Keep shopping
              </Btn>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Order created but payment not yet confirmed (webhook pending or user came back early)
  if (order) {
    return (
      <div className="page">
        <div className="container">
          <div className="checkout-done">
            <span className="cd-check cd-check--orange">
              <Icon name="info" size={36} />
            </span>
            <h1>Order received</h1>
            <p>
              Your order has been placed. If you completed payment, confirmation
              will update in a moment. If you didn&apos;t pay yet, you can
              contact us on WhatsApp to complete.
            </p>
            <div className="cd-ref">
              Order reference <strong>{order.reference}</strong>
            </div>
            <div className="cd-btns">
              <Btn kind="orange" size="lg" href="https://wa.me/2349048807490" icon="whatsapp">
                Chat on WhatsApp
              </Btn>
              <Btn kind="ghost" size="lg" href="/">
                Back to home
              </Btn>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Fallback — no ref or order not found
  return (
    <div className="page">
      <div className="container">
        <div className="checkout-done">
          <span className="cd-check">
            <Icon name="check" size={40} />
          </span>
          <h1>Order placed!</h1>
          <p>
            Thank you for shopping with Kwise World. We&apos;ll reach out on
            WhatsApp to arrange delivery.
          </p>
          {ref && (
            <div className="cd-ref">
              Order reference <strong>{ref}</strong>
            </div>
          )}
          <div className="cd-btns">
            <Btn kind="primary" size="lg" href="/" iconAfter="arrowRight">
              Back to home
            </Btn>
            <Btn kind="ghost" size="lg" href="/category/all">
              Keep shopping
            </Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderConfirmedPage() {
  return (
    <Suspense>
      <OrderConfirmedInner />
    </Suspense>
  );
}
