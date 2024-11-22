import { EmptyWishlist, WishlistCard } from "@/components/user/wishlistComponent";
import { listWishlist } from "@/services/userApis"
import { WishlistData } from "@/types/userInterfaces";
import { redirect } from "next/navigation";
import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default async function Wishlist() {
    const response = await listWishlist();

    if (response.status === 401) {
        // Redirect to login if unauthorized
        redirect("/login?callbackUrl=/account/wishlist");
    }
    const wishlists: WishlistData[] = response.data
    return (
        <>
            {
                wishlists != undefined && wishlists.length >= 1 ? (
                    wishlists.map((wishlist) => <WishlistCard key={wishlist.product.id} wishlist={wishlist.product} />
                    )) :
                    <EmptyWishlist />
            }
            <ToastContainer
                limit={5}
                autoClose={2000}
                transition={Slide}
                closeOnClick
            />
        </>
    )
}