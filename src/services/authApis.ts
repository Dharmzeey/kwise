"use server";

import {
    CONFIRM_EMAIL_VERIFICATION,
    CREATE_NEW_PASSWORD,
    FORGOT_PASSWORD,
    LOGIN,
    RESET_PASSWORD,
    SEND_EMAIL_VERIFICATION,
    SIGNUP,
} from "@/utils/urls/authUrls";
import { handleErrorsResponse } from "./responseHandler";
import { ApiResponse, ForgotPasswordData } from "@/types/apiResponse";
import { fetchAccessTokenCookie, handleAccessToken, handleRefreshToken, removeAllTokens } from "@/utils/cookieUtils";
import { CreateUserData, PinVerificationData, LoginUserData, ResetPasswordPinData, CreateNewPasswordData } from "@/types/authInterfaces";


export async function createUserApi(data: CreateUserData): Promise<ApiResponse> {
    try {
        const response = await fetch(SIGNUP, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        const responseBody = await response.json();
        switch (response.status) {
            case 409:
                return {
                    error: "User with this email or Phone Number already exists.",
                };
            case 201:
                const access_token = responseBody.access_token;
                const refresh_token = responseBody.refresh_token;
                handleAccessToken(access_token);
                handleRefreshToken(refresh_token);
                return { message: "Sign up successful" };
            default:
                return { error: "Failed to sign up." };
        }
    } catch (error) {
        return { error: `An error occurred during signup. ${error}` };
    }
}

// code verification on signup
export async function verifyCodeApi(data: PinVerificationData): Promise<ApiResponse> {
    try {
        const token = fetchAccessTokenCookie();
        const response = await fetch(CONFIRM_EMAIL_VERIFICATION, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token?.value || ""}`,
            },

            body: JSON.stringify(data),
        });
        switch (response.status) {
            case 401:
                return {
                    error:
                        "Unauthorized access request token again, this is for developer to re-fresh refresh token or ensure token is sent", status: 401
                };
            case 410:
                return { error: "Verification Pin Expired" };
            case 403:
                return { error: "Invalid PIN" };
            case 404:
                return { error: "PIN has not been sent" };
            case 400:
                return { error: "Invalid PIN input" };
            case 200:
                return { message: "Email verified successfully", status: 200 };
            default:
                return { error: "Email verification failed" };
        }
    } catch (error) {
        return { message: "An error occurred during pin verification." };
    }
}

export async function resendEmailVerificationApi(): Promise<ApiResponse> {
    try {
        const token = fetchAccessTokenCookie();
        const response = await fetch(SEND_EMAIL_VERIFICATION, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token?.value || ""}`,
            },
        });
        switch (response.status) {
            case 201:
                return { message: "Email has already been verified" };
            case 409:
                return { error: "Email Verification already sent" };
            case 200:
                return { message: "verification PIN sent to email." };
            case 401:
                return { error: "You need to login first", status: 401 };
            default:
                return { message: "Email request failed" };
        }
    } catch (error) {
        return { error: "An error occurred during PIN request." };
    }
}

export async function loginUserApi(data: LoginUserData): Promise<ApiResponse> {
    try {
        const response = await fetch(LOGIN, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        const responseBody = await response.json();
        switch (response.status) {
            case 401:
                return {
                    error: "Invalid Login Credentials.",
                };
            case 404:
                return {
                    error: "User does not exists",
                };
            case 200:
                const access_token = responseBody.access_token;
                const refresh_token = responseBody.refresh_token;
                handleAccessToken(access_token);
                handleRefreshToken(refresh_token);
                return { message: "Login successful",status: 200 };
            default:
                return { error: "Failed to Log user in." };
        }
    } catch (error) {
        return { message: "An error occurred during login in." };
    }
}

export async function forgotPasswordApi(data: ForgotPasswordData): Promise<ApiResponse> {
    try {
        const response = await fetch(FORGOT_PASSWORD, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        const responseBody = await response.json();
        switch (response.status) {
            case 200:
                return { message: "Password reset PIN sent to email", token: responseBody.reset_token, status: 200 };
            case 409:
                return { error: "password reset PIN already sent" };
            case 404:
                return { error: "User information not found" };
            case 400:
                return handleErrorsResponse(responseBody) // this will help concatenate the errors into str 
            default:
                return { error: "Email request failed" };
        }
    } catch (error) {
        return { error: "An error occurred during PIN request." };
    }
}


export async function verifyResetCodeApi(data: ResetPasswordPinData): Promise<ApiResponse> {
    try {
        const response = await fetch(RESET_PASSWORD, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify(data),
        });
        const responseBody = await response.json();
        switch (response.status) {
            case 401:
                return { error: "Password reset PIN expired" };
            case 403:
                return { error: responseBody.error };
            case 404:
                return { error: "password reset PIN has not been sent" };
            case 400:
                return handleErrorsResponse(responseBody) // this will help concatenate the errors into str 
            case 200:
                return { message: "Password reset PIN verified successfully", token: responseBody.reset_token };
            default:
                return { error: "Email verification failed" };
        }
    } catch (error) {
        return { error: "An error occurred during pin verification." };
    }
}


export async function createNewPasswordApi(data: CreateNewPasswordData): Promise<ApiResponse> {
    try {
        const response = await fetch(CREATE_NEW_PASSWORD, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        const responseBody = await response.json()
        switch (response.status) {
            case 403:
                return { error: `${responseBody.error}` }
            case 200:
                return { message: "Password changed successfully", status:200 }
            case 404:
                return { error: "User information is not found" }
            case 400:
                return handleErrorsResponse(responseBody)
            default:
                return { error: "Password reset failed" };
        }
    } catch (error) {
        return { error: "An error occurred during password reset" };
    }
}


export async function logout() {
    removeAllTokens()
}