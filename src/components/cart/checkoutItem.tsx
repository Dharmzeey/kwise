import { CheckoutItemsData } from "@/types/cartInterfaces";
import { numberWithCommas } from "@/utils/filter";

export default function CheckoutItem({
    cartItem: checkoutitem,
}: {
    cartItem: CheckoutItemsData;
}) {
    return (
        <div className="border-b border-gray-200 py-3 flex items-start justify-between text-sm md:text-base">
            {/* Left - Product Name */}
            <div className="text-gray-800 w-2/3 font-medium text-justify line-clamp-5">
                {checkoutitem.cart_item_name}
            </div>

            {/* Right - Quantity and Price */}
            <div className="text-right space-y-1">
                <div className="text-gray-600">(x{checkoutitem.cart_item_quantity})</div>
                <div className="text-main-color font-semibold">
                    ₦ {numberWithCommas(checkoutitem.cart_item_price)}
                </div>
            </div>
        </div>
    );
}
  