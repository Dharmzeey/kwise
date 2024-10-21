import { CheckoutItemsData } from "@/types/cartInterfaces";
import { numberWithCommas } from "@/utils/filter";

export default function CheckoutItem({
    cartItem: checkoutitem,
}: {
    cartItem: CheckoutItemsData;
}) {
    return (
        <>
            <div className="grid grid-cols-[2fr_1fr] gap-2">
                <div>{checkoutitem.cart_item_name}</div>
                <div className="flex gap-2">
                    <div>(x{checkoutitem.cart_item_quantity})</div>
                    <div className="">₦ {numberWithCommas(checkoutitem.cart_item_price)}</div>
                </div>
            </div>
        </>
    )
}