import { Product } from "./productInterfaces";


type CartData = {
    quantity: number;
    price: string;
    product: Product;
    total_price: string;

}


type CheckoutItemsData = {
    cart_item_id: string,
    cart_item_name: string,
    cart_item_quantity: number,
    cart_item_price: number
}


type CheckoutDetails = {
    name: string,
    place: string,
    address: string,
    phone_number: string,
    alternative_phone_number: string,
}
    
export type { CartData, CheckoutItemsData, CheckoutDetails }