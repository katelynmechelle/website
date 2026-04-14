"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

const NAV_LINKS = [
  { href: "/portfolio", label: "Portfolio" },
  { href: "/shop", label: "Shop" },
  { href: "/commissions", label: "Commissions" },
  { href: "/about", label: "About" },
  { href: "/inquire", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#F7F5F0]/95 backdrop-blur-sm shadow-sm"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <Image src="/logo.svg" alt="Katelyn Cook" width={36} height={36} />
          <span
            className="text-sm font-serif tracking-[0.15em] uppercase text-[#2C2825]"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Katelyn Cook
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-[#2C2825]/80 hover:text-[#8B6914] transition-colors tracking-wide"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/shop"
            className="text-sm px-4 py-2 border border-[#8B6914] text-[#8B6914] hover:bg-[#8B6914] hover:text-white transition-all rounded-sm tracking-wide"
          >
            View Shop
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-[#2C2825]"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <div className="w-5 space-y-1">
            <span
              className={`block h-px bg-current transition-all ${mobileOpen ? "rotate-45 translate-y-1.5" : ""}`}
            />
            <span
              className={`block h-px bg-current transition-all ${mobileOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`block h-px bg-current transition-all ${mobileOpen ? "-rotate-45 -translate-y-1.5" : ""}`}
            />
          </div>
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#F7F5F0] border-t border-[#EBE8E1] px-6 py-6 flex flex-col gap-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-base text-[#2C2825]/80 hover:text-[#8B6914] transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/shop"
            className="mt-2 text-center text-sm px-4 py-2.5 border border-[#8B6914] text-[#8B6914] hover:bg-[#8B6914] hover:text-white transition-all rounded-sm"
            onClick={() => setMobileOpen(false)}
          >
            View Shop
          </Link>
        </div>
      )}
    </header>
  );
}
