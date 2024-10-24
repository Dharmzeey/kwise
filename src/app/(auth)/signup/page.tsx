"use client";

import { createUser } from "@/actions/authActions";
import { useFormState } from "react-dom";
import { EditableInputFIeld } from "@/components/interractivity/input";
import Link from "next/link";
import { SubmitButton } from "@/components/submitButton";
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
        <EditableInputFIeld
          inputFor="email"
          inputText="Email"
          inputType="email"
          inputId="email"
          inputName="email"
          required
        />
        <EditableInputFIeld
          inputFor="phone-number"
          inputText="Phone Number"
          inputType="text"
          inputId="phone-number"
          inputName="phone-number"
          required
        />
        <EditableInputFIeld
          inputFor="password"
          inputText="Password"
          inputType="password"
          inputId="password"
          inputName="password"
          required
        />
        <EditableInputFIeld
          inputFor="confirm-password"
          inputText="Confirm Password"
          inputType="password"
          inputId="confirm-password"
          inputName="confirm-password"
          required
        />

        <SubmitButton
          pendingText="Creating..."
          buttonText="create an account"
        />
        {/* Display feedback message */}
        <p aria-live="polite" className="sr-onl text-red-600" role="status">
          {state.message} {state.error}
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
