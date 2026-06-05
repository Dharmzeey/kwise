import type { Metadata } from "next";
import ProfileClient from "./ProfileClient";

export const metadata: Metadata = { title: "My Account — Kwise World" };

export default function ProfilePage() {
  return <ProfileClient />;
}
