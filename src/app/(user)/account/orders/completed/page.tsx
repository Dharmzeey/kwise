import { CompletedOrderCard, EmptyOrder } from "@/components/user/orderComponent";
import { completedOrdersApi } from "@/services/userApis"
import { CompletedOrderData } from "@/types/userInterfaces";
import { redirect } from "next/navigation";

export default async function CompletedOrders() {
    const response = await completedOrdersApi();

    if (response.status === 401) {
        // Redirect to login if unauthorized
        redirect("/login?callbackUrl=/account/orders/completed");
    }

    const orders: CompletedOrderData[] = response.data
    return (
        <>
            {
                orders != undefined && orders.length >= 1 ? (
                    orders.map((order) => <CompletedOrderCard key={order.id} order={order} />)
                )
                    :
                    <EmptyOrder />
            }

        </>
    )
}