import ListItems from "@/components/listItem"
import { fetchProductBrands, fetchProductsByCategory } from "@/services/productApi";
import Link from "next/link"


export default async function DevicePage(
  { params }: {
    params: {
      gadgetType: string,
    }
  }
) {
  const brands = await fetchProductBrands(params.gadgetType);
  const products = await fetchProductsByCategory(params.gadgetType);
  return (
    <>
      <div className="flex gap-7">
        <h1>{ params.gadgetType }</h1>
        <div className="flex gap-4 opacity-70">
          <h2>All</h2>
          {
            brands.map((brand) =>
              <h2 key={brand.id}> {brand.name}</h2>
            )
          }
          
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3">
        {
          products.map((product) =>
            <Link key={product.id} href={`/products/${product.category}/${product.id}`}>
              <ListItems key={product.id} device={product} />
            </Link>
          )
        }
      </div>
    </>
  )
}
