import type { Metadata } from "next";
import AuthClient from "../AuthClient";

export const metadata: Metadata = {
  title: "Sign in — Kwise World",
};

export default function LoginPage() {
  return <AuthClient mode="login" />;
}
