import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#18160F] text-[#F2EDE3]">
      <div className="max-w-7xl mx-auto px-6 md:px-10 pt-16 pb-10">

        {/* Top — brand + nav + connect */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-12 md:gap-20 mb-14">

          {/* Brand */}
          <div>
            <p className="text-[10px] tracking-[0.25em] uppercase text-[#7C3020] mb-4" style={{ fontFamily: "var(--font-sans)" }}>
              Fine Art
            </p>
            <h3 className="text-3xl font-light text-[#F2EDE3] mb-5 leading-tight" style={{ fontFamily: "var(--font-serif)" }}>
              Katelyn Cook
            </h3>
            <p className="text-sm text-[#F2EDE3]/50 leading-relaxed max-w-xs">
              Original paintings rooted in nature, memory, and movement. Every work is one of a kind.
            </p>
            <Link
              href="/commissions"
              className="inline-block mt-7 text-[10px] tracking-[0.2em] uppercase px-6 py-3 border border-[#7C3020]/60 text-[#F2EDE3]/80 hover:bg-[#7C3020] hover:border-[#7C3020] hover:text-white transition-all"
            >
              Request a Commission
            </Link>
          </div>

          {/* Navigate */}
          <div>
            <p className="text-[10px] tracking-[0.25em] uppercase text-[#F2EDE3]/30 mb-5">Navigate</p>
            <ul className="space-y-3">
              {[
                ["/portfolio", "Portfolio"],
                ["/shop", "Shop"],
                ["/commissions", "Commissions"],
                ["/about", "About"],
                ["/inquire", "Contact"],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-[#F2EDE3]/60 hover:text-[#F2EDE3] transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <p className="text-[10px] tracking-[0.25em] uppercase text-[#F2EDE3]/30 mb-5">Connect</p>
            <div className="space-y-4">
              <a
                href="https://www.instagram.com/katelynmechelle_/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-[#F2EDE3]/60 hover:text-[#F2EDE3] transition-colors"
              >
                <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                @katelynmechelle_
              </a>
              <a
                href="mailto:hello@katelyncook.art"
                className="flex items-center gap-3 text-sm text-[#F2EDE3]/60 hover:text-[#F2EDE3] transition-colors"
              >
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                hello@katelyncook.art
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#F2EDE3]/8 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-[11px] text-[#F2EDE3]/25">
            © {new Date().getFullYear()} Katelyn Cook. All artwork is original and protected by copyright.
          </p>
          <p className="text-[11px] text-[#F2EDE3]/20">Nashville, TN</p>
        </div>
      </div>
    </footer>
  );
}
