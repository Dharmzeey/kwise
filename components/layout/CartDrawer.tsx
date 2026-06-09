"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Icon from "@/components/ui/Icon";
import Btn from "@/components/ui/Btn";
import ProductThumb from "@/components/ui/ProductThumb";
import StatusPill from "@/components/ui/StatusPill";
import { useCart } from "@/context/CartContext";
import { formatNaira } from "@/lib/utils";
interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const router = useRouter();
  const { items, updateQty, removeItem } = useCart();

  const lines = items;
  const subtotal = lines.reduce((s, l) => s + l.product.price * l.qty, 0);

  function goTo(path: string) {
    onClose();
    router.push(path);
  }

  return (
    <div className={`drawer${open ? " open" : ""}`} aria-modal={open} role="dialog" aria-label="Shopping cart">
      <div className="drawer-scrim" onClick={onClose} />
      <aside className="drawer-panel">
        <div className="drawer-head">
          <h3>
            <Icon name="cart" size={20} /> Your cart{" "}
            <span className="drawer-count">{lines.reduce((s, l) => s + l.qty, 0)}</span>
          </h3>
          <button className="iconbtn" onClick={onClose} aria-label="Close cart">
            <Icon name="close" />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="drawer-empty">
            <Icon name="cart" size={48} stroke={1.2} />
            <p>Your cart is empty.</p>
            <Btn kind="primary" onClick={() => goTo("/category/all")}>Start shopping</Btn>
          </div>
        ) : (
          <>
            <div className="drawer-lines">
              {lines.map((l) => (
                <div className="cart-line" key={l.id}>
                  <button
                    className="cart-line-media"
                    onClick={() => goTo(`/product/${l.id}`)}
                    aria-label={`View ${l.product.name}`}
                  >
                    <ProductThumb thumb={l.product.thumb} tint={l.product.tint} name={l.product.name} />
                  </button>
                  <div className="cart-line-info">
                    <div className="cart-line-top">
                      <strong onClick={() => goTo(`/product/${l.id}`)}>{l.product.name}</strong>
                      <button className="iconbtn-sm" onClick={() => removeItem(l.id)} aria-label="Remove item">
                        <Icon name="trash" size={16} />
                      </button>
                    </div>
                    <StatusPill status={l.product.status} />
                    <div className="cart-line-bot">
                      <div className="qty qty-sm">
                        <button onClick={() => updateQty(l.id, l.qty - 1)}><Icon name="minus" size={14} /></button>
                        <span>{l.qty}</span>
                        <button onClick={() => updateQty(l.id, l.qty + 1)} disabled={l.product.is_one_time}>
                          <Icon name="plus" size={14} />
                        </button>
                      </div>
                      <span className="cart-line-price">{formatNaira(l.product.price * l.qty)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="drawer-foot">
              <div className="drawer-sub">
                <span>Subtotal</span>
                <strong>{formatNaira(subtotal)}</strong>
              </div>
              <p className="drawer-note">Delivery calculated at checkout.</p>
              <Btn kind="primary" size="lg" full iconAfter="arrowRight" onClick={() => goTo("/cart")}>
                View cart &amp; checkout
              </Btn>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
