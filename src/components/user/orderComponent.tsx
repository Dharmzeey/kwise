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

function PendingOrderCard(prop: PendingOrder) {
    return (
        <>
            <div className="shadow shadow-gray-300 pb-2 pr-2 rounded mb-3">
                <div className="grid grid-cols-[1fr_4fr] gap-2 mb-1">
                    <div className="relative row-span-2">
                        <ImageComponent src={prop.order.product_image} alt={prop.order.product_name} />
                    </div>
                    <div className="flex flex-col pt-1 gap-1 px-2">
                        <div className="flex justify-between">
                            <h2>{prop.order.product_name}</h2>
                            <div>₦{numberWithCommas(prop.order.price)}</div>
                        </div>
                        <div className="flex justify-between">
                            <div>Order no: {prop.order.order_no} </div>
                            <div>(x{prop.order.quantity})</div>
                        </div>
                        <div>
                            <div className={` inline ${prop.order.shipped ? "shipped"
                                : "submitted"
                                } text-white px-2 p-1  rounded-sm`} >
                                {
                                    prop.order.shipped ?
                                        <span>Shipped</span> : <span>Shipping</span>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="px-2 pt-1 leading-5 col-span-2 md:col-span-1">
                        <h2>Delivery Information</h2>
                        <div>
                            <p className="text-justify">Address: {prop.order.address}</p>
                            <div>Phone No: {prop.order.phone_number}</div>
                            <div>Estimated delivery date: {prop.order.estimated_delivery_date}</div>
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}


function CompletedOrderCard(prop: CompletedOrder) {
    return (
        <>
            <div className="shadow shadow-gray-300 pb-2 pr-2 rounded mb-3">
                <div className="grid grid-cols-[1fr_4fr] gap-2 mb-1">
                    <div className="relative row-span-2">
                        <ImageComponent src={prop.order.product_image} alt={prop.order.product_name} />
                    </div>
                    <div className="flex flex-col pt-1 px-2 gap-1">
                        <div className="flex justify-between">
                            <h2>{prop.order.product_name}</h2>
                            <div>₦{numberWithCommas(prop.order.price)}</div>
                        </div>
                        <div className="flex justify-between">
                            <div>Order no: {prop.order.order_no} </div>
                            <div>(x{prop.order.quantity})</div>
                        </div>
                        <div>
                            <div>
                                <div className="inline completed text-white px-2 p-1  rounded-sm">
                                    <span>Completed</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="px-2 pt-1 leading-5 col-span-2 md:col-span-1">
                        <div>
                            <div>Delivery date: {prop.order.delivery_date}</div>
                            <p className="text-justify">Address: {prop.order.address}</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
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