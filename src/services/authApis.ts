"use server";

import { ACCESS_TOKEN_NAME, MAX_AGE } from "@/utils/constants";
import {
    CONFIRM_EMAIL_VERIFICATION,
    CREATE_NEW_PASSWORD,
    FORGOT_PASSWORD,
    LOGIN,
    RESET_PASSWORD,
    SEND_EMAIL_VERIFICATION,
    SIGNUP,
} from "@/utils/urls/authUrls";
import { cookies } from "next/headers";
import { handleErrorsResponse } from "./responseHandler";
import { ApiResponse } from "@/types/apiResponse";

type CreateUserData = {
    email: string;
    phone_number: string;
    password: string;
    confirm_password: string;
};

type LoginUserData = {
    email: string;
    password: string;
};

type PinVerificationData = {
    email_pin: string,
};

type ForgotPasswordData = {
    email: string;
};

type ResetPasswordPinData = {
    email: string,
    reset_token: string,
    email_pin: string;
}

type CreateNewPasswordData = {
    email: string;
    reset_token: string,
    password: string,
    confirm_password: string
}

function handleAccessToken(token: string) {
    cookies().set({
        name: ACCESS_TOKEN_NAME,
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: MAX_AGE,
        path: "/",
    });
}

function fetchCookie() {
    const cookieStore = cookies();
    return cookieStore.get(ACCESS_TOKEN_NAME);
}

export async function createUserApi(data: CreateUserData) {
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
                    message: "User with this email or Phone Number already exists.",
                };
            case 201:
                const token = responseBody.access_token;
                handleAccessToken(token);
                // serialize(COOKIE_NAME, token, {
                //   httpOnly: true,
                //   secure: process.env.NODE_ENV === "production",
                //   sameSite: "strict",
                //   maxAge: MAX_AGE,
                //   path: "/",
                // });
                // permanentRedirect('/email-verification/confirm');
                return { message: "Sign up successful" };
            default:
                return { message: "Failed to sign up." };
        }
    } catch (error) {
        return { message: `An error occurred during signup. ${error}` };
    }
}

// code verification on signup
export async function verifyCodeApi(data: PinVerificationData) {
    try {
        const token = fetchCookie();
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
                    message:
                        "Unauthorized access request token again, this is for developer to re-fresh refresh token or ensure token is sent",
                };
            case 410:
                return { message: "Verification Pin Expired" };
            case 403:
                return { message: "Invalid PIN" };
            case 404:
                return { message: "PIN has not been sent" };
            case 400:
                return { message: "Invalid PIN input" };
            case 200:
                return { message: "Email verified successfully" };
            default:
                return { message: "Email verification failed" };
        }
    } catch (error) {
        return { message: "An error occurred during pin verification." };
    }
}

export async function resendEmailVerificationApi() {
    try {
        const token = fetchCookie();
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
                return { message: "Email Verification already sent" };
            case 200:
                return { message: "verification PIN sent to email." };
            case 401:
                return { message: "You need to login first" };
            default:
                console.log(response.status);
                return { message: "Email request failed" };
        }
    } catch (error) {
        return { message: "An error occurred during PIN request." };
    }
}

export async function loginUserApi(data: LoginUserData) {
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
                    message: "Invalid Login Credentials.",
                };
            case 404:
                return {
                    message: "User does not exists",
                };
            case 200:
                handleAccessToken(responseBody.access_token);
                return { message: "Login successful" };
            default:
                return { message: "Failed to Log user in." };
        }
    } catch (error) {
        console.log(error);
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
                return { message: "Password reset PIN sent to email", token: responseBody.reset_token };
            case 409:
                return { message: "password reset PIN already sent" };
            case 404:
                return { message: "User information not found" };
            case 400:
                return handleErrorsResponse(responseBody) // this will help concatenate the errors into str 
            default:
                console.log(response.status);
                return { message: "Email request failed" };
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
                return { message: "Password reset PIN expired" };
            case 403:
                return { message: responseBody.error };
            case 404:
                return { message: "password reset PIN has not been sent" };
            case 400:
                console.log(handleErrorsResponse(responseBody))
                return handleErrorsResponse(responseBody) // this will help concatenate the errors into str 
            case 200:
                return { message: "Password reset PIN verified successfully", token: responseBody.reset_token };
            default:
                return { message: "Email verification failed" };
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
                return { message: "Password changed successfully" }
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