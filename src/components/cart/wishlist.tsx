'use client';

import { addWishlist, removeWishlist } from "@/services/userApis";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

type WishListProp = {
    userWishlist: boolean;
    product_id: string
}

export default function Wishlist(prop: WishListProp) {
    const pathName = usePathname();
    const router = useRouter();
    const [isWishlisted, setIsWishlisted] = useState<boolean>(prop.userWishlist);

    const handleWishlist = async () => {
        if (!isWishlisted) {
            const response = await addWishlist(prop.product_id);
            if (response.status === 201) {
                toast.success("Product added to Wishlist", {
                    position: "top-center",
                    className: "my-toast",
                });
                setIsWishlisted(!isWishlisted)
            } else if (response.status === 401) {
                router.push(`/login?callbackUrl=${encodeURIComponent(pathName!)}`);
            }
        } else {
            const response = await removeWishlist(prop.product_id);
            if (response.status === 204) {
                toast.error("Product removed from Wishlist", {
                    position: "top-center",
                    className: "my-toast",
                });
                setIsWishlisted(!isWishlisted)
            } else if (response.status === 401) {
                router.push(`/login?callbackUrl=${encodeURIComponent(pathName!)}`);
            }
        }
    }

    return (
        <>
            <button onClick={handleWishlist}>
                <FontAwesomeIcon icon={faHeart} className={`text-2xl md:pr-3 ${isWishlisted ? 'text-main-color':'text-gray-500'}`} />
            </button>
        </>
    )
}