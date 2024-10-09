"use client";

import { forgotPassword } from "@/actions/authActions";
import { SubmitButton } from "@/components/button";
import InputFIeld from "@/components/interractivity/input";
import { ApiResponse } from "@/types/apiResponse";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { Slide, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const initialState: ApiResponse = {
  message: "",
  token: "",
  error: "",
};

export default function ForgotPassword() {
  const [state, formAction] = useFormState(forgotPassword, initialState);
  const [email, setEmail] = useState(""); 
  const router = useRouter()
  useEffect(() => {
    if (state.message === "Password reset PIN sent to email") {
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
          inputValue={email} 
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
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
        limit={1}
        autoClose={2000}
        transition={Slide}
        closeOnClick
      />
    </>
  );
}
