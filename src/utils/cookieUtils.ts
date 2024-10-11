"use server"

import { cookies } from "next/headers";
import { ACCESS_TOKEN_NAME, AUTHENTICATED_USER, MAX_AGE, REFRESH_TOKEN_NAME } from "./constants";


function handleAccessToken(token: string) {
    cookies().set({
        name: ACCESS_TOKEN_NAME,
        value: token,
        httpOnly: true,
        // secure: process.env.NODE_ENV === "production",
        secure: true,
        maxAge: MAX_AGE,
        path: "/",
    });
}

function handleRefreshToken(token: string) {
    cookies().set({
        name: REFRESH_TOKEN_NAME,
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: MAX_AGE,
        path: "/",
    });
    saveAthenticatedUser("U_I_U") // User is AUthenticated, I will change later
}


function saveAthenticatedUser(token: string) {
    cookies().set({
        name: AUTHENTICATED_USER,
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: MAX_AGE,
        path: "/",
    });
}

function fetchAccessTokenCookie() {
    const cookieStore = cookies();
    return cookieStore.get(ACCESS_TOKEN_NAME);
}

function fetchAuthenticatedUser() {
    const cookieStore = cookies();
    return cookieStore.get(AUTHENTICATED_USER)?.value || null;
}


function removeAllTokens() {
    const cookieStore = cookies();
    cookieStore.delete(ACCESS_TOKEN_NAME)
    cookieStore.delete(REFRESH_TOKEN_NAME)
    cookieStore.delete(AUTHENTICATED_USER)
}
export {handleAccessToken, handleRefreshToken, fetchAccessTokenCookie, fetchAuthenticatedUser, removeAllTokens}