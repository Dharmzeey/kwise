import { numberWithCommas } from "@/utils/filter";
import { Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { fetchProductById } from "@/services/productApi";
import IncreamentDecreamentCheck from "@/components/interractivity/cartModification";
import { Metadata } from "next";
import ProductNotFound from "@/components/products/productNotFound";
import ImageComponent from "@/components/interractivity/image";
import SimilarProducts from "@/components/products/similarProducts";
import RecentlyViewed from "@/components/products/recentlyViewed";

type Props = {
  params: {
    productId: string;
  };
};

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const product = await fetchProductById(params.productId);
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
  const product = await fetchProductById(params.productId);
  if (product != undefined) {
    console.log(params.productId);
  }
  return (
    <>
      {product != undefined ? (
        <>
          <section className="">
            <div className="w-[20.5rem] h-[14.5rem] relative mb-2">
              <ImageComponent src={product.image} alt={product.name} />
            </div>
            <div className="flex justify-between">
              <div className="flex gap-3">
                <div
                  className={`${
                    product.utilizationStatus == "Brand New"
                      ? "brand-new"
                      : "uk-used"
                  } text-white px-2 p-1 rounded-sm`}
                >
                  {product.utilizationStatus}
                </div>
                <div
                  className={`${
                    product.availabilityStatus == "In Stock"
                      ? "in-stock"
                      : "out-of-stock"
                  } text-white px-2 p-1 rounded-sm`}
                >
                  {product.availabilityStatus}
                </div>
              </div>
              <div>
                <FontAwesomeIcon icon={faHeart} className="text-2xl " />
              </div>
            </div>
            <div className="py-3">{product.name}</div>
            <div className="font-bold">₦{numberWithCommas(product.price)}</div>
            <div className="pb-3">Description</div>
            <p>{product.description}</p>
            {/* Add to cart */}
            {/* client component */}
            <IncreamentDecreamentCheck product={product} />
          </section>

          {/* similar produtcts */}
          <SimilarProducts productId={params.productId} />

          {/* Recently viewed */}
          <RecentlyViewed productId={params.productId} />
        </>
      ) : (
        <ProductNotFound />
      )}
      <ToastContainer
        limit={1}
        autoClose={2000}
        transition={Slide}
        closeOnClick
      />
    </>
  );
}
