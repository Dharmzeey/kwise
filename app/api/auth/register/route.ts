import { NextRequest, NextResponse } from "next/server";

const DJANGO = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const django = await fetch(`${DJANGO}/api/auth/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await django.json();

  if (!django.ok) {
    return NextResponse.json(data, { status: django.status });
  }

  const { tokens, user } = data;
  const res = NextResponse.json({ user }, { status: 201 });

  res.cookies.set("kw_access", tokens.access, {
    httpOnly: false,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 15,
  });

  res.cookies.set("kw_refresh", tokens.refresh, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  res.cookies.set("kw_has_refresh", "1", {
    httpOnly: false,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return res;
}
