'use client';

import { ActionLink } from "@/components/actionComponents";
import { useEffect } from "react";

export default function OrderPage() {
    useEffect(() => {
        // if user is not logged in, send then to login
    }, [])

    return (
        <>
            <div className="flex flex-col justify-center items-center gap-1 h-[60vh]">
                <ActionLink linkUrl="/account/orders/pending" linkText="PENDING ORDERS" buttonBgColor="bg-main-color" />
                <ActionLink linkUrl="/account/orders/completed" linkText="COMPLETED ORDERS" buttonBgColor="bg-secondary-color" />
            </div>
        </>
    )
}