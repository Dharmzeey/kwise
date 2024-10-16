"use server";

import { createUserAddressApi, createUserInfoApi, updateUserAddressApi, updateUserInfoApi } from "@/services/userApis";
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
            error: `Failed to create user information. Please check the input. ${parse.error.message}`,
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
        alternative_email: z
            .string()
            .email("Invalid email address")
            .optional()
            .or(z.literal('')),
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
            error: `Failed to update user information. Please check the input. ${parse.error.message}`,
        };
    }
    const data = parse.data;
    return updateUserInfoApi(data);
}


export async function createUserAddress(
    prevState: ApiResponse,
    formData: FormData
) {
    const schema = z.object({
        state: z.string(),
        city_town: z.string(),
        lga: z.string(),
        prominent_motor_park: z
            .string()
            .optional()
            .or(z.literal('')),
        landmark_signatory_place: z
            .string()
            .optional()
            .or(z.literal('')),
        address: z.string()
    })

    const parse = schema.safeParse({
        state: formData.get("state"),
        city_town: formData.get("city-town"),
        lga: formData.get("lga"),
        prominent_motor_park: formData.get("prominent-motor-park"),
        landmark_signatory_place: formData.get("landmark-signatory-place"),
        address: formData.get("address")
    })
    if (!parse.success) {
        return {
            error: `Failed to create user address information. Please check the input. ${parse.error.message}`,
        };
    }
    const data = parse.data;
    return createUserAddressApi(data);
}


export async function updateUserAddress(
    prevState: ApiResponse,
    formData: FormData
) {
    const schema = z.object({
        state: z.string(),
        city_town: z.string(),
        lga: z.string(),
        prominent_motor_park: z
            .string()
            .optional()
            .or(z.literal('')),
        landmark_signatory_place: z
            .string()
            .optional()
            .or(z.literal('')),
        address: z.string()
    })

    const parse = schema.safeParse({
        state: formData.get("state"),
        city_town: formData.get("city-town"),
        lga: formData.get("lga"),
        prominent_motor_park: formData.get("prominent-motor-park"),
        landmark_signatory_place: formData.get("landmark-signatory-place"),
        address: formData.get("address")
    })
    if (!parse.success) {
        return {
            error: `Failed to update user information. Please check the input. ${parse.error.message}`,
        };
    }
    const data = parse.data;
    return updateUserAddressApi(data);
}
