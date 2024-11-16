"use client";

import { useFormState } from "react-dom";
import { EditableInputFIeld } from "@/components/interractivity/input";
import { SubmitButton } from "@/components/submitButton";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createUserInfo } from "@/actions/userActions";
import { resendEmailVerificationApi } from "@/services/authApis";
import { ZodIssue } from "zod";

const initialState = {
    message: "",
};

export default function CreateUserProfile() {
    const pathName = usePathname();
    const router = useRouter();
    const [state, formAction] = useFormState(createUserInfo, initialState);
    const [errors, setErrors] = useState<ZodIssue[] | undefined>([]);

    useEffect(() => {
        async function verifyUser() {
            // this will send a code to the user and then they must verify
            await resendEmailVerificationApi()
            router.push("email-verification/confirm")
        }

        if (state.message === "Profile created successfully") {
            router.push("/account");
        } else if (state.status === 401) {
            // this means token is absent
            router.push(`/login?callbackUrl=${encodeURIComponent(pathName!)}`);
        } else if (state.status === 403) {
            verifyUser()    
        }
    }, [state, pathName, router]);

    useEffect(() => {
        setErrors(state.errors)
    }, [state])

    const getErrorForField = (fieldName: string) => {
        return errors?.filter((error) => error.path.includes(fieldName)).map((error) => error.message).join(', '); // Combines multiple messages if any
    };


    return (
        <>
            <h1 className="text-[372F2F] font-bold" >Basic Information</h1>
            <form action={formAction}>
                <EditableInputFIeld
                    inputFor="first-name"
                    inputText="First Name"
                    inputType="text"
                    inputId="first-name"
                    inputName="first-name"
                    required
                    error={getErrorForField('first_name')}
                />

                <EditableInputFIeld
                    inputFor="last-name"
                    inputText="Last Name"
                    inputType="text"
                    inputId="last-name"
                    inputName="last-name"
                    required
                    error={getErrorForField('last_name')}
                />

                <EditableInputFIeld
                    inputFor="other-name"
                    inputText="Other Name"
                    inputType="text"
                    inputId="other-name"
                    inputName="other-name"
                    error={getErrorForField('other_name')}
                />

                <EditableInputFIeld
                    inputFor="alternative-email"
                    inputText="Alternative Email"
                    inputType="email"
                    inputId="alternative-email"
                    inputName="alternative-email"
                    error={getErrorForField('alterative_email')}
                />
                <EditableInputFIeld
                    inputFor="alternative-phone-number"
                    inputText="Alternative Phone Number"
                    inputType="text"
                    inputId="alternative-phone-number"
                    inputName="alternative-phone-number"
                    error={getErrorForField('altervative_phone_number')}
                />

                <SubmitButton pendingText="Creating..." buttonText="CREATE PROFILE" />
                {/* Display feedback message */}
                <p
                    aria-live="polite"
                    className="sr-o text-red-600 text-center"
                    role="status"
                >
                    {state.message} {state.error}
                </p>
            </form>

        </>
    );
}
