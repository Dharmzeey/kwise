"use server";

import { ApiResponse } from "@/types/apiResponse";
import { UserDeliveryData } from "@/types/userInterfaces";
import { fetchAccessTokenCookie, getSessionId, setSessionId } from "@/utils/cookieUtils";
import { ADD_TO_CART_URL, CHECKOUT_DETAILS_URL, CHECKOUT_URL, FETCH_CART_URL, GET_CART_ITEM_QUANTITY_URL, ORDER_ADDRESS_SUMMARY_URL } from "@/utils/urls/cartUrls";
import { handleErrorsResponse } from "./responseHandler";

type CartData = {
    product_id: string
    action: "increament" | "decreament" | "update" | "remove" | "clear";
    quantity?: number;
}

const token = fetchAccessTokenCookie();

export async function addToCartApi(data: CartData): Promise<ApiResponse> {
    try {
        const response = await fetch(ADD_TO_CART_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Cookie: `sessionid=${getSessionId()}`,
            },
            body: JSON.stringify(data),
        })
        const sessionId = response.headers.get('set-cookie');
        setSessionId(sessionId!)

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
                Cookie: `sessionid=${getSessionId()}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
        const sessionId = response.headers.get('set-cookie');
        setSessionId(sessionId!)
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
                Cookie: `sessionid=${getSessionId()}`,
            }
        })
        const sessionId = response.headers.get('set-cookie');
        setSessionId(sessionId!)
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
                Cookie: `sessionid=${getSessionId()}`,
            }
        })
        const sessionId = response.headers.get('set-cookie');
        setSessionId(sessionId!)
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
                Cookie: `sessionid=${getSessionId()}`,
                Authorization: `Bearer ${token?.value || ""}`,
            }
        })
        const sessionId = response.headers.get('set-cookie');
        setSessionId(sessionId!)
        const responseBody = await response.json();
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
                Authorization: `Bearer ${token?.value || ""}`,
            }
        })
        const responseBody = await response.json();
        switch (response.status) {
            case 200:
                return { data: responseBody.data, status: 200 }
            case 404:
                return { error: "You have not filled you Basic / Address information", status: 404 }
            case 401:
                return { status: 401 }
            case 403:
                return { error: "User email not verified", status: 403 }
            default:
                return { error: "Could not get checkout detail, reload and try again" }
        }
    } catch (error) {
        return { error: `Error occured while trying to checkout`, }
    }
}


export async function orderAddressSummaryApi(data: UserDeliveryData): Promise<ApiResponse> {
    try {
        const response = await fetch(ORDER_ADDRESS_SUMMARY_URL, {
            method: "POST",
            headers: {
                Cookie: `sessionid=${getSessionId()}`,
                "Content-Type": "application/json",
                Authorization: `Bearer ${token?.value || ""}`
            },
            body: JSON.stringify(data)
        });
        const sessionId = response.headers.get('set-cookie');
        setSessionId(sessionId!)
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

