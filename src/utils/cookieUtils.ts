"use server"

import { cookies } from "next/headers";
import { ACCESS_TOKEN_NAME, AUTHENTICATED_USER, ACCESS_TOKEN_MAX_AGE, REFRESH_TOKEN_NAME, REFRESH_TOKEN_MAX_AGE, SESSION_ID, SESSION_TOKEN_MAX_AGE } from "./constants";


function handleAccessToken(token: string) {
    cookies().set({
        name: ACCESS_TOKEN_NAME,
        value: token,
        httpOnly: true,
        // secure: process.env.NODE_ENV === "production",
        secure: true,
        maxAge: ACCESS_TOKEN_MAX_AGE,
        path: "/",
    });
}

function handleRefreshToken(token: string) {
    cookies().set({
        name: REFRESH_TOKEN_NAME,
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: REFRESH_TOKEN_MAX_AGE,
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
        maxAge: ACCESS_TOKEN_MAX_AGE,
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

function setSessionId(session_token: string) {
    if (!session_token) return // if that BE does not send cookie, just move
    const extracted_token = session_token.split("=")[1].split(";")[0] // this line extract just the token from the returned {sessionid=in4jrn9rhtk9wgim3up77l4lrm7m5uyq; expires=Mon, 11 Nov 2024 20:03:37 GMT; HttpOnly; Max-Age=1209600; Path=/; SameSite=Lax}
    cookies().set({
        name: SESSION_ID,
        value: extracted_token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: SESSION_TOKEN_MAX_AGE,
        path: "/",
    });
}

function getSessionId() {
    const cookieStore = cookies();
    return cookieStore.get(SESSION_ID)?.value || null;
}

export { handleAccessToken, handleRefreshToken, fetchAccessTokenCookie, fetchAuthenticatedUser, removeAllTokens, setSessionId, getSessionId }