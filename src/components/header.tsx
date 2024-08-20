import Image from "next/image";
import Link from "next/link";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faBars } from "@fortawesome/free-solid-svg-icons";

export default function Header() {
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
        <div className="flex gap-5">
          <Link href="/cart">
            <FontAwesomeIcon icon={faCartShopping} className="text-xl " />
          </Link>
          <Link href="/">
            <FontAwesomeIcon icon={faBars} className="text-xl" />
          </Link>

        </div>
      </div>
    </header>
  )
}