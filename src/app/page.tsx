import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import ProductCategory from "@/components/productCategory";
import HomeCarousel from "@/components/carouselSlider";
import { useState, useEffect } from "react"
import { Product } from "@/utils/productInterface";
import { fetchAllProducts } from "@/services/productApi";
import HandleProductSearch from "@/components/interractivity/productSearch";


export default async function Home() {
  const products = await fetchAllProducts()
  // const [products, setProducts] = useState<Product[]>([]);

  // useEffect(() => {
  //   async function fetchProduct() {
  //     try {
  //       const res = await fetch('http://localhost:8000/v1/products/');
  //       const products = await res.json();
  //       setProducts(products);
  //       console.log("done sir");
  //     } catch (error) {
  //       console.error("Failed to fetch products:", error);
  //     }
  //   }

  //   fetchProduct();
  // }, []);
  return (
    <main>
      <HandleProductSearch />
      <section className="mt-6 mb-4 flex justify-center">
        <div className="w-72 h-36">
          <HomeCarousel />
        </div>
      </section>
      {/* This is where the category begins */}
      <div className="pb-9">
        <ProductCategory products={
          products.filter((product) => product.category == "Phones").slice(0, 10)
        } gadgetType="Phones" />
      </div>
      <div className="pb-9">
        <ProductCategory products={
          products.filter((product) => product.category == "Laptops").slice(0, 10)
        } gadgetType="Laptops" />
      </div>
      <div className="pb-9">
        <ProductCategory products={
          products.filter((product) => product.category == "Accessories").slice(0, 10)
        } gadgetType="Accessories" />
      </div>
      <div className="pb-9">
        <ProductCategory products={
          products.filter((product) => product.category == "Console").slice(0, 10)
        } gadgetType="Console" />
      </div>
    </main>
  )
}