"use client";

import { useFormState } from "react-dom";
import { EditableInputFIeld, EditableSelectField, EditableTextAreaFIeld } from "@/components/interractivity/input";
import { SubmitButton } from "@/components/submitButton";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createUserAddress } from "@/actions/userActions";
import { resendEmailVerificationApi } from "@/services/authApis";
import { fetchLgasApi, fetchStatesApi } from "@/services/baseAPis";

const initialState = {
    message: "",
};

export default function CreateUserAddress() {
    const pathName = usePathname();
    const router = useRouter();
    const [formState, formAction] = useFormState(createUserAddress, initialState);
    const [states, setStates] = useState<PlaceData[]>();
    const [lgas, setLgas] = useState<PlaceData[]>();

    useEffect(() => {
        async function verifyUser() {
            // this will send a code to the user and then they must verify
            await resendEmailVerificationApi()
            router.push("/email-verification/confirm")
        }

        if (formState.status === 201) {
            router.push("/account");
        } else if (formState.status === 401) {
            // this means token is absent or login error
            router.push(`/login?callbackUrl=${encodeURIComponent(pathName!)}`);
        } else if (formState.status === 403) {
            verifyUser()
        }
    }, [formState, pathName, router]);

    useEffect(() => {
        async function fetchStates() {
            const response = await fetchStatesApi()
            if (response.status === 200) {
                setStates(response.data)
            }
        }
        fetchStates()
    }, [])

    const fetchLgas = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = event.target.value;
        if (selectedValue) {
            try {
                const response = await fetchLgasApi(selectedValue)
                if (response.status === 200) {
                    setLgas(response.data)
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
    };


    return (
        <>
            <h1 className="text-[372F2F] font-bold mb-2" >Address Information</h1>
            <form action={formAction}>
                <EditableSelectField label="State" name="state" id="state" data={states} handleStateChange={fetchLgas} />
                <EditableInputFIeld
                    inputFor="city-town"
                    inputText="City / Town"
                    inputType="text"
                    inputId="city-town"
                    inputName="city-town"
                    required
                />
                <EditableSelectField label="Local Government Area" name="lga" id="lga" data={lgas} />

                <EditableInputFIeld
                    inputFor="prominent-motor-park"
                    inputText="Prominent Motor Park"
                    inputType="text"
                    inputId="prominent-motor-park"
                    inputName="prominent-motor-park"
                />
                <EditableInputFIeld
                    inputFor="landmark-signatory-place"
                    inputText="Landmark / Signatory place (for non park delivery)"
                    inputType="text"
                    inputId="landmark-signatory-place"
                    inputName="landmark-signatory-place"
                />
                <EditableTextAreaFIeld
                    inputFor="address"
                    inputText="Address"
                    inputId="address"
                    inputName="address"
                    required
                />

                <SubmitButton pendingText="Adding..." buttonText="ADD ADDRESS" />
                {/* Display feedback message */}
                <p
                    aria-live="polite"
                    className="sr-o text-red-600 text-center"
                    role="status"
                >
                    {formState.message} {formState.error}
                </p>
            </form>

        </>
    );
}
