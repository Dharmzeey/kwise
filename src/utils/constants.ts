export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const ACCESS_TOKEN_NAME = "kw_user_token"; // access token
export const IS_AUTHENTICATED = true;
export const ACCESS_TOKEN_MAX_AGE = 60 * 60 * 24 * 14; // 14 days
export const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 30; // 1 day
export const SESSION_TOKEN_MAX_AGE = 60 * 60 * 24 * 14; // 14 days

export const SESSION_ID = "sessionid";