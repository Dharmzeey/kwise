'use client';

import { motion } from "framer-motion";
import Link from "next/link";
import ListItems from "@/components/products/listItem";
import slugify from "slugify";
import { Brand, Product } from "@/types/productInterfaces";

type Props = {
    gadgetType: string;
    brands: Brand[];
    products: Product[];
};

export default function ProductClient({ gadgetType, brands, products }: Props) {
    return (
        <>
            <div className="flex gap-7">
                <h1>{gadgetType}</h1>
                <div className="flex gap-4 opacity-70">
                    <Link prefetch href={`/products/${gadgetType}`}>
                        <h2>All</h2>
                    </Link>
                    {brands.map((brand) => (
                        <Link prefetch key={brand.id} href={`/products/${gadgetType}/?brandName=${brand.name}`}>
                            <h2>{brand.name}</h2>
                        </Link>
                    ))}
                </div>
            </div>

            <div className="mt-3 grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 items-stretch">
                {products.map((product, index) => (
                    <motion.section
                        key={product.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1, duration: 0.5, ease: "easeInOut" }}
                        className="mb-16"
                    >
                        <Link
                            prefetch
                            href={`/products/${product.category}/${slugify(product.name)}-${product.id}`}
                            className="hover:scale-[1.01] transition"
                        >
                            <ListItems device={product} />
                        </Link>
                    </motion.section>
                ))}
            </div>
        </>
    );
}
