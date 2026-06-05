import { NextRequest, NextResponse } from "next/server";

const DJANGO = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function POST(req: NextRequest) {
  const refresh = req.cookies.get("kw_refresh")?.value;

  if (!refresh) {
    return NextResponse.json({ detail: "No refresh token." }, { status: 401 });
  }

  const django = await fetch(`${DJANGO}/api/auth/token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });

  const data = await django.json();

  if (!django.ok) {
    // Refresh token is invalid/expired — clear both cookies
    const res = NextResponse.json(data, { status: 401 });
    res.cookies.set("kw_access", "", { path: "/", maxAge: 0 });
    res.cookies.set("kw_refresh", "", { path: "/", maxAge: 0 });
    return res;
  }

  const res = NextResponse.json({ ok: true });

  res.cookies.set("kw_access", data.access, {
    httpOnly: false,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 15,
  });

  return res;
}
