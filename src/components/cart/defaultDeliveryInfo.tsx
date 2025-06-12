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
    },[prop])
    return (
        <div className="bg-white shadow-md rounded-md p-4 text-sm md:text-base leading-relaxed space-y-3 border border-gray-100">
            <div className="flex justify-between">
                <span className="font-medium text-gray-700">Name:</span>
                <span>{prop.checkoutDetails.name}</span>
            </div>
            <div className="flex justify-between">
                <span className="font-medium text-gray-700">Place:</span>
                <span>{prop.checkoutDetails.place}</span>
            </div>
            <div className="text-justify text-gray-800">
                <span className="font-medium text-gray-700">Address:</span> {prop.checkoutDetails.address}
            </div>
            <div className="flex justify-between">
                <span className="font-medium text-gray-700">Phone Number:</span>
                <span>{prop.checkoutDetails.phone_number}</span>
            </div>
            <div className="flex justify-between">
                <span className="font-medium text-gray-700">Alt. Phone:</span>
                <span>{prop.checkoutDetails.alternative_phone_number}</span>
            </div>
            <div className="flex justify-between items-center text-main-color font-semibold text-base pt-2">
                <span>Delivery Fee:</span>
                <span>₦ {numberWithCommas(prop.checkoutDetails.delivery_fee)}</span>
            </div>
            <div className="text-gray-700 font-medium">
                You will receive your item in <span className="text-main-color">{prop.checkoutDetails.delivery_days} days</span>
            </div>

            {/* Action Button */}
            <div className="flex justify-center pt-4">
                <ActionButton
                    buttonBgColor="bg-main-color"
                    buttonText="PROCEED TO PAYMENT"
                    onClickFn={toPayment}
                />
            </div>
        </div>
      );
}