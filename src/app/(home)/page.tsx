import ProductCategory from "@/components/products/productCategory";
import HomeCarousel from "@/components/carouselSlider";
import { fetchAllProducts } from "@/services/productApi";
import HandleProductSearch from "@/components/interractivity/productSearch";

export default async function Home() {
  const products = await fetchAllProducts();
  return (
    <main>
      <HandleProductSearch />
      <section className="mt-6 mb-4 flex justify-center">
        <div className="w-72 h-36">
          <HomeCarousel />
        </div>
      </section>
      {/* This is where the category begins */}
      {products.length >= 1 ? (
        <>
          <ProductCategory
            products={products
              .filter((product) => product.category == "Phones")
              .slice(0, 10)}
            gadgetType="Phones"
          />
          <ProductCategory
            products={products
              .filter((product) => product.category == "Laptops")
              .slice(0, 10)}
            gadgetType="Laptops"
          />
          <ProductCategory
            products={products
              .filter((product) => product.category == "Accessories")
              .slice(0, 10)}
            gadgetType="Accessories"
          />
          <ProductCategory
            products={products
              .filter((product) => product.category == "Console")
              .slice(0, 10)}
            gadgetType="Console"
          />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-[40vh] p-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            Products Not Found
          </h1>
          <p className="text-lg text-gray-600 mb-6 text-center">
            Unable to fetch products
          </p>
        </div>
      )}
    </main>
  );
}
