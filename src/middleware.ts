"use server";

import { cookies } from "next/headers";
import { NextResponse, NextRequest } from "next/server";
import { ACCESS_TOKEN_NAME, AUTHENTICATED_USER, IS_AUTHENTICATED } from "./utils/constants";


export function middleware(request: NextRequest) {
  const currentUser = request.cookies.get(AUTHENTICATED_USER)?.value

  // if (currentUser && !request.nextUrl.pathname.startsWith('/dashboard')) {
  //   return Response.redirect(new URL('/dashboard', request.url))
  // }

  // if (!currentUser && !request.nextUrl.pathname.startsWith('/login')) {
  //   return Response.redirect(new URL('/login', request.url))
  // }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}







// export async function middleware(request: NextRequest) {
//   const { pathname, origin } = request.nextUrl;
//   const cookieStore = cookies();
//   const token = cookieStore.get(ACCESS_TOKEN_NAME);
//   if (token) {
//     const requestHeaders = new Headers(request.headers);
//     requestHeaders.set("Authorization", `Bearer ${token.value}`);
//     const response = NextResponse.next({
//       request: {
//         headers: requestHeaders,
//       },
//     });
//     return response;
//   }
//   return NextResponse.redirect(`${origin}/login`);
// }

// export const config = {
//   matcher: ["/((?!login|signup|api|_next/static|_next/image|images|favicon.ico|).*)"],
// };


// include the path which should trigger the middleware
// whitelist
// orders, pro (this should not show if not logged in)