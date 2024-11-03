"use client";
import { initiatePaymentApi } from "@/services/paymentApis";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Payment() {
    const router = useRouter();
    const [accessCode, setAccessCode] = useState<string | undefined>(undefined);
    const [initializing, setInitializing] = useState<boolean>(true);
    const [processing, setProcessing] = useState<boolean>(false);

    useEffect(() => {
        async function initiatePayment() {
            const response = await initiatePaymentApi();
            if (response.status === 200) {
                setAccessCode(response.data);
            } else if (response.status === 404) {
                alert("No items in cart to be paid for, keep shopping");
                router.push("/");
            }
            setInitializing(false);
            setProcessing(true);
        }
        initiatePayment();
    }, [router]);

    useEffect(() => {
        async function loadPaystackAndProcess() {
            if (accessCode !== undefined) {
                // Dynamically import PaystackPop only on the client side
                const PaystackPop = (await import("@paystack/inline-js")).default;
                const popup = new PaystackPop();
                popup.resumeTransaction(accessCode as unknown as { accessCode: string });
                setProcessing(false);
            }
        }
        loadPaystackAndProcess();
    }, [accessCode]);

    return (
        <>
            {initializing ? (
                <h1>Initializing...</h1>
            ) : processing ? (
                <h1>Processing...</h1>
            ) : (
                <b>An error occurred</b>
            )}
        </>
    );
}
