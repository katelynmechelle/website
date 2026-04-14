"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { getAvailablePaintings } from "@/lib/paintings";
import { Painting } from "@/lib/types";

const MEDIUMS = ["All", "Oil", "Acrylic", "Watercolor", "Mixed Media"];
const SIZES = ["All", "Small (under 16\")", "Medium (16\"–24\")", "Large (over 24\")"];
const PRICES = ["All", "Under $500", "$500–$1,500", "$1,500–$3,000", "$3,000+"];

function matchesSize(p: Painting, size: string) {
  if (size === "All") return true;
  const dim = p.dimensions;
  const nums = dim.match(/\d+/g)?.map(Number) ?? [0];
  const max = Math.max(...nums);
  if (size.startsWith("Small")) return max < 16;
  if (size.startsWith("Medium")) return max >= 16 && max <= 24;
  if (size.startsWith("Large")) return max > 24;
  return true;
}

function matchesPrice(p: Painting, price: string) {
  if (price === "All") return true;
  if (price === "Under $500") return p.price < 500;
  if (price === "$500–$1,500") return p.price >= 500 && p.price <= 1500;
  if (price === "$1,500–$3,000") return p.price > 1500 && p.price <= 3000;
  if (price === "$3,000+") return p.price > 3000;
  return true;
}

export default function ShopPage() {
  const [medium, setMedium] = useState("All");
  const [size, setSize] = useState("All");
  const [price, setPrice] = useState("All");

  const available = getAvailablePaintings();
  const filtered = available.filter(
    (p) =>
      (medium === "All" || p.medium === medium) &&
      matchesSize(p, size) &&
      matchesPrice(p, price)
  );

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-[#EBE8E1]">
        <div className="max-w-7xl mx-auto px-6">
          <p
            className="text-xs tracking-[0.3em] uppercase text-[#8B6914] mb-4"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Available Now
          </p>
          <h1
            className="text-5xl md:text-7xl font-light text-[#2C2825] mb-4"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Original Paintings
          </h1>
          <p className="text-[#2C2825]/70 max-w-lg leading-relaxed">
            Each painting is one-of-a-kind. Purchasing is handled through a personal inquiry — no cart, no checkout. Just a conversation.
          </p>
        </div>
      </section>

      {/* Filters */}
      <div className="sticky top-16 z-30 bg-[#F7F5F0]/95 backdrop-blur-sm border-b border-[#EBE8E1]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap gap-4 items-center">
          <FilterSelect label="Medium" options={MEDIUMS} value={medium} onChange={setMedium} />
          <FilterSelect label="Size" options={SIZES} value={size} onChange={setSize} />
          <FilterSelect label="Price" options={PRICES} value={price} onChange={setPrice} />
          <span className="text-xs text-[#2C2825]/50 ml-auto">{filtered.length} works</span>
        </div>
      </div>

      {/* Grid */}
      <section className="py-16 bg-[#F7F5F0]">
        <div className="max-w-7xl mx-auto px-6">
          {filtered.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-[#2C2825]/50 mb-4">No paintings match your filters.</p>
              <button
                onClick={() => { setMedium("All"); setSize("All"); setPrice("All"); }}
                className="text-sm text-[#8B6914] hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((p) => (
                <div key={p.id} className="group flex flex-col">
                  <Link href={`/shop/${p.slug}`} className="block relative aspect-[4/5] overflow-hidden rounded-lg shadow-sm mb-4">
                    <Image
                      src={p.image}
                      alt={p.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>
                  <div className="flex flex-col flex-1">
                    <Link href={`/shop/${p.slug}`}>
                      <h2 className="text-lg text-[#2C2825] hover:text-[#8B6914] transition-colors" style={{ fontFamily: "var(--font-serif)" }}>
                        {p.title}
                      </h2>
                    </Link>
                    <p className="text-xs text-[#2C2825]/60 mt-0.5 mb-2">
                      {p.medium} · {p.dimensions}
                    </p>
                    <p className="text-base font-medium text-[#8B6914] mb-4">
                      ${p.price.toLocaleString()}
                    </p>
                    <Link
                      href={`/inquire?painting=${encodeURIComponent(p.title)}`}
                      className="mt-auto text-center text-sm px-4 py-2.5 border border-[#2C2825] text-[#2C2825] hover:bg-[#2C2825] hover:text-[#F7F5F0] transition-colors rounded-sm tracking-wide"
                    >
                      Add to Inquiry
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function FilterSelect({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-[#2C2825]/50 tracking-wide">{label}:</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="text-sm bg-transparent border-b border-[#2C2825]/30 text-[#2C2825] py-1 pr-6 focus:outline-none focus:border-[#8B6914] cursor-pointer"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}
