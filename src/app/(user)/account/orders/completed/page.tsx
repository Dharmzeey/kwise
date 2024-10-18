import { CompletedOrderCard, EmptyOrder } from "@/components/user/orderComponent";
import { completedOrdersApi } from "@/services/userApis"
import { CompletedOrderData } from "@/types/userInterfaces";

export default async function CompletedOrders() {
    const response = await completedOrdersApi();
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