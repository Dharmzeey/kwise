"use client";

import { verifyCode, verifyResetCode } from "@/actions/authActions";
import { SubmitButton } from "@/components/submitButton";
import EditableInputFIeld from "@/components/interractivity/input";
import { forgotPasswordApi, resendEmailVerificationApi } from "@/services/authApis";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { Slide, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const initialState = {
    message: "",
    token: "",
    error: "",
};

export default function ResetPasswordCode() {
    const [state, formAction] = useFormState(verifyResetCode, initialState);
    const router = useRouter();
    const [resetEmailCount, setResetEmailCount] = useState(0);
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
        if (state.message === "Password reset PIN verified successfully") {
            // Store the new reset token for the final step
            if (state.token) {
                localStorage.setItem('resetToken', state.token);
                toast.success(`${state.message}`, {
                    position: "top-center",
                    className: "my-toast",
                });
                router.push("/password/new");
            }
        }
    }, [state, router]);

    // Countdown logic for resending the reset code
    useEffect(() => {
        if (resetEmailCount > 0) {
            const timer = setTimeout(
                () => setResetEmailCount(resetEmailCount - 1),
                1000
            );
            return () => clearTimeout(timer); // Clean up the timer
        }
    }, [resetEmailCount]);

    // Handle resend password reset logic
    async function handleResendPasswordReset() {
        const response = await forgotPasswordApi({ email: resetEmail! }); // Include email in the API call bang operator becasue the resetEmail has been checked in the onclick
        if (response.message === "Email has already been verified") {
            toast.success(`${response.message}`, {
                position: "top-center",
                className: "my-toast",
            });
            router.push("/");
        } else if (response.message === "You need to login first") {
            toast.info(`${response.message}`, {
                position: "top-center",
                className: "my-toast",
            });
            router.push("/login");
        } else {
            setResetEmailCount(120); // Set timer for resend button
            toast.info(`${response.message}`, {
                position: "top-center",
                className: "my-toast",
            });
        }
    }

    return (
        <>
            <form action={formAction}>
                {/* Email PIN input */}
                <div>
                    <EditableInputFIeld
                        inputFor="email-pin"
                        inputText="Code Sent to Email"
                        inputType="text"
                        inputId="email-pin"
                        inputName="email-pin"
                        required
                    />
                    <div className="text-right">
                        <button
                            disabled={resetEmailCount > 0} // Disable button when countdown is active
                            type="button"
                            className={`text-blue-700 underline ${resetEmailCount > 0 ? "opacity-50 cursor-not-allowed" : ""
                                }`}
                            onClick={resetEmail ? handleResendPasswordReset : undefined}
                        >
                            Resend code
                        </button>
                        {resetEmailCount > 0 && <span> ({resetEmailCount} sec)</span>}{" "}
                        {/* Show countdown */}
                    </div>
                </div>

                {/* Include hidden inputs for resetEmail and resetToken */}
                <input type="hidden" name="reset-email" value={resetEmail || ""} />
                <input type="hidden" name="reset-token" value={resetToken || ""} />

                {/* Submit Button */}
                <SubmitButton pendingText="Verifying..." buttonText="verify code" />

                {/* Display feedback message */}
                <p aria-live="polite" className="sr-onl text-red-600" role="status">
                    {state?.message} {state?.error}
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
