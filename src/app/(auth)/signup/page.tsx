"use client";

import { createUser } from "@/actions/authActions";
import { EditableInputFIeld } from "@/components/interractivity/input";
import Link from "next/link";
import { SubmitButton } from "@/components/submitButton";
import { useEffect, useState, useActionState } from "react";
import { useRouter } from "next/navigation";
import { ZodIssue } from "zod";

const initialState = {
  message: "",
};

export default function SignupPage() {
  const [state, formAction] = useActionState(createUser, initialState);
  const [errors, setErrors] = useState<ZodIssue[] | undefined>([]);
  const router = useRouter();
  useEffect(() => {
    if (state.status === 201) {
      // the message will come from authApi through authAction
      router.push("/email-verification/confirm");
    }
  }, [state, router]);

  useEffect(() => {
    setErrors(state.errors)
  }, [state])

  const getErrorForField = (fieldName: string) => {
    return errors?.filter((error) => error.path.includes(fieldName)).map((error) => error.message).join(', '); // Combines multiple messages if any
  };

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
          error={getErrorForField('email')}
        />
        <EditableInputFIeld
          inputFor="phone-number"
          inputText="Phone Number"
          inputType="text"
          inputId="phone-number"
          inputName="phone-number"
          required
          error={getErrorForField('phone_number')}
        />
        <EditableInputFIeld
          inputFor="password"
          inputText="Password"
          inputType="password"
          inputId="password"
          inputName="password"
          required
          error={getErrorForField('password')}
        />
        <EditableInputFIeld
          inputFor="confirm-password"
          inputText="Confirm Password"
          inputType="password"
          inputId="confirm-password"
          inputName="confirm-password"
          required
          error={getErrorForField('confirm_password')}
        />

        <SubmitButton
          pendingText="Creating..."
          buttonText="create an account"
        />
        {/* Display feedback message */}
        <p aria-live="polite" className="sr-onl text-red-500 text-center" role="status">
          {state.error} {state.message}
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
