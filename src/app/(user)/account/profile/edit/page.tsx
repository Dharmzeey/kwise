'use client';

import { updateUserInfo } from "@/actions/userActions";
import { EditableInputFIeld } from "@/components/interractivity/input";
import { SubmitButton } from "@/components/submitButton";
import { retrieveUserInfoApi } from "@/services/userApis";
import { UserProfileData } from "@/types/userInterfaces";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useActionState } from "react";
import { ZodIssue } from "zod";

const initialState = {
    message: "",
};


export default function EditProfile() {
    const pathName = usePathname();
    const router = useRouter()
    const [userDetails, setUserDetails] = useState<UserProfileData | null>(null);
    const [state, formAction] = useActionState(updateUserInfo, initialState);
    const [errors, setErrors] = useState<ZodIssue[] | undefined>([]);
    useEffect(() => {
        async function fetchUserInfo() {
            const response = await retrieveUserInfoApi();
            setUserDetails(response.data)
        }
        fetchUserInfo()
    }, [])
    
    useEffect(() => {
        if (state.status === 200) {
            router.push("/account/profile");
        } else if (state.status === 401) {
            router.push(`/login?callbackUrl=${encodeURIComponent(pathName!)}`);
        }
    }, [state, router, pathName]);

    useEffect(() => {
        setErrors(state.errors)
    }, [state])

    const getErrorForField = (fieldName: string) => {
        return errors?.filter((error) => error.path.includes(fieldName)).map((error) => error.message).join(', '); // Combines multiple messages if any
    };


    return (
        <>
            {userDetails != null && (<>
                <h1 className="text-[372F2F] font-bold" >Edit Basic Information</h1>
                <form action={formAction}>
                    <EditableInputFIeld
                        inputFor="first-name"
                        inputText="First Name"
                        inputType="text"
                        inputId="first-name"
                        inputName="first-name"
                        defaultValue={userDetails.first_name}
                        required
                        error={getErrorForField('first_name')}
                    />

                    <EditableInputFIeld
                        inputFor="last-name"
                        inputText="Last Name"
                        inputType="text"
                        inputId="last-name"
                        inputName="last-name"
                        defaultValue={userDetails.last_name}
                        required
                        error={getErrorForField('last_name')}
                    />

                    <EditableInputFIeld
                        inputFor="other-name"
                        inputText="Other Name"
                        inputType="text"
                        inputId="other-name"
                        inputName="other-name"
                        defaultValue={userDetails.other_name}
                        error={getErrorForField('other_name')}
                    />

                    <EditableInputFIeld
                        inputFor="alternative-email"
                        inputText="Alternative Email"
                        inputType="email"
                        inputId="alternative-email"
                        inputName="alternative-email"
                        defaultValue={userDetails.alternative_email}
                        error={getErrorForField('alternative_email')}
                    />
                    <EditableInputFIeld
                        inputFor="alternative-phone-number"
                        inputText="Alternative Phone Number"
                        inputType="text"
                        inputId="alternative-phone-number"
                        inputName="alternative-phone-number"
                        defaultValue={userDetails.alternative_phone_number}
                        error={getErrorForField('alternative_phone_number')}
                    />
                    <SubmitButton pendingText="Updating..." buttonText="UPDATE PROFILE" />
                    {/* Display feedback message */}
                    <p
                        aria-live="polite"
                        className="sr-o text-red-600 text-center"
                        role="status"
                    >
                        {state.message} {state.error}
                    </p>
                </form>

            </>)}

        </>
    )
}