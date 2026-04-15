"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  {
    href: "/admin",
    label: "CRM",
    description: "Pipeline & leads",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
      </svg>
    ),
  },
  {
    href: "/admin/paintings",
    label: "Paintings",
    description: "Manage artwork",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </svg>
    ),
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-52 shrink-0 flex flex-col border-r border-[#F2EDE3]/8 bg-[#18160F]">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-[#F2EDE3]/8">
        <p
          className="text-[10px] tracking-[0.25em] uppercase text-[#7C3020]"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          Katelyn Mechelle
        </p>
        <p className="text-[11px] font-light text-[#F2EDE3]/30 mt-1" style={{ fontFamily: "var(--font-serif)" }}>
          Studio Admin
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 transition-colors ${
                active
                  ? "bg-[#7C3020]/25 text-[#F2EDE3]"
                  : "text-[#F2EDE3]/40 hover:text-[#F2EDE3]/70 hover:bg-[#F2EDE3]/5"
              }`}
            >
              <span className={active ? "text-[#E8A898]" : "text-[#F2EDE3]/30"}>
                {item.icon}
              </span>
              <div>
                <p className="text-[11px] tracking-[0.12em] uppercase" style={{ fontFamily: "var(--font-sans)" }}>
                  {item.label}
                </p>
                <p className="text-[10px] text-[#F2EDE3]/25 mt-0.5">{item.description}</p>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-[#F2EDE3]/8 space-y-2">
        <a
          href="/"
          className="flex items-center gap-2 text-[10px] tracking-wide uppercase text-[#F2EDE3]/20 hover:text-[#F2EDE3]/50 transition-colors"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
          </svg>
          View Site
        </a>
      </div>
    </aside>
  );
}
