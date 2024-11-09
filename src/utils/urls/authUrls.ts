import { BASE_URL } from "../constants";


export const SIGNUP = `${BASE_URL}/authentication/`;
export const SEND_EMAIL_VERIFICATION = `${BASE_URL}/authentication/email-verification/`;
export const CONFIRM_EMAIL_VERIFICATION = `${BASE_URL}/authentication/email-verification/confirm/`;
export const LOGIN = `${BASE_URL}/authentication/login/`;
export const FORGOT_PASSWORD = `${BASE_URL}/authentication/password/forgot/`;
export const RESET_PASSWORD = `${BASE_URL}/authentication/password/reset/`;
export const CREATE_NEW_PASSWORD = `${BASE_URL}/authentication/password/new/`;
export const LOGOUT = `${BASE_URL}/authentication/logout/`;

export const REFRESH_TOKEN_URL = `${BASE_URL}/authentication/token/refresh/`;
export const VERIFY_TOKEN_URL = `${BASE_URL}/authentication/token/verify/`;