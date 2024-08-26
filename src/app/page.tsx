import ProductCategory from "@/components/productCategory";
import HomeCarousel from "@/components/carouselSlider";
import { fetchAllProducts } from "@/services/productApi";
import HandleProductSearch from "@/components/interractivity/productSearch";


export default async function Home() {
	const products = await fetchAllProducts()
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