import { numberWithCommas } from "@/utils/filter";
import { Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React from "react";
import { fetchProductById } from "@/services/productApi";
import IncreamentDecreamentCheck from "@/components/cart/cartModification";
import { Metadata } from "next";
import ProductNotFound from "@/components/products/productNotFound";
import ImageComponent from "@/components/interractivity/image";
import SimilarProducts from "@/components/products/similarProducts";
import RecentlyViewed from "@/components/products/recentlyViewed";
import Wishlist from "@/components/cart/wishlist";

type Props = {
    params: {
        productInfo: string;
    };
};


export const generateMetadata = async ({
    params,
}: Props): Promise<Metadata> => {
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
    const productId = params.productInfo.slice(-36) // .slice() is to extract the uuid
    const product = await fetchProductById(productId);
    return (
        <>
            {product != undefined ? (
                <>
                    <section className="grid md:grid-cols-2 lg:grid-cols-[2fr_3fr_1fr] gap-4">
                        <div>
                            <div className=" h-[40svw] md:h-[30svw] lg:h-[20svw] relative mb-2">
                                <ImageComponent src={product.image} alt={product.name} />
                            </div>
                            <div className="flex justify-between">
                                <div className="flex gap-3">
                                    <div
                                        className={`${product.utilizationStatus == "Brand New"
                                            ? "brand-new"
                                            : "uk-used"
                                            } text-white px-2 p-1 rounded-sm`}
                                    >
                                        {product.utilizationStatus}
                                    </div>
                                    <div
                                        className={`${product.availabilityStatus == "In Stock"
                                            ? "in-stock"
                                            : "out-of-stock"
                                            } text-white px-2 p-1 rounded-sm`}
                                    >
                                        {product.availabilityStatus}
                                    </div>
                                </div>
                                <div>
                                    <Wishlist product_id={productId} userWishlist={ product.user_wishlist} />
                                </div>
                            </div>
                        </div>
                        <div>
                            <h1 className="py-1 text-xl md:text-2xl">{product.name}</h1>
                            <div className="font-bold text-xl">₦{numberWithCommas(product.price)}</div>
                            <h2 className="pb-1 font-bold">Description</h2>
                            <p className="text-justify leading-6">{product.description}</p>
                        </div>
                        <div>
                            {/* Add to cart */}
                            {/* client component */}
                            <IncreamentDecreamentCheck product={product} />
                        </div>
                    </section>

                    {/* similar produtcts */}
                    <SimilarProducts productId={productId} />

                    {/* Recently viewed */}
                    <RecentlyViewed productId={productId} />
                </>
            ) : (
                <ProductNotFound />
            )}
            <ToastContainer
                limit={5}
                autoClose={2000}
                transition={Slide}
                closeOnClick
            />
        </>
    );
}