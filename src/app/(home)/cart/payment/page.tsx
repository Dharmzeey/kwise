'use client';
import { initiatePaymentApi } from "@/services/paymentApis";
import PaystackPop from '@paystack/inline-js';
import { useEffect, useState } from "react"

export default function Payment() {
    const [accessCode, setAccessCode] = useState<string | undefined>(undefined);
    const [initializing, setInitializating] = useState<boolean>(true);
    const [processing, setProcessing] = useState<boolean>(false);
    useEffect(() => {
        async function initiatePayment() {
            const response = await initiatePaymentApi()
            if (response.status === 200) {
                setAccessCode(response.data)
                setInitializating(false)
                setProcessing(true)
            }
            setInitializating(false)
            setProcessing(true)
        }
        initiatePayment()
    }, [])
    useEffect(() => {
        if (accessCode !== undefined) {
            const popup = new PaystackPop()
            popup.resumeTransaction(accessCode as unknown as { accessCode: string });
            setProcessing(false)
        }
    }, [accessCode])
    return (
        <>
            {
                initializing
                    ?
                    <>
                        <h1>Initializing...</h1>
                    </>
                    :
                    processing ?
                        <>
                            <h1>Processing...</h1>
                        </>
                        :
                        <>
                            <b>An error occured</b>
                        </>
            }
        </>
    )
}