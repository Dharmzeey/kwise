import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

type DrawerItemProp = {
    icon: IconDefinition;
    text: string;
    href: string

}

export default function DrawerItem(drawerItemProp: DrawerItemProp) {
    return (
        <>
            <li className="mb-6">
                <Link href={drawerItemProp.href} className="flex gap-3 p-3">
                    <FontAwesomeIcon icon={drawerItemProp.icon} className="text-lg" />
                    <span>{drawerItemProp.text}</span>
                </Link>
            </li>
        </>
    )
}