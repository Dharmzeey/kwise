'use client';

import { createNewPassword } from "@/actions/authActions";
import { SubmitButton } from "@/components/submitButton";
import { EditableInputFIeld } from "@/components/interractivity/input";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { toast, ToastContainer, Slide } from "react-toastify";
import { ZodIssue } from "zod";

const initialState = {
    message: "",
};


export default function CreateNewPassword() {
    const [state, formAction] = useFormState(createNewPassword, initialState);
    const router = useRouter()
    const [errors, setErrors] = useState<ZodIssue[] | undefined>([]);
    const [resetEmail, setResetEmail] = useState<string | null>(null);
    const [resetToken, setResetToken] = useState<string | null>(null);

    useEffect(() => {
        // Check if the reset data exist
        const email = localStorage.getItem('resetEmail');
        const token = localStorage.getItem('resetToken');

        if (!email || !token) {
            // Redirect back to forgot password if data is missing
            router.push('/password/forgot');
            return;
        }

        // Set localStorage values into state
        setResetEmail(email);
        setResetToken(token);
    }, [router]);


    useEffect(() => {
        if (state.status === 200) {
            // removes both email and token in localStorage
            localStorage.removeItem('resetEmail');
            localStorage.removeItem('resetToken');

            toast.success(`${state.message}`, {
                position: "top-center",
                className: "my-toast",
            });

            router.push("/login");
        }
        else if (state.error === "Password reset session expired or invalid") {
            // I need to wait a second or 2 here so as to show the prompt
            router.push("/password/forgot")
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
                    inputFor="password"
                    inputText="New Password"
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
                    error={getErrorForField('password')}
                />
                {/* Include hidden inputs for resetEmail and resetToken */}
                <input type="hidden" name="reset-email" value={resetEmail || ""} />
                <input type="hidden" name="reset-token" value={resetToken || ""} />

                <SubmitButton pendingText="Processing..." buttonText="CHANGE PASSWORD" />
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
    )
}