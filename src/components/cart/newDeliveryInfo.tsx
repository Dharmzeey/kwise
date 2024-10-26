import { fetchStatesApi, fetchLgasApi } from "@/services/baseAPis";
import { useState, useEffect } from "react";
import { useFormState } from "react-dom";
import { EditableInputFIeld, EditableSelectField, EditableTextAreaFIeld } from "../interractivity/input";
import { ActionButton, ActionLink } from "../actionComponents";
import { SubmitButton } from "../submitButton";
import { useNewDeliveryInfo } from "@/actions/cartActions";
import { useRouter } from "next/navigation";

const initialState = {
    message: "",
};

export default function NewDeliveryInfo() {
    const router = useRouter()
    const [formState, formAction] = useFormState(useNewDeliveryInfo, initialState);
    const [states, setStates] = useState<PlaceData[]>();
    const [lgas, setLgas] = useState<PlaceData[]>();

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

    useEffect(() => {
        if (formState.status === 200) {
            router.push("/cart/payment");
        }
    }, [formState]);

    return (
        <>
            <form action={formAction}>
                <EditableInputFIeld
                    inputFor="name"
                    inputText="Name"
                    inputType="text"
                    inputId="name"
                    inputName="name"
                    required
                />
                <EditableInputFIeld
                    inputFor="phone-number"
                    inputText="Phone Number"
                    inputType="text"
                    inputId="phone-number"
                    inputName="phone-number"
                />
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
                {formState.message} {formState.error}

                <div className="flex flex-col justify-center items-center gap-1 mb-2">
                    <SubmitButton pendingText="Processing..." buttonText="PROCEED TO SUMMARY" />
                </div>
            </form>
        </>
    )
}