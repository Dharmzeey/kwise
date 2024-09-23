"use client";

import { verifyCode } from "@/actions/authActions";
import { SubmitButton } from "@/components/button";
import InputFIeld from "@/components/interractivity/input";
import { useFormState } from "react-dom";

const initialState = {
  message: "",
};

export default function EmailVerification() {
  const [state, formAction] = useFormState(verifyCode, initialState);
  return (
    <>
      <form action={formAction}>
        <InputFIeld
          inputFor="email-pin"
          inputText="Code Sent to Email"
          inputType="text"
          inputId="email-pin"
          inputName="email-pin"
        />

        <InputFIeld
          inputFor="phone-pin"
          inputText="Code Sent to Phone Number"
          inputType="text"
          inputId="phone-pin"
          inputName="phone-pin"
        />
        <SubmitButton pendingText="Verifying..." buttonText="verify code" />
        {/* Display feedback message */}
        <p aria-live="polite" className="sr-onl text-red-600" role="status">
          {state?.message}
        </p>
      </form>
    </>
  );
}
