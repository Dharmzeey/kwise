'use client';

import { updateUserInfo } from "@/actions/userActions";
import { EditableInputFIeld, ViewingInputField } from "@/components/interractivity/input";
import { SubmitButton } from "@/components/submitButton";
import { retrieveUserInfoApi } from "@/services/userApis";
import { UserProfileData } from "@/types/userInterfaces";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";

const initialState = {
    message: "",
};


export default function EditProfile() {
    const router = useRouter()
    const [userDetails, setUserDetails] = useState<UserProfileData | null>(null);
    const [state, formAction] = useFormState(updateUserInfo, initialState);
    useEffect(() => {
        async function fetchUserInfo() {
            const response = await retrieveUserInfoApi();
            setUserDetails(response.data)
        }
        fetchUserInfo()
    }, [])
    useEffect(() => {
        if (state.message === "Profile Updated successfully") {
            router.push("/account/profile");
        }
    }, [state, router]);

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
                    />

                    <EditableInputFIeld
                        inputFor="last-name"
                        inputText="Last Name"
                        inputType="text"
                        inputId="last-name"
                        inputName="last-name"
                        defaultValue={userDetails.last_name}
                        required
                    />

                    <EditableInputFIeld
                        inputFor="other-name"
                        inputText="Other Name"
                        inputType="text"
                        inputId="other-name"
                        inputName="other-name"
                        defaultValue={userDetails.other_name}
                    />

                    <EditableInputFIeld
                        inputFor="alternative-email"
                        inputText="Alternative Email"
                        inputType="email"
                        inputId="alternative-email"
                        inputName="alternative-email"
                        defaultValue={userDetails.alternative_email}
                    />
                    <EditableInputFIeld
                        inputFor="alternative-phone-number"
                        inputText="Alternative Phone Number"
                        inputType="text"
                        inputId="alternative-phone-number"
                        inputName="alternative-phone-number"
                        defaultValue={userDetails.alternative_phone_number}
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