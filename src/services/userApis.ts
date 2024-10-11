"use server";

import { ApiResponse } from "@/types/apiResponse";
import { fetchAccessTokenCookie } from "@/utils/cookieUtils";
import { ADD_USER_INFO, DELETE_USER_INFO, RETRIEVE_USER_INFO, VERIFY_USER_INFO } from "@/utils/urls/userUrls";
import { handleErrorsResponse } from "./responseHandler";
import { UserProfileData } from "@/types/userInterfaces";


export async function verifyUserInfo(): Promise<ApiResponse> {
    try {
        const token = fetchAccessTokenCookie();
        const response = await fetch(VERIFY_USER_INFO, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token?.value || ""}`,
            }
        });
        const responseBody = await response.json();
        console.log(responseBody)
        switch (response.status) {
            case 200:
                return { message: "User info exists" }
            case 404:
                return { error: "User info does not exist" }
            case 401:
                return { error: "You need to login to access this page", status: 401 }
            case 403:
                // this will handle when the user email is not verified
                return { error: responseBody.detail, status: 403 }
            default:
                return { error: "Could not verify user info status, reload and try again" }
        }
    } catch (error) {
        return { error: "Error occured during user info verification" }
    }
}

export async function createUserInfoApi(data: UserProfileData): Promise<ApiResponse> {
    try {
        const token = fetchAccessTokenCookie();
        const response = await fetch(ADD_USER_INFO, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token?.value || ""}`,
            },
            body: JSON.stringify(data)
        });
        const responseBody = await response.json();
        switch (response.status) {
            case 401:
                // this is because 401 returns when not logged in and the '.detail' is from django itself
                return { error: responseBody.detail, status: 401 }
            case 403:
                return { error: "Email not verified", status:403 }
            case 409:
                return { error: "User profile already exists" }
            case 201:
                // this below also returns the user data
                return { message: "Profile created successfully", data: responseBody.data }
            case 400:
                return handleErrorsResponse(responseBody)
            default:
                return { error: "User Information creation was not successful, reload and try again" }
        }

    } catch (error) {
        return { error: "Error occured during user info creation" }
    }
}


export async function retrieveUserInfoApi(): Promise<ApiResponse> {
    try {
        const token = fetchAccessTokenCookie();
        const response = await fetch(RETRIEVE_USER_INFO, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token?.value || ""}`
            },
        });
        const responseBody = await response.json();
        console.log(responseBody)
        switch (response.status) {
            case 404:
                return { error: "You have not added your personal information" }
            case 401:
                return { error: responseBody.detail, status: 401 }
            case 200:
                return { message: responseBody.message, data: responseBody.data }
            default:
                return { error: "Cannot fetch user reload and try again" }
        }

    } catch (error) {
        return { error: "Error occured while fetching user info" }
    }
}


export async function updateUserInfoApi(data: UserProfileData): Promise<ApiResponse> {
    try {
        const token = fetchAccessTokenCookie();
        const response = await fetch(ADD_USER_INFO, {
            method: "PATCH",
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
                return { error: "You are yet to fill their personal information" }
            case 200:
                // this below also returns the user data
                return { message: "Profile Updated successfully", data: responseBody.data }
            case 400:
                return handleErrorsResponse(responseBody)
            default:
                return { error: "User addinfo was not successful, reload and try again" }
        }

    } catch (error) {
        return { error: "Error occured while fetching updating user info" }
    }
}


// This below deletes the user permanently and not just the user info
export async function deleteUserApi(): Promise<ApiResponse> {
    try {
        const token = fetchAccessTokenCookie();
        const response = await fetch(DELETE_USER_INFO, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token?.value || ""}`
            },
        });
        switch (response.status) {
            case 401:
                return { error: "You are not logged in", status: 401 }
            case 204:
                // Though no content is returned, just 204 status code
                return { message: "User Account deleted Successfully" } // should redirect to homepage
            default:
                return { error: "User deletion was not successful, reload and try again" }
        }

    } catch (error) {
        return { error: "Error occured while trying to delete user info" }
    }
}