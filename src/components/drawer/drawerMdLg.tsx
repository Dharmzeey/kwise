'use client'
import { faBagShopping, faCaretDown, faCaretUp, faHeart, faUser } from "@fortawesome/free-solid-svg-icons";
import DrawerItem from "./drawerItems";
import Link from "next/link";
import { logout } from "@/services/authApis";
import { usePathname, useRouter } from "next/navigation";
import { fetchAuthenticatedUser } from "@/utils/cookieUtils";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


export default function DrawerMediumLargeScreen() {

    const pathName = usePathname()
    const [user, setUser] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [caretOpen, setCaretOpen] = useState(false)
    const router = useRouter()
    const toggleCaret = () => {
        setCaretOpen(!caretOpen)
    }
    function handleLogout() {
        logout()
        location.reload()
        router.push("/")
    }
    async function getUser() {
        const authenticatedUser = await fetchAuthenticatedUser()
        setUser(authenticatedUser)
        setIsLoading(false)
    }

    useEffect(() => {
        getUser()
    }, [])

    useEffect(() => {
        setCaretOpen(false)
    }, [pathName])
    return (
        <>
            <div className="relative">
                {
                    // this that was passed will return the access token presence
                    user ?
                        <>
                            <div className="text-center">
                                <button className="flex gap-3" onClick={toggleCaret}>
                                    <FontAwesomeIcon icon={faUser} />
                                    <span>Account</span>
                                    <span >
                                        {
                                            caretOpen ?
                                                <FontAwesomeIcon icon={faCaretUp} />
                                                :
                                                <FontAwesomeIcon icon={faCaretDown} />
                                        }
                                    </span>
                                </button>
                                {
                                    caretOpen && <div className="absolute w-[min(30vw,10rem)] bg-white max-h-[50rem] z-10 p-3 -left-5 shadow-sm shadow-gray-200" >
                                        <ul className="mt-3 leading-5 mb-4">
                                            <DrawerItem key="profile" icon={faUser} href="/account" text="Profile" />
                                            <DrawerItem key="orders" icon={faBagShopping} href="/account/orders" text="Orders" />
                                            <DrawerItem key="wishlist" icon={faHeart} href="/account/wishlist" text="Wishlist" />
                                        </ul>
                                        <button
                                            onClick={handleLogout} className="cursor-pointer" >
                                            LOGOUT
                                        </button>
                                    </div>
                                }
                            </div>
                        </>
                        :
                        isLoading
                            ?
                            <>
                                <div className="flex items-center justify-center h-[4vh] w-6 relative" >
                                    <div className="absolute left-1/2 -translate-x-1/2 opacity-50">
                                    </div>
                                    <div className="animate-spin rounded-full w-3 h-3 border-t-2 border-b-2 border-gray-300"></div>
                                </div>
                            </>
                            :
                            <>
                                <div className="flex gap-2">
                                    <FontAwesomeIcon icon={faUser} />
                                    <div>
                                        <Link href="/login" className="">
                                            Login
                                        </Link>
                                        /
                                        <Link href="/signup" className="">
                                            Register
                                        </Link>
                                    </div>
                                </div>
                            </>
                }
            </div>
        </>
    )
}