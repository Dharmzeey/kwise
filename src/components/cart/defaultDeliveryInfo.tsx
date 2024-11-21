'use client';

import { CheckoutDetails } from "@/types/cartInterfaces";
import { ActionButton } from "../actionComponents";
import { orderAddressSummaryApi } from "@/services/cartApis";
import { useRouter } from "next/navigation";
import { numberWithCommas } from "@/utils/filter";
import { useEffect } from "react";


type DefaultDeliveryProp = {
    checkoutDetails: CheckoutDetails
    updateGrandTotalPrice: (deliveryFee: string) => void
}

export default function DefaultDeliveryInfo(
    prop: DefaultDeliveryProp
) {
    const router = useRouter()
    const toPayment = async () => {
        const response = await orderAddressSummaryApi({ use_default: true })
        if (response.status === 200) {
            router.push('/cart/payment')
        }
    }

    useEffect(() => {
        prop.updateGrandTotalPrice(prop.checkoutDetails.delivery_fee.toString())
    },[])
    return (
        <>
            <div className="leading-6">
                <div>Name: {prop.checkoutDetails.name} </div>
                <div>Place: {prop.checkoutDetails.place} </div>
                <div className="text-justify">Address: {prop.checkoutDetails.address}</div>
                <div>Phone Number: {prop.checkoutDetails.phone_number}</div>
                <div>Alternative Phone Number: {prop.checkoutDetails.alternative_phone_number}</div>
                <div className="text-lg"><b>Delivery Fee: ₦ {numberWithCommas(prop.checkoutDetails.delivery_fee)}</b></div> 
                <div className="text-lg">You will receive your item in {prop.checkoutDetails.delivery_days} days</div> 
                <div className="flex flex-col justify-center items-center gap-1 mb-2">
                    {/* <ActionLink buttonBgColor="bg-main-color" linkText="PROCEED TO SUMMARY" linkUrl="/checkout" /> */}
                    <ActionButton buttonBgColor="bg-main-color" buttonText="PROCEED TO PAYMENT" onClickFn={toPayment} />
                </div>
            </div>
        </>
    )
}