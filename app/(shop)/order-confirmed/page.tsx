"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Icon from "@/components/ui/Icon";
import Btn from "@/components/ui/Btn";

function OrderConfirmedInner() {
  const params = useSearchParams();
  const ref = params.get("ref") ?? "—";

  return (
    <div className="page">
      <div className="container">
        <div className="checkout-done">
          <span className="cd-check">
            <Icon name="check" size={40} />
          </span>
          <h1>Order placed!</h1>
          <p>
            Thank you for shopping with Kwise World. A confirmation has been sent and
            we&apos;ll reach out on WhatsApp to arrange delivery.
          </p>
          <div className="cd-ref">
            Order reference <strong>{ref}</strong>
          </div>
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
