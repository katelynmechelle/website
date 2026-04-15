"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

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
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#F2EDE3]/96 backdrop-blur-md border-b border-[#E4DDD2]"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-7 h-7 rounded-full border border-[#7C3020]/40 flex items-center justify-center">
            <span className="text-[9px] tracking-widest text-[#7C3020]" style={{ fontFamily: "var(--font-serif)" }}>KC</span>
          </div>
          <span
            className="text-[11px] tracking-[0.22em] uppercase text-[#18160F] group-hover:text-[#7C3020] transition-colors"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Katelyn Cook
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-10">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-[11px] tracking-[0.18em] uppercase transition-colors ${
                pathname === link.href
                  ? "text-[#7C3020]"
                  : "text-[#18160F]/60 hover:text-[#18160F]"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/shop"
            className="text-[11px] tracking-[0.18em] uppercase px-5 py-2.5 bg-[#18160F] text-[#F2EDE3] hover:bg-[#7C3020] transition-colors"
          >
            Shop Paintings
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-[#18160F]"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          <div className="w-5 space-y-[5px]">
            <span className={`block h-px bg-current transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-[6px]" : ""}`} />
            <span className={`block h-px bg-current transition-all duration-300 ${mobileOpen ? "opacity-0" : ""}`} />
            <span className={`block h-px bg-current transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-[6px]" : ""}`} />
          </div>
        </button>
      </nav>

      {/* Mobile menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${mobileOpen ? "max-h-96" : "max-h-0"}`}>
        <div className="bg-[#F2EDE3] border-t border-[#E4DDD2] px-6 py-6 flex flex-col gap-5">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm tracking-widest uppercase ${pathname === link.href ? "text-[#7C3020]" : "text-[#18160F]/70"}`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/shop"
            className="mt-2 text-center text-[11px] tracking-[0.18em] uppercase px-5 py-3 bg-[#18160F] text-[#F2EDE3]"
          >
            Shop Paintings
          </Link>
        </div>
      </div>
    </header>
  );
}
