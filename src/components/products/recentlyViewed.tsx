"use client";
import ProductCard from "./productCard";
import { Product } from "@/types/productInterfaces";
import { RECENTLY_VIEWED_URL } from "@/utils/urls/productUrls";
import { useEffect, useState } from "react";

type Props = {
    productId: string;
};

export default function RecentlyViewed({ productId }: Props) {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        async function fetchRecentlyViewed() {
            const viewedProducts = localStorage.getItem("recentlyViewed");
            if (viewedProducts) {
                const listViewedProducts: string[] = JSON.parse(viewedProducts);
                const response = await fetch(RECENTLY_VIEWED_URL(listViewedProducts));
                const products: Product[] = await response.json();
                if (!response.ok) {
                    throw new Error("Failed to fetch products");
                }
                setProducts(products);
            }
            return [];
        }
        fetchRecentlyViewed();
    }, []);

    useEffect(() => {
        function addToRecentlyViewed(productId: string) {
            const existingViewed = localStorage.getItem("recentlyViewed");
            let viewedProducts: string[] = existingViewed
                ? JSON.parse(existingViewed)
                : [];
            if (!viewedProducts.includes(productId)) {
                viewedProducts = [productId, ...viewedProducts].slice(0, 10);
            }
            localStorage.setItem("recentlyViewed", JSON.stringify(viewedProducts));
        }
        addToRecentlyViewed(productId);
    }, [productId]);

    return (
        <>
            {products.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold mt-4">
                        Recently Viewed Products
                    </h3>
                    <div className="w-full h-[30svw] lg:h-[20svw] border-2 rounded overflow-x-auto overflow-y-hidden">
                        <div className="flex h-full w-full">
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
