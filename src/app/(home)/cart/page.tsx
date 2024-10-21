'use client';

import { ActionLink } from "@/components/actionComponents";
import CartItem from "@/components/cart/cartItem";
import Loading from "@/components/loading";
import { getCartApi } from "@/services/cartApis";
import { CartData } from "@/types/cartInterfaces";
import { numberWithCommas } from "@/utils/filter";
import { useEffect, useState } from "react";

export default function CartPage() {
    const [grandTotalPrice, setGrandTotalPrice] = useState<number>();
    const [data, setData] = useState<CartData[]>();
    const [isLoading, setIsLoading] = useState<boolean>(true)


    useEffect(() => {
        async function fetchCart() {
            const response = await getCartApi();
            console.log(response.data)
            if (response.status === 200) {
                setGrandTotalPrice(response.data.grand_total_price)
                setData(response.data.data)
                setIsLoading(false)
            }

        }
        fetchCart()
    }, [])


    async function updateGrandTotalPrice() {
        const response = await getCartApi();
        if (response.status === 200) {
            setGrandTotalPrice(response.data.grand_total_price)
        }
    }


    // Function to remove an item from the cart data
    const removeCartItem = (productId: string) => {
        setData(prevData => prevData?.filter(item => item.product.id !== productId)); // Remove the item from the state
    };


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
                                    <h1 className="font-bold mb-2 text-secondary-gray-color">Cart Information</h1>
                                    <div className="flex justify-between font-bold mb-2">
                                        <span>Total</span>
                                        <span>₦ {numberWithCommas(grandTotalPrice)}</span>
                                    </div>
                                </>
                                :
                                <></> // added this so as not to show 0

                            }
                            {
                                data != undefined && data.length > 0 ?
                                    <>
                                        {
                                            data.map(
                                                (productInfo) => <CartItem
                                                    key={productInfo.product.id}
                                                    cartItem={productInfo}
                                                    updteGrandTotal={updateGrandTotalPrice}
                                                    removeCartItem={removeCartItem} />
                                            )
                                        }
                                        <div className="flex flex-col justify-center items-center gap-1 mb-2">
                                            <ActionLink buttonBgColor="bg-main-color" linkText="PROCEED TO CHECKOUT" linkUrl="/checkout" />
                                        </div>
                                    </>
                                    :
                                    <>
                                        <h1>No cart Information</h1>
                                    </>
                            }
                        </>
                    )

            }
        </>
    )
}