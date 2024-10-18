'use client'
import { faBagShopping, faHeart, faUser, faX } from "@fortawesome/free-solid-svg-icons";
import DrawerItem from "./drawerItems";
import Link from "next/link";
import { logout } from "@/services/authApis";
import { useRouter } from "next/navigation";
import { fetchAuthenticatedUser } from "@/utils/cookieUtils";
import { useEffect, useState } from "react";


export default function Drawer() {
    const [user, setUser] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const router = useRouter()
    function handleLogout() {
        logout()
        router.push("/") // normal js reload
    }
    async function getUser() {
        const authenticatedUser = await fetchAuthenticatedUser()
        setUser(authenticatedUser)
        setIsLoading(false)
    }
    useEffect(() => {
        getUser()
    }, [])
    return (
        <>
            <div className="relative">
                <div className="absolute w-[min(60vw,20rem)] bg-white max-h-[50rem] z-10 -right-4 -top-6 p-3 shadow-sm shadow-gray-200">
                    {
                        // this that was passed will return the string of the user authenticated
                        // drawerProp.getAuthUser ?
                        user ?
                            <>
                                <ul className="mt-10 leading-5 mb-20">
                                    <DrawerItem key="profile" icon={faUser} href="/account" text="Profile" />
                                    <DrawerItem key="orders" icon={faBagShopping} href="/account/orders" text="Orders" />
                                    <DrawerItem key="wishlist" icon={faHeart} href="/" text="Wishlist" />
                                </ul>
                                <div className="text-center ">
                                    <div onClick={handleLogout} className="font-bold">
                                        LOGOUT
                                    </div>
                                </div>
                            </>
                            :
                            isLoading
                                ?
                                <>
                                    <div className="flex items-center justify-center h-[40vh] relative" >
                                        <div className="absolute left-1/2 -translate-x-1/2 opacity-50">
                                        </div>
                                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-300"></div>
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