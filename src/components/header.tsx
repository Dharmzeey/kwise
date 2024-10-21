'use client';

import Image from "next/image";
import Link from "next/link";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faBars, faX } from "@fortawesome/free-solid-svg-icons";
import Drawer from "./drawer";
import { useState } from "react";

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const toggleMenu = () => {
        setMenuOpen(!menuOpen)
    }
    return (
        <header className="p-4 pb-0">
            <div className="flex justify-between items-center">
                <Link href="/" aria-label="kwise home" >
                    <Image
                        src="/logo.jpg"
                        alt="kwise"
                        width={75}
                        height={35}
                    />
                </Link>
                <div className="relative">
                    <Link href="/cart" className="mr-12">
                        <div className="w-4 h-4 absolute bottom-4 left-3 text-center px-1 border border-gray-200 bg-main-color text-white rounded-full">2</div>
                        <FontAwesomeIcon icon={faCartShopping} className="text-xl " />
                    </Link>
                        <button onClick={toggleMenu} className="absolute z-50 right-2">
                            <FontAwesomeIcon icon={menuOpen ? faX : faBars} className="text-xl" />
                        </button>
                    { menuOpen && <Drawer />}

                </div>
            </div>
        </header>
    )
}