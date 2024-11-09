"use server";

import { ApiResponse } from "@/types/apiResponse";
import { fetchAccessTokenCookie, getSessionId } from "@/utils/cookieUtils";
import { INITIATE_PATMENT_URL } from "@/utils/urls/paymentUrls";


export async function initiatePaymentApi(): Promise<ApiResponse> {
    try {
        const token = fetchAccessTokenCookie();
        const response = await fetch(INITIATE_PATMENT_URL, {
            method: "POST",
            headers: {
                Cookie: `sessionid=${getSessionId()}`,
                Authorization: `Bearer ${token?.value || ""}`,
                "Content-Type": "application/json",
            },
        })
        const responseBody = await response.json();
        switch (response.status) {
            case 200:
                return { data: responseBody.access_code, status: 200 }
            case 400:
                return { error: "Payment could not be initialized", status: 400 }
            case 401:
                return {status: 401}
            case 404:
                return { error: "No cart item", status: 404 }
            case 500:
                return { error: "payment initialization timed out", status: 500 }
            default:
                return { error: "Could not be initialized, reload and try again" }
        }
    } catch (error) {
        throw error
        return { error: "Error occured while trying to initialize payment" }
    }
}
