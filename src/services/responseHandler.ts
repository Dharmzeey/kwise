import { ApiResponse } from "@/types/apiResponse";

export interface ApiErrors {
  errors?: { [key: string]: string }
}

export function handleErrorsResponse(responseBody: ApiErrors):ApiResponse {
  // This function handle the scenario where more than one error is returned
  if (responseBody.errors) {
    // Concatenate all errors into a single string
    const concatenatedErrors = Object.entries(responseBody.errors)
      .map(([field, message]) => `${field}: ${message}`)
      .join("\n ");

    return { error: concatenatedErrors };
  }
  return { error: "Unexpected response format" };
}