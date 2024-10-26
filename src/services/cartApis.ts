"use server";

import { ApiResponse } from "@/types/apiResponse";
import { UserDeliveryData } from "@/types/userInterfaces";
import { fetchAccessTokenCookie } from "@/utils/cookieUtils";
import { ADD_TO_CART_URL, CHECKOUT_DETAILS_URL, CHECKOUT_URL, FETCH_CART_URL, ORDER_ADDRESS_SUMMARY_URL } from "@/utils/urls/cartUrls";
import { cookies } from "next/headers";
import { handleErrorsResponse } from "./responseHandler";

type CartData = {
    product_id: string
    action: "increament" | "decreament" | "update" | "remove" | "clear" | "add";
}

const token = fetchAccessTokenCookie();
console.log(token)
export async function addToCartApi(data: CartData): Promise<ApiResponse> {
    try {
        const response = await fetch(ADD_TO_CART_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // Authorization: `Bearer ${token?.value || ""}`,
                // Change this cookie
                // Change this cookie
                // Change this cookie
                // Change this cookie
                // Change this cookie
                // Change this cookie
                // Change this cookie
                // Change this cookie
                // Change this cookie
                // Change this cookie
                // Change this cookie
                // Change this cookie
                // Change this cookie
                // Change this cookie
                // Change this cookie
                // Change this cookie
                Cookie: 'sessionid=fo2b2x5kt94pjbny6e3xkqlj4gvz88vf',
            },
            credentials: "include",
            body: JSON.stringify(data),
        })

        const responseBody = await response.json();

        switch (response.status) {
            case 202:
                return { message: "Item added successfully", status: 202 }
            case 404:
                return { error: "Action not recognized", status: 404 }
            default:
                return { error: "Could not add item to cart, reload and try again" }
        }
    } catch (error) {
        return { error: "Error occured while trying to add to cart" }
    }
}

export async function modifyCartApi(data: CartData): Promise<ApiResponse> {
    try {
        const response = await fetch(ADD_TO_CART_URL, {
            method: "POST",
            headers: {
                // Change this cookie
                // Change this cookie
                // Change this cookie
                // Change this cookie
                // Change this cookie
                // Change this cookie
                // Change this cookie
                // Change this cookie
                // Change this cookie
                // Change this cookie
                // Change this cookie
                // Change this cookie
                Cookie: 'sessionid=fo2b2x5kt94pjbny6e3xkqlj4gvz88vf',
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
        const responseBody = await response.json();
        switch (response.status) {
            case 202:
                return { data: responseBody, status: 202 }
            case 404:
                return { error: "Action not recognized" }
            default:
                return { error: "Could not modify cart, reload and try again" }
        }
    } catch (error) {
        return { error: "Error occured while trying to modify cart" }
    }
}

export async function getCartApi(): Promise<ApiResponse> {
    try {
        const response = await fetch(FETCH_CART_URL, {
            headers: {
                Cookie: 'sessionid=fo2b2x5kt94pjbny6e3xkqlj4gvz88vf',
            }
        })
        const responseBody = await response.json();
        switch (response.status) {
            case 200:
                return { data: responseBody, status: 200 }
            case 404:
                return { error: "Action not recognized" }
            default:
                return { error: "Could not get item cart, reload and try again" }
        }
    } catch (error) {
        return { error: "Error occured while trying to get cart" }
    }
}


export async function getCartSummaryApi(): Promise<ApiResponse> {
    try {
        const response = await fetch(FETCH_CART_URL, {
            headers: {
                Cookie: 'sessionid=fo2b2x5kt94pjbny6e3xkqlj4gvz88vf',
            }
        })
        const responseBody = await response.json();
        switch (response.status) {
            case 200:
                return { data: responseBody, status: 200 }
            case 404:
                return { error: "Action not recognized" }
            default:
                return { error: "Could not get item cart, reload and try again" }
        }
    } catch (error) {
        return { error: "Error occured while trying to get cart" }
    }
}

export async function checkoutItemsApi(): Promise<ApiResponse> {
    try {
        const response = await fetch(CHECKOUT_URL, {
            headers: {
                Cookie: 'sessionid=fo2b2x5kt94pjbny6e3xkqlj4gvz88vf',
                Authorization: `Bearer ${token?.value || ""}`,
            }
        })
        const responseBody = await response.json();
        console.log(responseBody)
        switch (response.status) {
            case 200:
                return { data: responseBody, status: 200 }
            default:
                return { error: "Could not get checkout items, reload and try again" }
        }
    } catch (error) {
        return { error: "Error occured while trying to get checkout items" }
    }
}

export async function checkoutDetailsApi(): Promise<ApiResponse> {
    try {
        const response = await fetch(CHECKOUT_DETAILS_URL, {
            headers: {
                Cookie: 'sessionid=fo2b2x5kt94pjbny6e3xkqlj4gvz88vf',
                Authorization: `Bearer ${token?.value || ""}`,
            }
        })
        const responseBody = await response.json();
        console.log(responseBody)
        switch (response.status) {
            case 200:
                return { data: responseBody.data, status: 200 }
            default:
                return { error: "Could not get checkout detail, reload and try again" }
        }
    } catch (error) {
        return { error: "Error occured while trying to checkout" }
    }
}


export async function orderAddressSummaryApi(data: UserDeliveryData): Promise<ApiResponse> {
    try {
        const response = await fetch(ORDER_ADDRESS_SUMMARY_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token?.value || ""}`
            },
            body: JSON.stringify(data)
        });
        const responseBody = await response.json();
        switch (response.status) {
            case 401: {
                return { status: 401 }
            }
            case 404:
                return { error: "You are yet to fill your user or address information" }
            case 200:
                return { data: responseBody.data, status: 200 }
            case 400:
                return handleErrorsResponse(responseBody)
            default:
                return { error: "User address update was not successful, reload and try again" }
        }

    } catch (error) {
        return { error: "Error occured while processing summary" }
    }
}

