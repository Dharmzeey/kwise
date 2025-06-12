import { CompletedOrderData, PendingOrderData } from "@/types/userInterfaces";
import { ActionLink } from "../actionComponents";
import ImageComponent from "../interractivity/image";
import { numberWithCommas } from "@/utils/filter";

type PendingOrder = {
    order: PendingOrderData
}

type CompletedOrder = {
    order: CompletedOrderData
}

function PendingOrderCard({ order }: PendingOrder) {
    return (
        <div className="rounded-md shadow-sm border border-gray-200 mb-4 overflow-hidden bg-white hover:shadow-md transition">
            <div className="grid md:grid-cols-3 gap-3 p-4">
                {/* Product Image */}
                <div className="relative w-full h-40">
                    <ImageComponent src={order.product_image} alt={order.product_name} />
                </div>

                {/* Product and Order Info */}
                <div className="flex flex-col gap-2 justify-between">
                    <div>
                        <h2 className="text-base font-semibold text-gray-800 line-clamp-4">{order.product_name}</h2>
                        <div className="text-main-color font-medium">₦{numberWithCommas(order.price)}</div>
                    </div>
                    <div className="text-sm text-gray-600 flex flex-col gap-1">
                        <div>Order No: {order.order_no}</div>
                        <div>Quantity: x{order.quantity}</div>
                        <div className="mt-2">
                            <span className={`text-xs px-2 py-1 rounded-sm text-white ${order.shipped ? "bg-green-600" : "bg-yellow-500"}`}>
                                {order.shipped ? "Shipped" : "Shipping"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Delivery Info */}
                <div className="text-sm text-gray-700 leading-6">
                    <h3 className="font-semibold mb-1">Delivery Information</h3>
                    <p>Address: {order.address}</p>
                    <div>Phone: {order.phone_number}</div>
                    <div>Estimated delivery: {order.estimated_delivery_date}</div>
                </div>
            </div>
        </div>
    );
}
  


function CompletedOrderCard({ order }: CompletedOrder) {
    return (
        <div className="rounded-md shadow-sm border border-gray-200 mb-4 overflow-hidden bg-white hover:shadow-md transition">
            <div className="grid md:grid-cols-3 gap-4 p-4">
                {/* Product Image */}
                <div className="relative w-full h-40">
                    <ImageComponent src={order.product_image} alt={order.product_name} />
                </div>

                {/* Product and Order Info */}
                <div className="flex flex-col gap-2 justify-between">
                    <div>
                        <h2 className="text-base font-semibold text-gray-800 line-clamp-4">{order.product_name}</h2>
                        <div className="text-main-color font-medium">₦{numberWithCommas(order.price)}</div>
                    </div>
                    <div className="text-sm text-gray-600 flex flex-col gap-1">
                        <div>Order No: {order.order_no}</div>
                        <div>Quantity: x{order.quantity}</div>
                        <div>
                            <span className="text-xs px-2 py-1 rounded-sm text-white bg-green-700">Completed</span>
                        </div>
                    </div>
                </div>

                {/* Delivery Info */}
                <div className="text-sm text-gray-700 leading-6">
                    <h3 className="font-semibold mb-1">Delivery Details</h3>
                    <div>Delivered on: {order.delivery_date}</div>
                    <p>Address: {order.address}</p>
                </div>
            </div>
        </div>
    );
}
  

function EmptyOrder() {
    return (
        <>
            <div className="text-center py-10">
                <h2 className="text-2xl font-semibold mb-4">Your Order History is Empty</h2>
                <p className="text-gray-600 mb-6">It looks like you haven&rsquo;t placed any orders yet.</p>
                <div className="flex flex-col justify-center items-center gap-1">
                    <ActionLink buttonBgColor="bg-main-color" linkUrl="/" linkText="Start Shopping Now" />
                </div>
            </div>
        </>
    )
}

export { PendingOrderCard, CompletedOrderCard, EmptyOrder }