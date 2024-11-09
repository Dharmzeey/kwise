"use server";

import { NextRequest, NextResponse } from 'next/server';
import { ACCESS_TOKEN_NAME, ACCESS_TOKEN_MAX_AGE, REFRESH_TOKEN_NAME } from './utils/constants';
import { REFRESH_TOKEN_URL, VERIFY_TOKEN_URL } from './utils/urls/authUrls';

async function refreshTokenFn(refreshToken: string, baseUrl: string, pathName: string) {
    const response = await fetch(REFRESH_TOKEN_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken }),
    });

    if (response.ok) {
        const data = await response.json();
        return data.access;
    }
    else if (response.status === 401) {
        // This means the refresh token is also now invalid, then the user is sent to login
        return NextResponse.redirect(new URL(`/login?callbackUrl=${encodeURIComponent(pathName!)}`, baseUrl));
    }
    else {
        const data = await response.json();
        throw new Error('Failed to refresh token');
    }
}

async function setNewAccessToken(newAccessToken: string) {
    const response = NextResponse.next()
    response.cookies.set(
        {
            name: ACCESS_TOKEN_NAME,
            value: newAccessToken,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: ACCESS_TOKEN_MAX_AGE,
            path: "/",
        }
    );
    return response
}

export async function middleware(request: NextRequest) {
    const accessToken = request.cookies.get(ACCESS_TOKEN_NAME)?.value;
    const refreshToken = request.cookies.get(REFRESH_TOKEN_NAME)?.value;
    const currentPath = request.nextUrl.pathname

    if (currentPath === "/") {
        return
    }

    if (!refreshToken) {
        // Redirect to login if refresh tokens missing
        return NextResponse.redirect(new URL(`/login?callbackUrl=${encodeURIComponent(currentPath!)}`, request.url));
    }

    if (accessToken === undefined) {
        // if access token is missing but refresh is intact
        const newAccessToken = await refreshTokenFn(refreshToken, request.url, currentPath);
        return setNewAccessToken(newAccessToken)
    }
    // first verify the access token
    const tokenResponse = await fetch(VERIFY_TOKEN_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ token: accessToken })
    })
    if (tokenResponse.status === 401) {
        const newAccessToken = await refreshTokenFn(refreshToken, request.url, currentPath);
        return setNewAccessToken(newAccessToken)
    }
}

const handleAuthError = async () => {
    try {
        // Attempt to refresh token
        const newToken = await refreshTokenFn();

        // Retry the action with updated token
        formAction({
            ...verifyCode,
            headers: { Authorization: `Bearer ${newToken}` },
        });
    } catch (error) {
        console.error("Retry failed after refresh attempt");
        // Handle failure (e.g., redirect to login)
    }
};