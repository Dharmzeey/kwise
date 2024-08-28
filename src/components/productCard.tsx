import { Product } from "@/utils/productInterface";
import Link from "next/link";
import ImageComponent from "./interractivity/image";
import { numberWithCommas } from "@/utils/filter";

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => (
    <div className="mx-1 w-40">
        <Link key={product.id} href={`/products/${product.category}/${product.id}`}>
            <div className="h-[70%] relative">
                <ImageComponent
                    src={product.image}
                    alt={product.name}
                />
            </div>
            <div className="pt-2 " >
                {product.name}
            </div>
            <div className=" text-main-color text-xs">₦{numberWithCommas(product.price)}</div>
        </Link>
    </div>
);

export default ProductCard;
