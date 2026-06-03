"use client";
import { useState, useEffect } from "react";
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
  const [menuOpen, setMenuOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [q, setQ] = useState("");

  // Close mobile menu on navigation
  useEffect(() => { setMenuOpen(false); }, [pathname]);

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
          <Link className="topbar-wa" href="/about"><Icon name="whatsapp" size={15} /> Chat with us</Link>
        </div>
      </div>

      {/* Main header */}
      <header className="header">
        <div className="container header-in">
          <button className="hamburger" onClick={() => setMenuOpen(true)} aria-label="Open menu">
            <Icon name="menu" />
          </button>

          <Link className="logo" href="/">
            <span className="logo-mark">K<span className="logo-dot" /></span>
            <span className="logo-text">Kwise<span> World</span></span>
          </Link>

          <nav className="mainnav" onMouseLeave={() => setMegaOpen(false)}>
            <button
              className="navlink"
              onMouseEnter={() => setMegaOpen(true)}
              onClick={() => setMegaOpen((v) => !v)}
            >
              Shop <Icon name="chevronDown" size={15} />
            </button>

            {categories.map((c) => (
              <Link key={c.slug} className="navlink" href={`/category/${c.slug}`}>
                {c.name}
              </Link>
            ))}

            <Link className="navlink navlink-ot" href="/offers">
              <Icon name="bolt" size={14} stroke={0} /> One-Time Offers
            </Link>
            <Link className="navlink" href="/about">About</Link>

            {megaOpen && (
              <div className="mega" onMouseEnter={() => setMegaOpen(true)}>
                {categories.map((c) => (
                  <div className="mega-col" key={c.slug}>
                    <Link className="mega-head" href={`/category/${c.slug}`} onClick={() => setMegaOpen(false)}>
                      <Icon name={c.icon} size={18} /> {c.name}
                    </Link>
                    <div className="mega-links">
                      {c.brands.map((b) => (
                        <Link
                          key={b.slug}
                          href={`/category/${c.slug}?brand=${b.slug}`}
                          onClick={() => setMegaOpen(false)}
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
                  <Link href="/offers" onClick={() => setMegaOpen(false)}>
                    See deals <Icon name="arrowRight" size={15} />
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
            <Link className="iconbtn" href="/login" aria-label="Account">
              <Icon name="user" />
            </Link>
            <button className="iconbtn cartbtn" onClick={onOpenCart} aria-label="Open cart">
              <Icon name="cart" />
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
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
            <Link className="mm-link" href="/about">About</Link>
            <Link className="mm-link" href="/login">
              <Icon name="user" size={18} />Login / Sign up
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
