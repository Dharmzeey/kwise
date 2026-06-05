"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login, register } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import Btn from "@/components/ui/Btn";
import Icon from "@/components/ui/Icon";

interface Props {
  mode: "login" | "signup";
}

export default function AuthClient({ mode }: Props) {
  const router = useRouter();
  const { showToast } = useToast();

  const [form, setForm] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "login") {
        await login({ email: form.email, password: form.password });
        showToast("Welcome back!");
      } else {
        await register({
          email: form.email,
          password: form.password,
          first_name: form.first_name,
          last_name: form.last_name,
          phone: form.phone || undefined,
        });
        showToast("Account created. Welcome to Kwise World!");
      }
      router.push("/");
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  const isLogin = mode === "login";

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <Icon name="shieldCheck" size={28} />
          <span>Kwise World</span>
        </div>
        <h1>{isLogin ? "Sign in" : "Create account"}</h1>
        <p className="auth-sub">
          {isLogin
            ? "Good to have you back."
            : "Join thousands of satisfied customers."}
        </p>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-row">
              <label>
                First name *
                <input
                  required
                  value={form.first_name}
                  onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                  placeholder="Ada"
                />
              </label>
              <label>
                Last name *
                <input
                  required
                  value={form.last_name}
                  onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                  placeholder="Obi"
                />
              </label>
            </div>
          )}

          <label>
            Email address *
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="ada@example.com"
            />
          </label>

          {!isLogin && (
            <label>
              Phone (optional)
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+234 800 000 0000"
              />
            </label>
          )}

          <label>
            Password *
            <input
              type="password"
              required
              minLength={8}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Min. 8 characters"
            />
          </label>

          <Btn kind="primary" size="md" full type="submit" disabled={loading}>
            {loading
              ? isLogin ? "Signing in…" : "Creating account…"
              : isLogin ? "Sign in" : "Create account"}
          </Btn>
        </form>

        <p className="auth-switch">
          {isLogin ? (
            <>
              Don&apos;t have an account?{" "}
              <Link href="/signup">Create one</Link>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Link href="/login">Sign in</Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
