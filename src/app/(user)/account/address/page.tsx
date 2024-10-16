'use client';

import { ActionButton } from "@/components/actionButton";
import { ViewingInputField } from "@/components/interractivity/input";
import { retrieveUserAddressApi, retrieveUserInfoApi } from "@/services/userApis";
import { UserAddressData, UserProfileData } from "@/types/userInterfaces";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


// This just displays the profile, it is server rendered
export default function UserAddress() {
    const router = useRouter()
    const [userAddress, setUserAddress] = useState<UserAddressData | null>(null);
    useEffect(() => {
        async function fetchUserAddress() {
            const response = await retrieveUserAddressApi();
            if (response.status === 404) {
                alert("You have not filled you address information")
                router.push('/account/address/create')
            }
            setUserAddress(response.data)
        }
        fetchUserAddress()
    }, [])
    
    const handleEditAddressClick = async () => {
        router.push('/account/address/edit');
    }

    return (
        <>
            {userAddress != null && (<>
                <h1 className="font-bold mb-2 text-secondary-gray-color">Address Information</h1>
                <ViewingInputField heading="State" text={userAddress.state_name} />
                <ViewingInputField heading="City / Town" text={userAddress.city_town} />
                <ViewingInputField heading="Local Government Area" text={userAddress.lga_name} />
                <ViewingInputField heading="Prominent Motor Park" text={userAddress.prominent_motor_park || ''} />
                <ViewingInputField heading="Landmark / Signatory place (for non park delivery)" text={userAddress.landmark_signatory_place || ''} />
                <ViewingInputField heading="Address" text={userAddress.address} />
                <div className="flex flex-col justify-center items-center">
                    <ActionButton buttonText="EDIT ADDRESS" buttonBgColor="bg-main-color" onClickFn={handleEditAddressClick} />
                </div>

            </>)}

        </>
    )
}