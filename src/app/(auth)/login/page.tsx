"use client";

import { loginUser } from "@/actions/authActions";
import { EditableInputFIeld } from "@/components/interractivity/input";
import Link from "next/link";
import { SubmitButton } from "@/components/submitButton";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useActionState } from "react";
import { ZodIssue } from "zod";

const initialState = {
  message: "",
};

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryParams = searchParams!.get("callbackUrl");
  const [state, formAction] = useActionState(loginUser, initialState);
  const [errors, setErrors] = useState<ZodIssue[] | undefined>([]);
  useEffect(() => {
    if (state.status === 200) {
      // the status will come from authApi through authAction
      if (searchParams && queryParams) {
        router.push(queryParams)
      } else {
        router.push("/");
      }
    }
  }, [state, queryParams, router, searchParams]);

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
          inputFor="password"
          inputText="Password"
          inputType="password"
          inputId="password"
          inputName="password"
          required
          error={getErrorForField('password')}
        />

        <SubmitButton pendingText="Logging in..." buttonText="LOGIN" />
        {/* Display feedback message */}
        <p
          aria-live="polite"
          className="sr-o text-red-600 text-center"
          role="status"
        >
          {state.error} {state.message}
        </p>
      </form>
      <div className="flex flex-col items-center gap-1 mt-3">
        <div className="flex gap-3">
          <p>Don&rsquo;t have an account? </p>
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
