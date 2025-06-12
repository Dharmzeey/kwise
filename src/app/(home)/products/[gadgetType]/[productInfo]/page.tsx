// "use client";

import React from "react";
import { numberWithCommas } from "@/utils/filter";
import { fetchProductById } from "@/services/productApi";
import IncreamentDecreamentCheck from "@/components/cart/cartModification";
import ProductNotFound from "@/components/products/productNotFound";
import ImageComponent from "@/components/interractivity/image";
import SimilarProducts from "@/components/products/similarProducts";
import RecentlyViewed from "@/components/products/recentlyViewed";
import Wishlist from "@/components/cart/wishlist";
import { Metadata } from "next";

type Props = {
    params: Promise<{
        productInfo: string;
    }>;
};

export const generateMetadata = async (props: Props): Promise<Metadata> => {
    const params = await props.params;
    const product = await fetchProductById(params.productInfo.slice(-36));// .slice() is to extract the uuid
    if (!product) {
        return {
            title: `Product Not Found | Kwise World`,
            description: `The product you are looking for does not exist or is unavailable.`,
        };
    }

    return {
        title: `${product.name} | Kwise World`,
        description: `${product.description.slice(0, 250)} | Kwise World`,
    };
};

export default async function ProductDetail({ params }: Props) {
    const resolvedParams = await params;
    const productId = resolvedParams.productInfo.slice(-36);
    const product = await fetchProductById(productId);

    if (!product) return <ProductNotFound />;

    return (
        <>
            {/* Product Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr_1fr] gap-8">
                {/* Left Column - Image */}
                <div className="space-y-4">
                    <div className="relative w-full h-[40svw] md:h-[30svw] rounded-xl overflow-hidden shadow-md group">
                        <ImageComponent src={product.image} alt={product.name} />
                    </div>

                    {/* Status Badges */}
                    <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${product.utilizationStatus === "Brand New" ? "bg-blue-600 text-white" : "bg-orange-500 text-white"}`}>
                                {product.utilizationStatus}
                            </span>
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${product.availabilityStatus === "In Stock" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
                                {product.availabilityStatus}
                            </span>
                        </div>
                        <Wishlist product_id={productId} userWishlist={product.user_wishlist} />
                    </div>
                </div>

                {/* Middle Column - Info */}
                <div className="space-y-4">
                    <h1 className="text-xl md:text-2xl font-bold text-gray-800">{product.name}</h1>
                    <p className="text-2xl font-semibold text-secondary-color">₦{numberWithCommas(product.price)}</p>
                    <div className="mt-4">
                        <h2 className="text-lg font-semibold text-gray-700 mb-2">Description</h2>
                        <p className="text-gray-600 leading-relaxed text-justify">{product.description}</p>
                    </div>
                </div>

                {/* Right Column - Cart */}
                <div className="lg:sticky lg:top-24 self-start">
                    <IncreamentDecreamentCheck product={product} />
                </div>
            </div>

            {/* Similar Products Section */}
                <SimilarProducts productId={productId} />

            {/* Recently Viewed Section */}
                <RecentlyViewed productId={productId} />
        </>
    );
}