"use client";

import { createUser } from "@/actions/authActions";
import { useFormState } from "react-dom";
import InputFIeld from "@/components/interractivity/input";
import Link from "next/link";
import { SubmitButton } from "@/components/button";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const initialState = {
  message: "",
};

export default function SignupPage() {
  const [state, formAction] = useFormState(createUser, initialState);
  const router = useRouter();
  useEffect(() => {
    if (state.message === "Sign up successful") {
      // the message will come from authApi through authAction
      router.push("/email-verification/confirm");
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
          inputFor="phone-number"
          inputText="Phone Number"
          inputType="text"
          inputId="phone-number"
          inputName="phone-number"
        />
        <InputFIeld
          inputFor="password"
          inputText="Password"
          inputType="password"
          inputId="password"
          inputName="password"
        />
        <InputFIeld
          inputFor="confirm-password"
          inputText="Confirm Password"
          inputType="password"
          inputId="confirm-password"
          inputName="confirm-password"
        />

        <SubmitButton
          pendingText="Creating..."
          buttonText="create an account"
        />
        {/* Display feedback message */}
        <p aria-live="polite" className="sr-onl text-red-600" role="status">
          {state?.message}
        </p>
      </form>
      <div className="flex flex-col items-center gap-1 mt-3">
        <p>
          Already have an account?{" "}
          <Link href="/login" className="text-blue-700 underline">
            Login
          </Link>
        </p>
      </div>
    </>
  );
}
