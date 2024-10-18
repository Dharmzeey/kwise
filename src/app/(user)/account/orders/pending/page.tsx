import { EmptyOrder, PendingOrderCard } from "@/components/user/orderComponent";
import { pendingOrdersApi } from "@/services/userApis"
import { PendingOrderData } from "@/types/userInterfaces";

export default async function PendingOrders() {
    const response = await pendingOrdersApi();
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