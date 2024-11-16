"use client";

import { forgotPassword } from "@/actions/authActions";
import { SubmitButton } from "@/components/submitButton";
import { EditableInputFIeld } from "@/components/interractivity/input";
import { ApiResponse } from "@/types/apiResponse";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { Slide, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ZodIssue } from "zod";

const initialState = {
  message: "",
};

export default function ForgotPassword() {
  const [state, formAction] = useFormState(forgotPassword, initialState);
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<ZodIssue[] | undefined>([]);
  const router = useRouter()
  useEffect(() => {
    if (state.status === 200) {
      // Store both email and token in localStorage
      if (state.token) {
        localStorage.setItem('resetEmail', email);
        localStorage.setItem('resetToken', state.token);

        toast.success(`${state.message}`, {
          position: "top-center",
          className: "my-toast",
        });

        router.push("/password/reset");
      }
    }
  }, [state, router, email]);

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
          inputValue={email}
          required
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          error={getErrorForField('email')}
        />

        <SubmitButton pendingText="Processing..." buttonText="GET RESET CODE" />
        {/* Display feedback message */}
        <p
          aria-live="polite"
          className="sr-onl text-red-600 text-center"
          role="status"
        >
          {state.message} {state.error}
        </p>
      </form>
      <ToastContainer
        limit={5}
        autoClose={2000}
        transition={Slide}
        closeOnClick
      />
    </>
  );
}
