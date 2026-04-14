"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { PAINTINGS } from "@/lib/paintings";

const TABS = ["All", "Oil", "Acrylic", "Watercolor", "Mixed Media"] as const;
type Tab = (typeof TABS)[number];

export default function PortfolioPage() {
  const [activeTab, setActiveTab] = useState<Tab>("All");

  const filtered =
    activeTab === "All"
      ? PAINTINGS
      : PAINTINGS.filter((p) => p.medium === activeTab);

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-[#EBE8E1]">
        <div className="max-w-7xl mx-auto px-6">
          <p
            className="text-xs tracking-[0.3em] uppercase text-[#8B6914] mb-4"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            All Works
          </p>
          <h1
            className="text-5xl md:text-7xl font-light text-[#2C2825] mb-4"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Portfolio
          </h1>
          <p className="text-[#2C2825]/70 max-w-lg leading-relaxed">
            A complete record of paintings — available, sold, and held in private collections.
          </p>
        </div>
      </section>

      {/* Filter Tabs */}
      <div className="sticky top-16 z-30 bg-[#F7F5F0]/95 backdrop-blur-sm border-b border-[#EBE8E1]">
        <div className="max-w-7xl mx-auto px-6 flex gap-6 overflow-x-auto py-4">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-sm tracking-wide whitespace-nowrap pb-1 border-b-2 transition-colors ${
                activeTab === tab
                  ? "border-[#8B6914] text-[#8B6914]"
                  : "border-transparent text-[#2C2825]/60 hover:text-[#2C2825]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <section className="py-16 bg-[#F7F5F0]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {filtered.map((p) => {
              const card = (
                <div className="group break-inside-avoid">
                  <div className="relative overflow-hidden rounded-lg shadow-sm">
                    <Image
                      src={p.image}
                      alt={p.title}
                      width={600}
                      height={800}
                      className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {!p.available && (
                      <div className="absolute top-3 left-3">
                        <span className="text-xs tracking-[0.15em] uppercase bg-[#2C2825]/80 text-white px-2.5 py-1 rounded-sm">
                          Private Collection
                        </span>
                      </div>
                    )}
                    {p.available && (
                      <div className="absolute inset-0 bg-[#2C2825]/0 group-hover:bg-[#2C2825]/20 transition-colors flex items-end">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity p-4 w-full bg-gradient-to-t from-[#2C2825]/60 to-transparent">
                          <span className="text-white text-sm tracking-wide">View Details →</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="mt-3 mb-6">
                    <h3 className="text-base text-[#2C2825]" style={{ fontFamily: "var(--font-serif)" }}>
                      {p.title}
                    </h3>
                    <p className="text-xs text-[#2C2825]/60 mt-0.5">
                      {p.medium} · {p.dimensions} · {p.year}
                    </p>
                  </div>
                </div>
              );

              return p.available ? (
                <Link key={p.id} href={`/shop/${p.slug}`}>
                  {card}
                </Link>
              ) : (
                <div key={p.id}>{card}</div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <p className="text-center text-[#2C2825]/50 py-20">
              No works in this medium yet.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
