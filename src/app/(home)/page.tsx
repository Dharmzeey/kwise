"use client";

import { useState, useEffect } from "react";
import ProductCategory from "@/components/products/productCategory";
import HomeCarousel from "@/components/products/homeCarousel";
import { fetchAllProducts } from "@/services/productApi";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadProducts() {
            try {
                const data = await fetchAllProducts();
                setProducts(data);
            } catch (err) {
                console.log(err)
                setError("Failed to load products.");
            } finally {
                setLoading(false);
            }
        }

        loadProducts();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary-color"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-[40vh] p-4 text-center">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Error</h1>
                <p className="text-lg text-gray-600">{error}</p>
            </div>
        );
    }

    const categories = [
        { name: "Phones", color: "from-orange-500 to-red-500" },
        { name: "Laptops", color: "from-blue-500 to-indigo-600" },
        { name: "Accessories", color: "from-purple-500 to-pink-500" },
        { name: "Console", color: "from-green-500 to-teal-500" },
    ];

    return (
        <main className="min-h-screen bg-white">
            {/* Hero Carousel */}
            <section className="relative mt-6 px-4 md:px-0">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-5xl mx-auto rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
                >
                    <HomeCarousel />
                </motion.div>
            </section>

            {/* Categories Section */}
            <section className="px-4 md:px-12 lg:px-24 py-16">
                {products.length > 0 ? (
                    <>
                        {categories.map((category, index) => {
                            const filteredProducts = products
                                .filter((product) => product.category === category.name)
                                .slice(0, 10);

                            if (filteredProducts.length === 0) return null;

                            return (
                                <motion.section
                                    key={category.name}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1, duration: 0.5 }}
                                    className="mb-16"
                                >
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className={`text-2xl md:text-3xl font-semibold text-gray-800 capitalize relative group`}>
                                            <span className={`absolute -left-6 top-1/2 transform -translate-y-1/2 h-6 w-1 bg-gradient-to-r ${category.color}`}></span>
                                            Top {category.name}
                                        </h2>
                                        <Link href={`/products/${category.name}`} className="text-sm font-medium text-secondary-color hover:underline">
                                            View All →
                                        </Link>
                                    </div>
                                    <ProductCategory products={filteredProducts} gadgetType={category.name} />
                                </motion.section>
                            );
                        })}
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-[40vh] p-4 text-center">
                        <h1 className="text-2xl font-bold text-gray-800 mb-4">No Products Found</h1>
                        <p className="text-lg text-gray-600">Currently, there are no products available.</p>
                    </div>
                )}
            </section>
        </main>
    );
}