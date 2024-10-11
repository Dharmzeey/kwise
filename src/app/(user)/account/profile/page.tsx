import { retrieveUserInfoApi } from "@/services/userApis";
import { UserProfileData } from "@/types/userInterfaces";


// This just displays the profile, it is server rendered
export default async function UserProfile() {
    const response = await retrieveUserInfoApi();
    const userDetails: UserProfileData = response.data
    return (
        <>
            {userDetails && (<>
                <h1>{userDetails.first_name }</h1>
            </>)}

        </>
    )
}