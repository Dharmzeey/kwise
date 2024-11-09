import { BASE_URL } from "../constants";

// users
export const VERIFY_USER_INFO = `${BASE_URL}/users/verify/`;
export const ADD_USER_INFO = `${BASE_URL}/users/info/`;
export const RETRIEVE_USER_INFO = `${BASE_URL}/users/info/retrieve/`;
export const UPDATE_USER_INFO = `${BASE_URL}/users/info/update/`;
export const DELETE_USER_INFO = `${BASE_URL}/users/info/delete/`;

// address
export const VERIFY_USER_ADDRESS = `${BASE_URL}/users/addrerss/verify/`;
export const ADD_USER_ADDRESS = `${BASE_URL}/users/address/`;
export const RETRIEVE_USER_ADDRESS = `${BASE_URL}/users/address/retrieve/`;
export const UPDATE_USER_ADDRESS = `${BASE_URL}/users/address/update/`;

// orders
export const GET_PENDING_ORDERS = `${BASE_URL}/users/orders/pending/`;
export const GET_COMPLETED_ORDERS = `${BASE_URL}/users/orders/completed/`;