"use server";

import { ACCESS_TOKEN_NAME, MAX_AGE } from "@/utils/constants";
import {
  CONFIRM_EMAIL_VERIFICATION,
  LOGIN,
  SEND_EMAIL_VERIFICATION,
  SIGNUP,
} from "@/utils/urls/authUrls";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

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
  email_pin: string;
};

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

export async function sendEmailVerification() {
  try {
    const token = fetchCookie();
    const response = await fetch(SEND_EMAIL_VERIFICATION, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token?.value || ""}`,
      },
    });
    const responseBody = await response.json();
    switch (response.status) {
      case 401:
        return {
          message: "Email has already been verified",
        };
      case 409:
        return {
          message: "Email Verification already sent.",
        };
      case 200:
        return {
          message: "Verification Pin sent to Email",
        };
    }
  } catch (error) {
    return { message: "Sign up successful but could not send Email" };
  }
}

// code verification
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
        return {message: "Invalid PIN"}
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
