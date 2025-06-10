import { fetchSimilarProducts } from "@/services/productApi";
import ProductCard from "./productCard";

type Props = {
  productId: string;
};

export default async function SimilarProducts({ productId }: Props) {
  const products = await fetchSimilarProducts(productId);

  if (!products || products.length === 0) return null;

  return (
    <section className="mt-8">
      <h3 className="text-lg font-semibold mb-3">Similar Products</h3>
      <div className="w-full overflow-x-auto">
        <div className="flex gap-4 h-[30svw] lg:h-[22svw] p-2 border rounded-md bg-white shadow-sm">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
