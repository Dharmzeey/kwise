"use client";

import Link from "next/link";
import { numberWithCommas } from "@/utils/filter";
import { Product } from "@/types/productInterfaces";
import ImageComponent from "../interractivity/image";
import slugify from "slugify";
import { motion } from "framer-motion";

export default function ProductCategory({
    products,
    gadgetType,
}: {
    products: Product[];
    gadgetType: string;
}) {
    return (
        <>
            {products.length >= 1 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {products.map((product, index) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-300 flex flex-col h-full"
                        >
                            <Link prefetch href={`/products/${product.category}/${slugify(product.name)}-${product.id}`} className="group">
                                {/* Image Section */}
                                <div className="relative w-full h-40 md:h-48 bg-gray-100 overflow-hidden flex-shrink-0">
                                    <ImageComponent
                                        src={product.image}
                                        alt={product.name}
                                        // className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                                    />
                                    {/* Optional Badge */}
                                    {/* {product.isNew && (
                                        <span className="absolute top-2 left-2 bg-main-color text-white text-xs font-bold px-2 py-1 rounded-md">
                                            New
                                        </span>
                                    )} */}
                                </div>

                                {/* Product Info */}
                                <div className="p-3 flex flex-col flex-grow">
                                    <h3 className="text-sm md:text-base line-clamp-2 font-medium text-gray-800 mb-1 min-h-[2.5rem]">
                                        {product.name}
                                    </h3>
                                    <div className="mt-auto">
                                        <p className="text-main-color font-semibold">₦{numberWithCommas(product.price)}</p>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            )}
        </>
    );
}