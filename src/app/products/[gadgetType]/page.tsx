'use client';

import ListItems from "@/components/listItem"
import { Brand, Product } from "@/utils/productInterface"
import Link from "next/link"
import { useState } from "react"

export default function DevicePage(
  { params }: {
    params: {
      gadgetType: string,
    }
  }
) {
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  async function fetchBrands() {
    const res = await fetch(`http://localhost:8000/v1/products/brands/?q=${params.gadgetType}`);
    const brands = await res.json()
    setBrands(brands)
  }
  async function fetchProducts()  {
    const res = await fetch(`http://localhost:8000/v1/products/category/${params.gadgetType}`);
    const products = await res.json()
    setProducts(products)
  }
  fetchBrands()
  fetchProducts()
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
