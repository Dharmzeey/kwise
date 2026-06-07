import Link from "next/link";
import Icon from "@/components/ui/Icon";
import { FaInstagram, FaTiktok } from "react-icons/fa6";
import { SiThreads } from "react-icons/si";
import type { Category } from "@/lib/types";

interface FooterProps {
  categories: Category[];
}

export default function Footer({ categories }: FooterProps) {
  return (
    <footer className="footer">
      <div className="container footer-in">
        <div className="footer-brand">
          <Link className="logo" href="/">
            <span className="logo-mark logo-mark-light">K<span className="logo-dot" /></span>
            <span className="logo-text logo-text-light">Kwise<span> World</span></span>
          </Link>
          <p className="footer-tag">
            Integrity — we mean what we say. Gadgets you can trust, prices that respect you.
          </p>
          <div className="footer-trust">
            <span><Icon name="shieldCheck" size={16} /> Tested &amp; verified</span>
            <span><Icon name="truck" size={16} /> Nationwide delivery</span>
          </div>
        </div>

        <div className="footer-col">
          <h4>Shop</h4>
          {categories.map((c) => (
            <Link key={c.slug} href={`/category/${c.slug}`}>{c.name}</Link>
          ))}
          <Link href="/offers">One-Time Offers</Link>
        </div>

        <div className="footer-col">
          <h4>Company</h4>
          <Link href="/about">About us</Link>
          <Link href="/login">My account</Link>
        </div>

        <div className="footer-col footer-contact">
          <h4>Reach us</h4>
          <span><Icon name="pin" size={16} /> 92B Lagelu Plaza, Iwo Road, Ibadan</span>
          <span><Icon name="whatsapp" size={16} /> +234 904 880 7490</span>
          <span><Icon name="mail" size={16} /> hello@kwiseworld.ng</span>
          <div className="footer-socials">
            <a href="https://www.instagram.com/kwise.world" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FaInstagram size={18} /></a>
            <a href="https://www.tiktok.com/@kwiseworld4" target="_blank" rel="noopener noreferrer" aria-label="TikTok"><FaTiktok size={18} /></a>
            <a href="https://www.threads.net/@kwise.world" target="_blank" rel="noopener noreferrer" aria-label="Threads"><SiThreads size={18} /></a>
          </div>
        </div>
      </div>

      <div className="container footer-bot">
        <span>© 2026 Kwise World. All rights reserved.</span>
        <span className="footer-pay">Prices in Naira (₦) · Pay with transfer · cards · USSD</span>
      </div>
    </footer>
  );
}
