'use server'

import { ApiResponse } from "@/types/apiResponse";
import { FETCH_LGAS, FETCH_STATES } from "@/utils/urls/baseUrls";

export async function fetchStatesApi(): Promise<ApiResponse> {
    try {
        const response = await fetch(FETCH_STATES);
        const responseBody = await response.json()
        switch (response.status) {
            case 200:
                return { data: responseBody.states, status: 200 }
            default:
                return { error: "Cannot fetch states try again" };
        }
    } catch (error) {
        return { error: "Error occured while fetching states", status: 404 }
    }
}

export async function fetchLgasApi(state_id: string): Promise<ApiResponse> {
    try {
        const response = await fetch(FETCH_LGAS(state_id));
        const responseBody = await response.json()
        switch (response.status) {
            case 200:
                return { data: responseBody.lgas, status: 200 }
            default:
                return { error: "Cannot fetch Lgas try again" };
        }
    } catch (error) {
        return { error: "Error occured while fetching Lgas", status: 404 }
    }
}