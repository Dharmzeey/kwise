import { Product } from "@/types/productInterfaces";
import Link from "next/link";
import ImageComponent from "../interractivity/image";
import { numberWithCommas } from "@/utils/filter";
import slugify from "slugify";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => (
  <div className="mx-1">
    <Link key={product.id} href={`/products/${product.category}/${slugify(product.name)}-${product.id}`}>
      <div className="h-[55%] relative w-24">
        <ImageComponent src={product.image} alt={product.name} />
      </div>
      <div className="pt-2 text-xs">{product.name}</div>
      <div className=" text-main-color text-xs">
        ₦{numberWithCommas(product.price)}
      </div>
    </Link>
  </div>
);

export default ProductCard;
