import { CheckoutItemsData } from "@/types/cartInterfaces";
import { numberWithCommas } from "@/utils/filter";

export default function CheckoutItem({
    cartItem: checkoutitem,
}: {
    cartItem: CheckoutItemsData;
}) {
    return (
        <>
            <div className="grid grid-cols-[2fr_1fr] gap-3 mt-3">
                <div className="text-justify">{checkoutitem.cart_item_name}</div>
                <div className="flex justify-between gap-2">
                    <b className="pl-[8%]">(x{checkoutitem.cart_item_quantity})</b>
                    <div className="">₦ {numberWithCommas(checkoutitem.cart_item_price)}</div>
                </div>
            </div>
        </>
    )
}