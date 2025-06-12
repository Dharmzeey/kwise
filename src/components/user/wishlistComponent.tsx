'use client';

import { WishlistItem } from "@/types/userInterfaces"
import { numberWithCommas } from "@/utils/filter"
import ImageComponent from "../interractivity/image"
import { ActionLink } from "../actionComponents"
import { faTrash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { removeWishlist } from "@/services/userApis"
import { useCartContext } from "@/contexts/cartContext";
import { addToCartApi } from "@/services/cartApis";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";


type Wishlist = {
    wishlist: WishlistItem
}


function WishlistCard({ wishlist }: Wishlist) {
    const { updateCartCount } = useCartContext();
    const router = useRouter();

    const add = async () => {
        const response = await addToCartApi({
            product_id: wishlist.id,
            action: "update",
            quantity: 1,
        });
        if (response.status === 202) {
            await removeWishlist(wishlist.id);
            toast.info("Item added to cart", {
                position: "top-center",
                className: "my-toast",
            });
            router.push("/cart");
        }
        updateCartCount();
    };

    const remove = async () => {
        const response = await removeWishlist(wishlist.id);
        if (response.status === 204) location.reload();
    };

    return (
        <div className="flex flex-row items-start md:items-center gap-4 p-4 mb-4 rounded-lg shadow border bg-white">
            {/* Product Image */}
            <Link
                prefetch={true}
                href={`/products/${wishlist.category}/${wishlist.id}`}
                className="min-w-[100px] max-w-[110px] md:max-w-[140px] relative w-full h-32 md:h-40"
            >
                <ImageComponent src={wishlist.image} alt={wishlist.name} />
            </Link>

            {/* Product Info */}
            <div className="flex-1 space-y-2">
                <Link
                    href={`/products/${wishlist.category}/${wishlist.id}`}
                    className="block"
                >
                    <h2 className="text-base md:text-lg font-semibold line-clamp-1">
                        {wishlist.name}
                    </h2>
                </Link>

                <div className="text-sm text-gray-700">
                    <span className="font-semibold">₦{numberWithCommas(wishlist.price)}</span>
                </div>

                <div className="flex gap-2">
                    <button
                        className="px-4 py-2 text-sm rounded bg-main-color text-white hover:bg-opacity-90"
                        onClick={add}
                    >
                        Add to Cart
                    </button>

                    <button
                        type="button"
                        className="p-2 text-red-500 hover:text-red-700"
                        onClick={remove}
                        aria-label="Remove from wishlist"
                    >
                        <FontAwesomeIcon icon={faTrash} />
                    </button>
                </div>
            </div>
        </div>
    );
}
  

function EmptyWishlist() {
    return (
        <>
            <div className="text-center py-10">
                <h2 className="text-2xl font-semibold mb-4">Your no product in your Wishlist</h2>
                <p className="text-gray-600 mb-6">It looks like you haven&rsquo;t selected any item.</p>
                <div className="flex flex-col justify-center items-center gap-1">
                    <ActionLink buttonBgColor="bg-main-color" linkUrl="/" linkText="Start Shopping Now" />
                </div>
            </div>
        </>
    )
}


export { WishlistCard, EmptyWishlist }