import Link from "next/link";
import { numberWithCommas } from "@/utils/filter";
import { Product } from "@/types/productInterfaces";
import ImageComponent from "../interractivity/image";
import slugify from "slugify";
import { motion } from "framer-motion";
import { truncate } from "node:fs/promises";

export default function ProductSearchCategory({
    products,
    gadgetType,
}: {
    products: Product[];
    gadgetType: string;
}) {
    return products.length ? (
        <section className="pb-4">
            {/* Section Title */}
            <div className="flex justify-between items-center mb-5">
                <h2 className="text-xl font-semibold text-gray-800 capitalize">
                    {gadgetType}
                </h2>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {products.map((product, index) => (
                    <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        className="hover:shadow-lg transition-shadow duration-300 group"
                    > 
                        <Link prefetch={true}
                            key={product.id}
                            href={`/products/${product.category}/${slugify(product.name)}-${product.id}`}
                            className="rounded-lg shadow-sm hover:shadow-md transition duration-200 bg-white"
                        >
                            <div className="w-full aspect-[1/1] relative overflow-hidden rounded-t-lg">
                                <ImageComponent src={product.image} alt={product.name} />
                            </div>
                            <div className="p-3">
                                <h3 className="text-sm md:text-base font-medium text-gray-800 group-hover:text-main-color line-clamp-3">
                                    {product.name}
                                </h3>
                                <p className="text-sm font-semibold text-main-color mt-1">
                                    ₦{numberWithCommas(product.price)}
                                </p>
                            </div>
                        </Link>
                    </motion.div>
                   
                ))}
            </div>
        </section>
    ) : null;
}