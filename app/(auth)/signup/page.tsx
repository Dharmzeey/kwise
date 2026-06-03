import type { Metadata } from "next";
import AuthClient from "../AuthClient";

export const metadata: Metadata = {
  title: "Create account — Kwise World",
};

export default function SignupPage() {
  return <AuthClient mode="signup" />;
}
