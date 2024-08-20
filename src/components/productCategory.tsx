import Link from "next/link";
import Image from "next/image";
import { numberWithCommas } from "@/utils/filter";
import { Product } from "@/utils/productInterface";

export default function ProductCategory(
  { products, gadgetType }:
    {
      products: Product[],
      gadgetType: string,
    }
) {
  return (<>
    <section>
      <div className="flex justify-between mb-2">
        <div>
          {gadgetType}
        </div>
        <Link className="underline text-blue-700" href={`/products/${gadgetType}`} >View all</Link>
      </div>
      <div className="border-2 rounded p-5 grid grid-cols-2 gap-3">
        {
          products.map((product) =>
            <Link key={product.id} href={`/products/${product.category}/${product.id}`}>
              <div>
                <div className="w-full h-32 relative">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="rounded object-cover"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div>{product.name}</div>
                <div className="text-main-color text-sm">₦{numberWithCommas(product.price)}</div>
              </div>
            </Link>
          )
        }
      </div>
    </section>
  </>)
}
