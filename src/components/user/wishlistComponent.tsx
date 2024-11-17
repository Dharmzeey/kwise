import { WishlistItem } from "@/types/userInterfaces"
import { numberWithCommas } from "@/utils/filter"
import ImageComponent from "../interractivity/image"
import { ActionLink } from "../actionComponents"


type Wishlist = {
    wishlist: WishlistItem
}


function WishlistCard(prop: Wishlist) {
    return (
        <>
            <div className="shadow shadow-gray-300 pb-2 pr-2 rounded mb-3">
                <div className="grid grid-cols-[1fr_4fr] gap-2 mb-1">
                    <div className="relative row-span-2">
                        <ImageComponent src={prop.wishlist.image} alt={prop.wishlist.name} />
                    </div>
                    <div className="flex flex-col pt-1 px-2 gap-1">
                        <div className="flex justify-between">
                            <h2>{prop.wishlist.name}</h2>
                            <div>₦{numberWithCommas(prop.wishlist.price)}</div>
                        </div>
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