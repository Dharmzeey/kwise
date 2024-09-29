"use server";

import {
  createUserApi,
  loginUserApi,
  verifyCodeApi,
} from "@/services/authApis";
import { z } from "zod";


export async function createUser(
  prevState: { message: string },
  formData: FormData
) {
  const schema = z
    .object({
      email: z.string().email("Invalid email address"),
      phone_number: z
        .string()
        .min(10, "Invalid phone number")
        .max(11, "11 digit phone number required"),
      password: z.string().min(6, "Password must be at least 6 characters"),
      confirm_password: z
        .string()
        .min(6, "Password must be at least 6 characters"),
    })
    .refine((data) => data.password === data.confirm_password, {
      message: "Passwords do not match",
      path: ["confirm_password"],
    });

  const parse = schema.safeParse({
    email: formData.get("email"),
    phone_number: formData.get("phone-number"),
    password: formData.get("password"),
    confirm_password: formData.get("confirm-password"),
  });

  if (!parse.success) {
    return {
      message: `Failed to sign up. Please check the input. ${parse.error.message}`,
    };
  }

  const data = parse.data;
  return createUserApi(data);
}

export async function verifyCode(
  prevState: { message: string },
  formData: FormData
) {
  const schema = z.object({
    email_pin: z.string().length(6, "Invalid pin"),
  });

  const parse = schema.safeParse({
    email_pin: formData.get("email-pin"),
  });

  if (!parse.success) {
    return {
      message: `Pin verification Invalid. Please check the input. ${parse.error.message}`,
    };
  }
  const data = parse.data;
  return verifyCodeApi(data);
}

export async function loginUser(
  prevState: { message: string },
  formData: FormData
) {
  const schema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  });

  const parse = schema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parse.success) {
    console.log(parse.error.message);
    return {
      message: `Failed to sign up. Please check the input. ${parse.error.message}`,
    };
  }

  const data = parse.data;

  return loginUserApi(data);
}
