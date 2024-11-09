import { BASE_URL } from "../constants";

export const GET_CART_ITEM_QUANTITY_URL = (product_id: string) => `${BASE_URL}/cart/cart-item-quantity/?q=${product_id}`;
export const ADD_TO_CART_URL = `${BASE_URL}/cart/modify/`;
export const FETCH_CART_URL = `${BASE_URL}/cart/`;
export const CHECKOUT_URL = `${BASE_URL}/cart/checkout/`;
export const CHECKOUT_DETAILS_URL = `${BASE_URL}/cart/checkout-details/`;
export const ORDER_ADDRESS_SUMMARY_URL = `${BASE_URL}/cart/summary/`;

