import { orderAddressSummaryApi } from "@/services/cartApis";
import { ApiResponse } from "@/types/apiResponse";
import { z } from "zod";

export async function useNewDeliveryInfo(
    prevState: ApiResponse,
    formData: FormData
) {
    const schema = z.object({
        name: z.string(),
        phone_number: z
            .string()
            .min(10, "Invalid phone number")
            .max(11, "11 digit phone number required")
            .optional()
            .or(z.literal('')),
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
        name: formData.get("name"),
        phone_number: formData.get("phone-number"),
        state: formData.get("state"),
        city_town: formData.get("city-town"),
        lga: formData.get("lga"),
        prominent_motor_park: formData.get("prominent-motor-park"),
        landmark_signatory_place: formData.get("landmark-signatory-place"),
        address: formData.get("address")
    })
    if (!parse.success) {
        return {
            error: `Failed to proceed to summary page. Please check the input. ${parse.error.message}`,
        };
    }
    const data = parse.data;
    return orderAddressSummaryApi(data);
}