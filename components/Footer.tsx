import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#2C2825] text-[#F7F5F0]">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-full border border-[#8B6914] flex items-center justify-center">
                <span className="text-[#8B6914] text-xs font-serif">KC</span>
              </div>
              <span
                className="text-sm tracking-[0.15em] uppercase text-[#F7F5F0]"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Katelyn Cook
              </span>
            </Link>
            <p className="text-sm text-[#F7F5F0]/60 leading-relaxed max-w-xs">
              Original paintings that bring warmth, life, and story into your space.
            </p>
          </div>

          {/* Nav */}
          <div>
            <h4
              className="text-xs tracking-[0.2em] uppercase text-[#8B6914] mb-4"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Navigate
            </h4>
            <ul className="space-y-2">
              {[
                ["Portfolio", "/portfolio"],
                ["Shop", "/shop"],
                ["Commissions", "/commissions"],
                ["About", "/about"],
                ["Contact", "/inquire"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-[#F7F5F0]/70 hover:text-[#F7F5F0] transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact / CTA */}
          <div>
            <h4
              className="text-xs tracking-[0.2em] uppercase text-[#8B6914] mb-4"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Connect
            </h4>
            <div className="space-y-3 mb-6">
              <a
                href="https://www.instagram.com/katelynmechelle_/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-[#F7F5F0]/70 hover:text-[#F7F5F0] transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
                @katelynmechelle_
              </a>
              <a
                href="mailto:hello@katelyncook.art"
                className="flex items-center gap-2 text-sm text-[#F7F5F0]/70 hover:text-[#F7F5F0] transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                hello@katelyncook.art
              </a>
            </div>
            <Link
              href="/commissions"
              className="inline-block text-sm px-5 py-2.5 bg-[#8B6914] text-white hover:bg-[#7a5c10] transition-colors rounded-sm tracking-wide"
            >
              Request a Commission
            </Link>
          </div>
        </div>

        <div className="border-t border-[#F7F5F0]/10 pt-6 text-center text-xs text-[#F7F5F0]/40">
          © {new Date().getFullYear()} Katelyn Cook. All rights reserved. All artwork is original and protected by copyright.
        </div>
      </div>
    </footer>
  );
}
