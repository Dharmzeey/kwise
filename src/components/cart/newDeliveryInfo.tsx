import { fetchStatesApi, fetchLgasApi } from "@/services/baseAPis";
import { useState, useEffect } from "react";
import { useFormState } from "react-dom";
import { EditableInputFIeld, EditableSelectField, EditableTextAreaFIeld } from "../interractivity/input";
import { SubmitButton } from "../submitButton";
import { useNewDeliveryInfo } from "@/actions/cartActions";
import { useRouter } from "next/navigation";
import { numberWithCommas } from "@/utils/filter";

const initialState = {
    message: "",
};

type NewDeliveryProp = {
    updateGrandTotalPrice: (deliveryFee: string) => void
}

export default function NewDeliveryInfo(
    prop: NewDeliveryProp
) {
    const router = useRouter()
    const [formState, formAction] = useFormState(useNewDeliveryInfo, initialState);
    const [states, setStates] = useState<PlaceData[]>();
    const [lgas, setLgas] = useState<LgaData[]>();
    const [deliveryFee, setDeliveryFee] = useState<number>();
    const [deliveryDays, setDeliveryDays] = useState<number>();

    useEffect(() => {
        async function fetchStates() {
            const response = await fetchStatesApi()
            if (response.status === 200) {
                setStates(response.data)
            }
        }
        fetchStates()
    }, [router])

    const fetchLgas = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = event.target.value;
        if (selectedValue) {
            try {
                const response = await fetchLgasApi(selectedValue)
                if (response.status === 200) {
                    setLgas(response.data)
                    setDeliveryFee(undefined)
                    setDeliveryDays(undefined)
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
    };

    const handleDeliveryFee = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = event.target.value;
        const fee = lgas?.find((val) => val.id == selectedValue)
        setDeliveryFee(fee?.delivery_fee)
        setDeliveryDays(fee?.delivery_days)
        prop.updateGrandTotalPrice(fee?.delivery_fee?.toString() ?? '0')
    }

    useEffect(() => {
        if (formState.status === 200) {
            router.push("/cart/payment");
        }
    }, [formState, router]);

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
                <EditableSelectField label="Local Government Area" name="lga" id="lga" data={lgas} handleStateChange={handleDeliveryFee} />
                {deliveryFee &&
                    <>
                        <div className="text-lg">
                            <b>Delivery Fee: ₦ {numberWithCommas(deliveryFee)}</b>
                        </div>
                        <div>You will receive your item in {deliveryDays} days</div>
                    </>}
                <EditableInputFIeld
                    inputFor="prominent-motor-park"
                    inputText="Prominent Motor Park"
                    inputType="text"
                    inputId="prominent-motor-park"
                    inputName="prominent-motor-park"
                    required
                />
                <EditableInputFIeld
                    inputFor="landmark-signatory-place"
                    inputText="Landmark / Signatory place (for non park delivery)"
                    inputType="text"
                    inputId="landmark-signatory-place"
                    inputName="landmark-signatory-place"
                    required
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
                    <SubmitButton pendingText="Processing..." buttonText="PROCEED TO PAYMENT" />
                </div>
            </form>
        </>
    )
}