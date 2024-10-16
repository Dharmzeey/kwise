// utils/authFetch.ts

import { cookies } from 'next/headers';
import { ACCESS_TOKEN_NAME, REFRESH_TOKEN_NAME } from './constants';
import { REFRESH_TOKEN_URL, VERIFY_TOKEN_URL } from './urls/authUrls';
import { handleAccessToken } from './cookieUtils';


async function refreshTokenFn(refreshToken: string): Promise<string> {
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
    } else {
        throw new Error('Failed to refresh token');
    }
}

export async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
    const cookieStore = cookies();
    let accessToken = cookieStore.get(ACCESS_TOKEN_NAME)?.value;
    const refreshToken = cookieStore.get(REFRESH_TOKEN_NAME)?.value;

    if (!accessToken || !refreshToken) {
        console.log('dddd')
        throw new Error('No authentication tokens found');
    }

    // Verify the access token
    const tokenResponse = await fetch(VERIFY_TOKEN_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: accessToken }),
    });

    if (tokenResponse.status === 401) {
        try {
            accessToken = await refreshTokenFn(refreshToken);
            console.log(cookieStore.delete(ACCESS_TOKEN_NAME))
            handleAccessToken(accessToken)
        } catch (error) {
            console.error('Token refresh failed: \n', error);
            throw new Error('Authentication failed');
        }
    }

    // Set up headers for the main request
    const headers = new Headers(options.headers || {});
    headers.set('Authorization', `Bearer ${accessToken}`);
    console.log(accessToken)

    // Make the main request
    const response = await fetch(url, { ...options, headers });
    // If the main request fails due to authentication, we could try refreshing the token again
    if (response.status === 401) {
        try {
            accessToken = await refreshTokenFn(refreshToken);
            cookieStore.set(ACCESS_TOKEN_NAME, accessToken, { httpOnly: true, secure: true });

            headers.set('Authorization', `Bearer ${accessToken}`);
            return fetch(url, { ...options, headers });
        } catch (error) {
            console.error('Token refresh failed:', error);
            throw new Error('Authentication failed');
        }
    }

    return response;
}