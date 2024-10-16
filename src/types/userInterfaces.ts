type UserProfileData = {
    first_name: string;
    last_name: string;
    other_name?: string;
    email?: string;
    phone_number?: string;
    alternative_email?: string;
    alternative_phone_number?: string;
}

type UserAddressData = {
    state: string;
    state_name: string;
    city_town: string;
    lga: string;
    lga_name: string;
    prominent_motor_park?: string;
    landmark_signatory_place?: string;
    address: string;
}

export type { UserProfileData, UserAddressData}

