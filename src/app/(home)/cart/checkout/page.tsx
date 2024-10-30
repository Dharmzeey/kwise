'use client';

import { checkoutDetailsApi, checkoutItemsApi } from "@/services/cartApis";
import { CheckoutDetails, CheckoutItemsData } from "@/types/cartInterfaces";
import { numberWithCommas } from "@/utils/filter";
import { useEffect, useState } from "react"
import Loading from "../../loading";
import CheckoutItem from "@/components/cart/checkoutItem";
import { useRouter } from "next/navigation";
import NewDeliveryInfo from "@/components/cart/newDeliveryInfo";
import DefaultDeliveryInfo from "@/components/cart/defaultDeliveryInfo";
import { resendEmailVerificationApi } from "@/services/authApis";

export default function CheckoutPage() {
    const router = useRouter();
    const [grandTotalPrice, setGrandTotalPrice] = useState<number>();
    const [checkoutData, setCheckoutData] = useState<CheckoutItemsData[]>();
    const [checkoutDetails, setCheckoutDetails] = useState<CheckoutDetails>();
    const [isLoading, setIsLoading] = useState<boolean>(true)

    async function verifyUser() {
        // this will send a code to the user and then they must verify
        await resendEmailVerificationApi()
        router.push("/email-verification/confirm")
    }

    useEffect(() => {
        async function fetchCheckout() {
            const response = await checkoutItemsApi();
            if (response.status === 200) {
                setGrandTotalPrice(response.data.grand_total)
                setCheckoutData(response.data.item_list)
                setIsLoading(false)
            }
        }
        setIsLoading(false)
        fetchCheckout()
    }, [])

    useEffect(() => {
        async function fetchCheckoutDetails() {
            const response = await checkoutDetailsApi();
            if (response.status === 404) {
                alert("You have not filled you Basic / Address information")
                router.push('/account')
                setIsLoading(false)
            } else if (response.status === 403) {
                verifyUser()
            }
            setCheckoutDetails(response.data)
            setIsLoading(false)
        }
        fetchCheckoutDetails()
    }, [])

    return (
        <>
            {
                isLoading ?
                    <Loading />
                    :
                    (
                        <>
                            {grandTotalPrice && grandTotalPrice > 0 ?
                                <>
                                    <h1 className="font-bold mb-2 text-secondary-gray-color">Order Information</h1>
                                    <div className="flex justify-between font-bold mb-2">
                                        <span>Total</span>
                                        <span>₦ {numberWithCommas(grandTotalPrice)}</span>
                                    </div>
                                </>
                                :
                                <></> // added this so as not to show 0
                            }
                            {
                                checkoutData !== undefined && checkoutData.length > 0 ?
                                    <>
                                        <div className="leading-6">
                                            {
                                                checkoutData.map(
                                                    (checkoutItem) => <CheckoutItem
                                                        key={checkoutItem.cart_item_id}
                                                        cartItem={checkoutItem} />
                                                )
                                            }
                                        </div>
                                        {/* Delivery Information */}
                                        <h1 className="font-bold my-2 text-secondary-gray-color">Delivery Information</h1>
                                        <section>
                                            <div>
                                                <label htmlFor="default-delivery" className="flex gap-1 font-bold">
                                                    <input type="radio" name="delivery" value="default-delivery" id="default-delivery" />
                                                    <span>Use default delivery address</span>
                                                </label>
                                                {
                                                    checkoutDetails != null && <DefaultDeliveryInfo checkoutDetails={checkoutDetails} />
                                                }
                                            </div>
                                            <div>
                                                <label htmlFor="new-delivery" className="flex gap-1 font-bold mt-1">
                                                    <input type="radio" name="delivery" value="new-delivery" id="new-delivery" />
                                                    <span>Use another delivery address</span>
                                                </label>
                                                <div>
                                                    <NewDeliveryInfo />
                                                </div>
                                            </div>
                                        </section>
                                    </>
                                    :
                                    <>
                                        <h1>No Order Information</h1>
                                    </>
                            }
                        </>
                    )

            }
        </>
    )
}