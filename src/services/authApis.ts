"use server";

import { EMAIL_VERIFICATION, SIGNUP } from "@/utils/urls/authUrls";

type AuthUserData = {
  email: string;
  phone_number: string;
  password: string;
  confirm_password: string;
};

type PinVerificationData = {
  email_pin: string;
};

export async function createUserApi(data: AuthUserData) {
  try {
    const response = await fetch(SIGNUP, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    switch (response.status) {
      case 409:
        return {
          message: "User with this email or Phone Number already exists.",
        };
      case 201:
        return { message: `Signup successful for ${data.email}!` };
      default:
        return { message: "Failed to sign up." };
    }
  } catch (error) {
    return { message: "An error occurred during signup." };
  }
}

// code verification
export async function verifyCodeApi(data: PinVerificationData) {
  try {
    const token = "jdhhwkhkdjw";
    const response = await fetch(EMAIL_VERIFICATION, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${token}`,
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
      case 404:
        return { message: "PIN has not been sent" };
      case 400:
        return { message: "Invalid PIN input" };
      case 201:
        return { message: ` Email verified successfully` };
      default:
        return { message: "Email verification failed" };
    }
  } catch (error) {
    return { message: "An error occurred during pin verification." };
  }
}
