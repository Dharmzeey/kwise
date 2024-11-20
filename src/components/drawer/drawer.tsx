'use client'
import { faBagShopping, faHeart, faUser } from "@fortawesome/free-solid-svg-icons";
import DrawerItem from "./drawerItems";
import Link from "next/link";
import { logout } from "@/services/authApis";
import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
import { useAuthContext } from "@/contexts/authContext";


export default function Drawer() {
    const user = useAuthContext()
    const router = useRouter()
    function handleLogout() {
        logout()
        router.push("/")
    }
    return (
        <>
            <div className="relative">
                <div className="absolute w-[min(60vw,20rem)] bg-white max-h-[50rem] z-10 -right-4 -top-12 p-3  shadow-sm shadow-gray-200">
                    {
                        // this that was passed will return the access token presence
                        user ?
                            <>
                                <ul className="mt-16 leading-5 mb-20">
                                    <DrawerItem key="profile" icon={faUser} href="/account" text="Profile" />
                                    <DrawerItem key="orders" icon={faBagShopping} href="/account/orders" text="Orders" />
                                    <DrawerItem key="wishlist" icon={faHeart} href="/account/wishlist" text="Wishlist" />
                                </ul>
                                <div className="text-center ">
                                    <div onClick={handleLogout} className="font-bold">
                                        LOGOUT
                                    </div>
                                </div>
                            </>
                            :
                            <>
                                <div className="text-center py-20 flex flex-col gap-4">
                                    <Link href="/login" className="font-bold">
                                        LOGIN
                                    </Link>
                                    <Link href="/signup" className="font-bold">
                                        CREATE AN ACCOUNT
                                    </Link>
                                </div>
                            </>
                    }
                </div>
            </div>
        </>
    )
}