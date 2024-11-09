import { EmptyOrder, PendingOrderCard } from "@/components/user/orderComponent";
import { pendingOrdersApi } from "@/services/userApis"
import { PendingOrderData } from "@/types/userInterfaces";
import { redirect } from "next/navigation";

export default async function PendingOrders() {
    const response = await pendingOrdersApi();

    if (response.status === 401) {
        // Redirect to login if unauthorized
        redirect("/login?callbackUrl=/account/orders/pending");
    }
    const orders: PendingOrderData[] = response.data
    return (
        <>
            {
                orders != undefined && orders.length >= 1 ? (
                    orders.map((order) => <PendingOrderCard key={order.id} order={order} />)
                )
                    :
                    <EmptyOrder />
            }

        </>
    )
}