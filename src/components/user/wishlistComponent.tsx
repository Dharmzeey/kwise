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


type Wishlist = {
    wishlist: WishlistItem
}


function WishlistCard(prop: Wishlist) {
    const { updateCartCount } = useCartContext();
    const router = useRouter()
    const add = async () => {
        const response = await addToCartApi({ product_id: prop.wishlist.id, action: "update", quantity: 1 })
        if (response.status === 202) {
            await removeWishlist(prop.wishlist.id)
            alert("item added successfully")
            router.push("/cart")
        }
        updateCartCount()
    }

    const remove = async () => {
        const response = await removeWishlist(prop.wishlist.id)
        if (response.status === 204) {
            location.reload()
        }
    }
    return (
        <>
            <div className="shadow shadow-gray-300 pr-3 rounded mb-3">
                <div className="grid grid-cols-[1fr_4fr_1fr] gap-2 mb-1">
                    <div className="relative min-h-[60px] md:min-h-[90px] min-w-[80px] lg:min-w-[110px] lg:min-h-[100px]  w-[13svw]">
                        <Link
                            href={`/products/${prop.wishlist.category}/${prop.wishlist.id}`}
                        >
                            <ImageComponent src={prop.wishlist.image} alt={prop.wishlist.name} />
                        </Link>                        
                    </div>

                    <div className="flex flex-col gap-3 pt-2">
                        <Link
                            href={`/products/${prop.wishlist.category}/${prop.wishlist.id}`}
                        >
                            <h2 className="w-[350px] md:w-[500px] lg:w-[550px] xl:w-[750px] whitespace-nowrap overflow-hidden overflow-ellipsis">{prop.wishlist.name}</h2>
                        </Link>
                        {/* <div className="pt-2 text-xs text-justify">{prop.wishlist.name.substring(0, PRODUCT_NAME_LENGTH)}{prop.wishlist.name.length > PRODUCT_NAME_LENGTH && <>....</>}</div> */}
                        <div className=" rounded md:self-auto w-full">
                            <button className="p-2 bg-main-color w-1/2 text-white text-sm text-bold uppercase rounded" onClick={add}>
                                Add to cart
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 pt-2 pr-8">
                        <div className="self-end">₦{numberWithCommas(prop.wishlist.price)}</div>
                        <button type="button" className="self-end" onClick={remove}>
                            <FontAwesomeIcon
                                icon={faTrash}
                                className="text-main-color text-[18px]"
                            />
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
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