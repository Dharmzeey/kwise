import { Product } from "@/types/productInterfaces";
import Link from "next/link";
import ImageComponent from "../interractivity/image";
import { numberWithCommas } from "@/utils/filter";
import slugify from "slugify";

interface ProductCardProps {
  product: Product;
}

const PRODUCT_NAME_LENGTH = 60;
const ProductCard: React.FC<ProductCardProps> = ({ product }) => (
  <div className="mx-1">
    <Link prefetch={true} key={product.id} href={`/products/${product.category}/${slugify(product.name)}-${product.id}`}>
      <div className="h-[65%] md:h-[75%] relative w-[20svw] lg:w-[15svw]">
        <ImageComponent src={product.image} alt={product.name} />
      </div>
      <div className="pt-2 text-xs text-justify">{product.name.substring(0, PRODUCT_NAME_LENGTH)}{product.name.length > PRODUCT_NAME_LENGTH && <>....</>}</div>
      <div className=" text-main-color text-xs">
        ₦{numberWithCommas(product.price)}
      </div>
    </Link>
  </div>
);

export default ProductCard;
