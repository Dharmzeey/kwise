"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { fetchProfile } from "@/lib/api";
import Icon from "@/components/ui/Icon";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    fetchProfile()
      .then((user) => {
        if (!user.is_superuser) router.replace("/");
        else setReady(true);
      })
      .catch(() => router.replace("/login"));
  }, [router]);

  if (!ready) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <span style={{ color: "var(--ink-3)", fontSize: 14 }}>Checking access…</span>
      </div>
    );
  }

  const nav = [
    { href: "/admin", label: "Dashboard", icon: "chart" },
    { href: "/admin/products", label: "Products", icon: "phone" },
    { href: "/admin/orders", label: "Orders", icon: "cart" },
    { href: "/admin/reviews", label: "Reviews", icon: "star" },
  ];

  return (
    <div className="adm-shell">
      <aside className="adm-sidebar">
        <div className="adm-logo">
          <span className="logo-mark" style={{ width: 30, height: 30 }}><Image src="/logo.png" alt="Kwise" width={30} height={30} /></span>
          <span style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 14, color: "var(--ink)" }}>Admin</span>
        </div>
        <nav className="adm-nav">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`adm-navlink${pathname === item.href ? " on" : ""}`}
            >
              <Icon name={item.icon} size={16} />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="adm-sidebar-foot">
          <Link href="/" className="adm-navlink">
            <Icon name="arrowLeft" size={16} /> Back to store
          </Link>
        </div>
      </aside>
      <main className="adm-main">{children}</main>
    </div>
  );
}
