"use server";

import { NextRequest, NextResponse } from 'next/server';
import { ACCESS_TOKEN_NAME, ACCESS_TOKEN_MAX_AGE, REFRESH_TOKEN_NAME } from './utils/constants';
import { REFRESH_TOKEN_URL, VERIFY_TOKEN_URL } from './utils/urls/authUrls';
import { handleAccessToken } from './utils/cookieUtils';

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
    NextResponse.redirect(new URL(`/login?callbackUrl=${encodeURIComponent(pathName!)}`, baseUrl));
    return
  }
  else {
    const data = await response.json();
    throw new Error('Failed to refresh token');
  }
}

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get(ACCESS_TOKEN_NAME)?.value;
  const refreshToken = request.cookies.get(REFRESH_TOKEN_NAME)?.value;
  const currentPath = request.nextUrl.pathname

  if (!accessToken || !refreshToken) {
    // Redirect to login if tokens are missing
    return NextResponse.redirect(new URL(`/login?callbackUrl=${encodeURIComponent(currentPath!)}`, request.url));
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
    // Update the access token in the cookie
  }
  // Create a new response with the updated headers
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('Authorization', `Bearer ${accessToken}`);
  // const response = NextResponse.next({
  //   request: {
  //     headers: requestHeaders,
  //   },
  // });
  // return response;
}

export const config = {
  matcher: ['/((?!api|login|_next/static|_next/image|images|favicon.ico|.*\\.png$).*)'],
}
// export const config = {
//   matcher: ["/((?!login|signup|api|_next/static|_next/image|images|favicon.ico|).*)"],
// };








// // export const config = {
// //   matcher: ["/((?!login|signup|api|_next/static|_next/image|images|favicon.ico|).*)"],
// // };


// // include the path which should trigger the middleware
// // whitelist
// // orders, pro (this should not show if not logged in)