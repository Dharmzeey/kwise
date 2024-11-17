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
    state_name?: string;
    city_town: string;
    lga: string;
    lga_name?: string;
    prominent_motor_park?: string;
    landmark_signatory_place?: string;
    address: string;
}

type UserDeliveryData = {
    use_default?: boolean;
    name?: string,
    phone_number?: string,
    state?: string,
    city_town?: string,
    lga?: string,
    address?: string,
}

type PendingOrderData = {
    id: string
    product_image: string;
    product_name: string;
    order_no: string;
    price: number;
    quantity: string;
    shipped: boolean;
    address: string;
    phone_number: string;
    estimated_delivery_date: string;
}

type CompletedOrderData = {
    id: string;
    product_image: string;
    product_name: string;
    order_no: string;
    price: number;
    quantity: string;
    delivery_date: string;
    address: string;
}

type WishlistItem = {
    id: string;
    image: string;
    name: string;
    price: number;
}

type WishlistData = {
    product: WishlistItem
}

export type { UserProfileData, UserAddressData, UserDeliveryData, PendingOrderData, CompletedOrderData, WishlistData, WishlistItem }

