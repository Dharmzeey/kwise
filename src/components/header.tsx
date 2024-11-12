'use client';

import Image from "next/image";
import Link from "next/link";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faBars, faX } from "@fortawesome/free-solid-svg-icons";
import Drawer from "./drawer/drawer";
import { Suspense, useEffect, useState } from "react";
import { useCartContext } from "@/contexts/cartContext";
import HandleProductSearch from "./interractivity/productSearch";
import DrawerMediumLargeScreen from "./drawer/drawerMdLg";
import { usePathname } from "next/navigation";


export default function Header() {
    const pathName = usePathname()
    const [menuOpen, setMenuOpen] = useState(false);
    const { cartCount } = useCartContext();
    const toggleMenu = () => {
        setMenuOpen(!menuOpen)
    }
    useEffect(() => {
        // closes the drawer when the route changes
        setMenuOpen(false)
    }, [pathName])
    return (
        <header className="container m-auto p-4 pb-0">
            <div className="flex justify-between items-center">
                <Link href="/" aria-label="kwise home" className="-mt-2">
                    <Image
                        src="/logo.jpg"
                        alt="kwise"
                        width={75}
                        height={35}
                    />
                </Link>
                <HandleProductSearch />

                <div className="hidden gap-3 md:flex lg:gap-20">
                    {/* This below will be hidden in small screen */}
                    <Suspense fallback={<>ldkhkjwebkjeb n</>}>
                        <DrawerMediumLargeScreen />
                    </Suspense>
                    <div className="relative">
                        <Link href="/cart" className="">
                            {
                                cartCount > 0 && <div className="w-5 h-5  md:h-6 md:w-6 pt-[2px] absolute bottom-4 left-3 border border-gray-200 bg-main-color text-white rounded-full">
                                    <div className="flex justify-center items-center">
                                        <span>{cartCount}</span>
                                    </div>
                                </div>
                            }
                            <div className="flex gap-2">
                                <FontAwesomeIcon icon={faCartShopping} className="text-xl" />
                                <span>Your cart</span>
                            </div>
                        </Link>
                    </div>
                </div>



                <div className="relative md:hidden">
                    {/* This below will be hidden in medium screen */}
                    <Link href="/cart" className="mr-12">
                        {
                            cartCount > 0 && <div className="w-5 h-5  md:h-6 md:w-6 pt-[2px] absolute bottom-4 left-3 border border-gray-200 bg-main-color text-white rounded-full">
                                <div className="flex justify-center items-center">
                                    <span>{cartCount}</span>
                                </div>
                            </div>
                        }
                        <FontAwesomeIcon icon={faCartShopping} className="text-xl" />
                    </Link>
                    <button onClick={toggleMenu} className="absolute z-50 right-2">
                        <FontAwesomeIcon icon={menuOpen ? faX : faBars} className="text-xl" />
                    </button>
                    {menuOpen && <Drawer />}

                </div>
            </div>
        </header>
    )
}
