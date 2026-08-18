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
  const [guidesOpen, setGuidesOpen] = useState(false);
  const [q, setQ] = useState("");

  useEffect(() => {
    setMounted(true);
    setIsLoggedIn(document.cookie.includes("kw_access="));
  }, []);

  // Close mobile menu and open dropdowns on navigation
  useEffect(() => { setMenuOpen(false); setGuidesOpen(false); }, [pathname]);

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
          <span> Delivery everywhere in Nigeria</span>
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

          <nav className="mainnav">
            <Link className="navlink" href="/category/all">Shop</Link>
            <Link className="navlink navlink-ot" href="/offers">
              <Icon name="bolt" size={13} stroke={0} /> One-Time Offers
            </Link>
            <Link className="navlink navlink-swap" href="/swap">
              <Icon name="refresh" size={13} /> Swap
            </Link>
            <Link className="navlink" href="/pc-finder">PC Finder</Link>

            <div
              className="navdd"
              onMouseEnter={() => setGuidesOpen(true)}
              onMouseLeave={() => setGuidesOpen(false)}
            >
              <button
                className="navlink"
                aria-expanded={guidesOpen}
                onClick={() => setGuidesOpen((v) => !v)}
              >
                Guides <Icon name="chevronDown" size={14} />
              </button>
              {guidesOpen && (
                <div className="navdd-menu">
                  <Link href="/phones" onClick={() => setGuidesOpen(false)}>
                    <Icon name="star" size={17} />
                    <span><strong>Phone Reviews</strong><em>Specs, verdicts &amp; prices</em></span>
                  </Link>
                  <Link href="/compare" onClick={() => setGuidesOpen(false)}>
                    <Icon name="sliders" size={17} />
                    <span><strong>Compare Devices</strong><em>Side-by-side specs</em></span>
                  </Link>
                  <Link href="/guides" onClick={() => setGuidesOpen(false)}>
                    <Icon name="grid" size={17} />
                    <span><strong>Buying Guides</strong><em>Best picks by use case</em></span>
                  </Link>
                </div>
              )}
            </div>

            <Link className="navlink" href="/about">About</Link>
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
            <div className="mm-sec-label">Shop by department</div>
            {categories.map((c) => (
              <Link key={c.slug} className="mm-link" href={`/category/${c.slug}`}>
                <Icon name={c.icon} size={18} />{c.name}
              </Link>
            ))}

            <div className="mm-sec-label">Discover</div>
            <Link className="mm-link mm-ot" href="/offers">
              <Icon name="bolt" size={18} stroke={0} />One-Time Offers
            </Link>
            <Link className="mm-link mm-swap" href="/swap">
              <Icon name="refresh" size={18} />Swap your iPhone
            </Link>
            <Link className="mm-link" href="/pc-finder">
              <Icon name="laptop" size={18} />Find a PC
            </Link>

            <div className="mm-sec-label">Guides &amp; Reviews</div>
            <Link className="mm-link" href="/phones">
              <Icon name="star" size={18} />Phone Reviews
            </Link>
            <Link className="mm-link" href="/compare">
              <Icon name="sliders" size={18} />Compare Devices
            </Link>
            <Link className="mm-link" href="/guides">
              <Icon name="grid" size={18} />Buying Guides
            </Link>

            <div className="mm-sec-label">More</div>
            <Link className="mm-link" href="/about">
              <Icon name="info" size={18} />About
            </Link>
            <Link className="mm-link" href={isLoggedIn ? "/profile" : "/login"}>
              <Icon name="user" size={18} />{isLoggedIn ? "My Account" : "Login / Sign up"}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
