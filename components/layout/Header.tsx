"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import Icon from "@/components/ui/Icon";
import { useCart } from "@/context/CartContext";
import type { Category } from "@/lib/types";

interface HeaderProps {
  categories: Category[];
  onOpenCart: () => void;
}

export default function Header({ categories, onOpenCart }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { cartCount } = useCart();
  const [mounted, setMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [megaLocked, setMegaLocked] = useState(false);
  const [q, setQ] = useState("");

  useEffect(() => {
    setMounted(true);
    setIsLoggedIn(document.cookie.includes("kw_access="));
  }, []);

  // Close mobile menu on navigation
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  // Close mega on outside click when locked
  useEffect(() => {
    if (!megaLocked) return;
    function handleClick(e: MouseEvent) {
      const nav = document.querySelector(".mainnav");
      if (nav && !nav.contains(e.target as Node)) {
        setMegaOpen(false);
        setMegaLocked(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [megaLocked]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (q.trim()) {
      router.push(`/category/all?q=${encodeURIComponent(q.trim())}`);
    }
  }

  return (
    <>
      {/* Topbar */}
      <div className="topbar">
        <div className="container topbar-in">
          <span><Icon name="truck" size={15} /> Delivery everywhere in Nigeria</span>
          <span className="topbar-tag">Integrity — we mean what we say.</span>
          <a className="topbar-wa" href="https://wa.me/2349048807490" target="_blank" rel="noopener noreferrer"><Icon name="whatsapp" size={15} /> Chat with us</a>
        </div>
      </div>

      {/* Main header */}
      <header className="header">
        <div className="container header-in">
          <button className="hamburger" onClick={() => setMenuOpen(true)} aria-label="Open menu">
            <Icon name="menu" />
          </button>

          <Link className="logo" href="/">
            <span className="logo-mark"><Image src="/logo.png" alt="Kwise" width={38} height={38} /></span>
            <span className="logo-text">Kwise<span> World</span></span>
          </Link>

          <nav className="mainnav" onMouseLeave={() => { if (!megaLocked) setMegaOpen(false); }}>
            <button
              className="navlink"
              onMouseEnter={() => setMegaOpen(true)}
              onClick={() => {
                const next = !megaOpen;
                setMegaOpen(next);
                setMegaLocked(next);
              }}
            >
              Shop <Icon name="chevronDown" size={14} />
            </button>
            <Link className="navlink navlink-ot" href="/offers">
              <Icon name="bolt" size={13} stroke={0} /> One-Time Offers
            </Link>
            <Link className="navlink navlink-swap" href="/swap">
              <Icon name="refresh" size={13} /> Swap
            </Link>
            <Link className="navlink" href="/about">About</Link>

            {megaOpen && (
              <div className="mega" onMouseEnter={() => setMegaOpen(true)}>
                {categories.map((c) => (
                  <div className="mega-col" key={c.slug}>
                    <Link className="mega-head" href={`/category/${c.slug}`} onClick={() => { setMegaOpen(false); setMegaLocked(false); }}>
                      <Icon name={c.icon} size={18} /> {c.name}
                    </Link>
                    <div className="mega-links">
                      {c.brands.map((b) => (
                        <Link
                          key={b.slug}
                          href={`/category/${c.slug}?brand=${b.slug}`}
                          onClick={() => { setMegaOpen(false); setMegaLocked(false); }}
                        >
                          {b.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
                <div className="mega-promo">
                  <Icon name="bolt" size={20} stroke={0} />
                  <strong>One-Time Offers</strong>
                  <p>Single-unit deals. Once it&apos;s gone, it&apos;s gone.</p>
                  <Link href="/offers" onClick={() => { setMegaOpen(false); setMegaLocked(false); }}>
                    See deals <Icon name="arrowRight" size={15} />
                  </Link>
                </div>
                <div className="mega-promo mega-promo-swap">
                  <Icon name="refresh" size={20} />
                  <strong>Swap your iPhone</strong>
                  <p>Trade in your current device and get the upgrade you want.</p>
                  <Link href="/swap" onClick={() => { setMegaOpen(false); setMegaLocked(false); }}>
                    Start swap <Icon name="arrowRight" size={15} />
                  </Link>
                </div>
              </div>
            )}
          </nav>

          <form className="searchbar" onSubmit={handleSearch}>
            <Icon name="search" size={18} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search phones, laptops, accessories…"
              aria-label="Search products"
            />
          </form>

          <div className="header-actions">
            <Link className="iconbtn" href={isLoggedIn ? "/profile" : "/login"} aria-label="Account">
              <Icon name="user" />
            </Link>
            <button className="iconbtn cartbtn" onClick={onOpenCart} aria-label="Open cart">
              <Icon name="cart" />
              {mounted && cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu drawer */}
      <div className={`mobile-menu${menuOpen ? " open" : ""}`} aria-hidden={!menuOpen}>
        <div className="mm-scrim" onClick={() => setMenuOpen(false)} />
        <div className="mm-panel">
          <div className="mm-head">
            <span className="logo-text">Kwise<span> World</span></span>
            <button className="iconbtn" onClick={() => setMenuOpen(false)} aria-label="Close menu">
              <Icon name="close" />
            </button>
          </div>
          <form className="searchbar mm-search" onSubmit={handleSearch}>
            <Icon name="search" size={18} />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" />
          </form>
          <div className="mm-links">
            {categories.map((c) => (
              <div key={c.slug} className="mm-group">
                <Link className="mm-link mm-cat" href={`/category/${c.slug}`}>
                  <Icon name={c.icon} size={18} />{c.name}
                </Link>
                <div className="mm-sub">
                  {c.brands.map((b) => (
                    <Link key={b.slug} href={`/category/${c.slug}?brand=${b.slug}`}>{b.name}</Link>
                  ))}
                </div>
              </div>
            ))}
            <Link className="mm-link mm-ot" href="/offers">
              <Icon name="bolt" size={18} stroke={0} />One-Time Offers
            </Link>
            <Link className="mm-link mm-swap" href="/swap">
              <Icon name="refresh" size={18} />Swap your iPhone
            </Link>
            <Link className="mm-link" href="/about">About</Link>
            <Link className="mm-link" href={isLoggedIn ? "/profile" : "/login"}>
              <Icon name="user" size={18} />{isLoggedIn ? "My Account" : "Login / Sign up"}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
