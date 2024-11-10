import { fetchSimilarProducts } from "@/services/productApi";
import ProductCard from "./productCard";

type Props = {
  productId: string;
};

export default async function SimilarProducts({ productId }: Props) {
  const products = await fetchSimilarProducts(productId);
  return (
    <>
      {products.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mt-4">Similar Products</h3>
          <div className="w-full h-[30svw] lg:h-[22svw] border-2 rounded py-2 overflow-x-auto overflow-y-hidden">
            <div className="flex h-full w-full">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
