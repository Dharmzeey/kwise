'use client';

import { ActionButton } from "@/components/actionComponents";
import { ViewingInputField } from "@/components/interractivity/input";
import { retrieveUserInfoApi } from "@/services/userApis";
import { UserProfileData } from "@/types/userInterfaces";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


// This just displays the profile, it is server rendered
export default function UserProfile() {
    const router = useRouter()
    const [userDetails, setUserDetails] = useState<UserProfileData | null>(null);
    useEffect(() => {
        async function fetchUserInfo() {
            const response = await retrieveUserInfoApi();
            if (response.status === 404) {
                alert("You have not filled you information")
                router.push('/account/profile/create')
            }
            setUserDetails(response.data)
        }
        fetchUserInfo()
    }, [])
    const handleEditProfileClick = async () => {
        router.push('/account/profile/edit');
    }

    return (
        <>
            {userDetails != null && (<>
                <h1 className="font-bold mb-2 text-secondary-gray-color">Basic Information</h1>
                <ViewingInputField heading="First Name" text={userDetails.first_name} />
                <ViewingInputField heading="Last Name" text={userDetails.last_name} />
                <ViewingInputField heading="Middle Name" text={userDetails.other_name || ''} />
                <ViewingInputField heading="Email Address" text={userDetails.email || ''} />
                <ViewingInputField heading="Alternative Email Address" text={userDetails.alternative_email || ''} />
                <ViewingInputField heading="Phone Number" text={userDetails.phone_number || ''} />
                <ViewingInputField heading="Alternative Phone Number" text={userDetails.alternative_phone_number || ''} />
                <div className="flex flex-col justify-center items-center">
                    <ActionButton buttonText="EDIT PROFILE" buttonBgColor="bg-main-color" onClickFn={handleEditProfileClick} />
                </div>

            </>)}

        </>
    )
}