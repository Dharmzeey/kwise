'use client';

import { ActionButton } from "@/components/actionButton";
import { resendEmailVerificationApi } from "@/services/authApis";
import { verifyUserInfoApi } from "@/services/userApis";
import { usePathname, useRouter } from "next/navigation";

export default function AccountPage() {
    const pathName = usePathname();
    const router = useRouter();

    const handleBasicInfoClick = async () => {
        const response = await verifyUserInfoApi();
        if (response.status === 200) {
            router.push("/account/profile");
        }
        else if (response.status === 404) {
            router.push("/account/profile/create");
        } else if (response.status === 401) {
            router.push(`/login?callbackUrl=${encodeURIComponent(pathName!)}`);
        } else if (response.status === 403) {
            // this will send a code to the user and then they must verify
            await resendEmailVerificationApi()
            alert("You need to verify your email first")
            router.push("email-verification/confirm")
        }
    }


    const handleAddressInfoClick = async () => {
        const response = await verifyUserInfoApi();
        if (response.status === 200) {
            router.push("/account/address");
        }
        else if (response.status === 404) {
            router.push("/account/address/create");
        } else if (response.status === 401) {
            router.push(`/login?callbackUrl=${encodeURIComponent(pathName!)}`);
        } else if (response.status === 403) {
            // this will send a code to the user and then they must verify
            await resendEmailVerificationApi()
            alert("You need to verify your email first")
            router.push("/email-verification/confirm")
        }
    }
    return (
        <>
            <div className="flex flex-col justify-center items-center gap-1 h-[70vh]">
                <ActionButton buttonText="BASIC INFORMATION" buttonBgColor="bg-main-color" onClickFn={handleBasicInfoClick} />
                <ActionButton buttonText="ADDRESS INFORMATION" buttonBgColor="bg-main-color" onClickFn={handleAddressInfoClick} />
                <ActionButton buttonText="DELETE ACCOUNT" buttonBgColor="bg-[#f00]" onClickFn={handleBasicInfoClick} />
            </div>
        </>
    )
}