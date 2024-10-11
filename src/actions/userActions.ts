"use server";

import { createUserInfoApi, updateUserInfoApi } from "@/services/userApis";
import { ApiResponse } from "@/types/apiResponse";
import { z } from "zod";


export async function createUserInfo(
    prevState: ApiResponse,
    formData: FormData
) {
    const schema = z.object({
        first_name: z.string(),
        last_name: z.string(),
        other_name: z.string(),
        alternative_email: z
            .string()
            .email("Invalid email address")
            .optional()
            .or(z.literal('')),
        alternative_phone_number: z
            .string()
            .min(10, "Invalid phone number")
            .max(11, "11 digit phone number required")
            .optional()
            .or(z.literal('')),
    })

    const parse = schema.safeParse({
        first_name: formData.get("first-name"),
        last_name: formData.get("last-name"),
        other_name: formData.get("other-name"),
        alternative_email: formData.get("alternative-email"),
        alternative_phone_number: formData.get("alternative-phone-number"),
    })
    if (!parse.success) {
        return {
            error: `Failed to create user information up. Please check the input. ${parse.error.message}`,
        };
    }
    const data = parse.data;
    return createUserInfoApi(data);
}


export async function updateUserInfo(
    prevState: ApiResponse,
    formData: FormData
) {
    const schema = z.object({
        first_name: z.string(),
        last_name: z.string(),
        other_name: z.string(),
        alternative_email: z.string().email("Invalid email address"),
        alternative_phone_number: z
            .string()
            .min(10, "Invalid phone number")
            .max(11, "11 digit phone number required"),
    })

    const parse = schema.safeParse({
        first_name: formData.get("first-name"),
        last_name: formData.get("last-name"),
        other_name: formData.get("other-name"),
        altername_email: formData.get("alternative-email"),
        alternative_phone_number: formData.get("alternative-phone-number"),
    })
    if (!parse.success) {
        return {
            error: `Failed to update user information up. Please check the input. ${parse.error.message}`,
        };
    }
    const data = parse.data;
    return updateUserInfoApi(data);
}