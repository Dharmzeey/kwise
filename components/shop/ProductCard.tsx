"use client";
import { useRouter } from "next/navigation";
import Icon from "@/components/ui/Icon";
import ProductThumb from "@/components/ui/ProductThumb";
import Stars from "@/components/ui/Stars";
import StatusPill from "@/components/ui/StatusPill";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { formatNaira } from "@/lib/utils";
import type { ProductListItem } from "@/lib/types";

interface ProductCardProps {
  product: ProductListItem;
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const { showToast } = useToast();

  function handleAdd() {
    addItem(product);
    showToast(`${product.name} added to cart`);
  }

  return (
    <article className={`pcard${product.is_one_time ? " pcard-ot" : ""}`}>
      <button
        className="pcard-media"
        onClick={() => router.push(`/product/${product.id}`)}
        aria-label={`View ${product.name}`}
      >
        <ProductThumb image={product.image} thumb={product.thumb} tint={product.tint} name={product.name} />
        <div className="pcard-badges">
          {product.is_one_time && (
            <span className="badge badge-ot">
              <Icon name="bolt" size={12} stroke={0} /> One-Time
            </span>
          )}
          {product.badge && !product.is_one_time && (
            <span className="badge badge-feat">{product.badge}</span>
          )}
          {product.save_amount && (
            <span className="badge badge-save">Save {formatNaira(product.save_amount)}</span>
          )}
        </div>
        {product.sold_out && (
          <div className="pcard-sold"><span>Sold Out</span></div>
        )}
      </button>

      <div className="pcard-body">
        <div className="pcard-top">
          <StatusPill status={product.status} />
          <Stars value={product.rating} size={12} />
        </div>

        <h3
          className="pcard-name"
          onClick={() => router.push(`/product/${product.id}`)}
        >
          {product.name}
        </h3>

        <div className="pcard-foot">
          <div className="pcard-price">
            <span className="price-now">{formatNaira(product.price)}</span>
            {product.old_price && (
              <span className="price-old">{formatNaira(product.old_price)}</span>
            )}
          </div>
          <button
            className="btn-add"
            disabled={product.sold_out}
            onClick={handleAdd}
            aria-label={`Add ${product.name} to cart`}
          >
            <Icon name={product.sold_out ? "close" : "plus"} size={18} />
          </button>
        </div>

        {product.is_one_time && product.stock > 0 && (
          <div className="pcard-ot-note">
            <Icon name="bolt" size={12} stroke={0} /> Only 1 available
          </div>
        )}
      </div>
    </article>
  );
}
