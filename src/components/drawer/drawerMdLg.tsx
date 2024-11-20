'use client'
import { faBagShopping, faCaretDown, faCaretUp, faHeart, faUser } from "@fortawesome/free-solid-svg-icons";
import DrawerItem from "./drawerItems";
import Link from "next/link";
import { logout } from "@/services/authApis";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuthContext } from "@/contexts/authContext";


export default function DrawerMediumLargeScreen() {
    const user = useAuthContext();
    const pathName = usePathname()
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