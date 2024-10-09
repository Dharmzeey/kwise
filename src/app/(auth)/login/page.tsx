"use client";

import { loginUser } from "@/actions/authActions";
import { useFormStatus, useFormState } from "react-dom";
import InputFIeld from "@/components/interractivity/input";
import Link from "next/link";
import { SubmitButton } from "@/components/button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const initialState = {
  message: "",
};

export default function LoginPage() {
  const router = useRouter();
  const [state, formAction] = useFormState(loginUser, initialState);
  useEffect(() => {
    if (state.message === "Login successful") {
      // the message will come from authApi through authAction
      router.push("/");
    }
  }, [state]);

  return (
    <>
      <form action={formAction}>
        <InputFIeld
          inputFor="email"
          inputText="Email"
          inputType="email"
          inputId="email"
          inputName="email"
        />
        <InputFIeld
          inputFor="password"
          inputText="Password"
          inputType="password"
          inputId="password"
          inputName="password"
        />

        <SubmitButton pendingText="Logging in..." buttonText="LOGIN" />
        {/* Display feedback message */}
        <p
          aria-live="polite"
          className="sr-o text-red-600 text-center"
          role="status"
        >
          {state.message}
        </p>
      </form>
      <div className="flex flex-col items-center gap-1 mt-3">
        <div className="flex gap-3">
          <p>Don't have an account? </p>
          <Link href="/signup" className="text-blue-700 underline">
            Sign up
          </Link>
        </div>
        <Link href="/password/forgot" className="text-blue-700 underline">
          Forgort Password
        </Link>
      </div>
    </>
  );
}
