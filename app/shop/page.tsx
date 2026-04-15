"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { PAINTINGS } from "@/lib/paintings";
import { Painting } from "@/lib/types";

const MEDIUMS = ["All", "Oil", "Acrylic", "Watercolor", "Mixed Media"];
const SIZES = ["All", "Small (under 16\")", "Medium (16\"–24\")", "Large (over 24\")"];
const PRICES = ["All", "Under $500", "$500–$1,500", "$1,500–$3,000", "$3,000+"];

function matchesSize(p: Painting, size: string) {
  if (size === "All") return true;
  const nums = p.dimensions.match(/\d+/g)?.map(Number) ?? [0];
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
  const [paintings, setPaintings] = useState<Painting[]>(PAINTINGS);

  // Fetch live paintings from API (Supabase or static fallback)
  useEffect(() => {
    fetch("/api/paintings")
      .then((r) => r.json())
      .then((data) => { if (data.paintings) setPaintings(data.paintings); })
      .catch(() => {});
  }, []);

  const available = paintings.filter((p) => p.available);
  const filtered = available.filter(
    (p) =>
      (medium === "All" || p.medium === medium) &&
      matchesSize(p, size) &&
      matchesPrice(p, price)
  );

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-[#F2EDE3]">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <p className="text-[10px] tracking-[0.3em] uppercase text-[#7C3020] mb-4" style={{ fontFamily: "var(--font-sans)" }}>
            Available Now
          </p>
          <h1 className="text-5xl md:text-7xl font-light text-[#18160F]" style={{ fontFamily: "var(--font-serif)" }}>
            Original Paintings
          </h1>
          <p className="text-[#18160F]/60 mt-4 max-w-lg leading-relaxed text-[15px]">
            Each painting is one-of-a-kind. Purchasing is handled through a personal inquiry — no cart, no checkout. Just a conversation.
          </p>
        </div>
      </section>

      {/* Filters */}
      <div className="sticky top-16 z-30 bg-[#F2EDE3]/96 backdrop-blur-sm border-b border-[#E4DDD2]">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-4 flex flex-wrap gap-6 items-center">
          <FilterSelect label="Medium" options={MEDIUMS} value={medium} onChange={setMedium} />
          <FilterSelect label="Size" options={SIZES} value={size} onChange={setSize} />
          <FilterSelect label="Price" options={PRICES} value={price} onChange={setPrice} />
          <span className="text-[11px] tracking-wide text-[#18160F]/30 ml-auto uppercase" style={{ fontFamily: "var(--font-sans)" }}>
            {filtered.length} work{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Grid */}
      <section className="py-20 bg-[#F2EDE3]">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          {filtered.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-[#18160F]/40 mb-5 text-[15px]">No paintings match your filters.</p>
              <button
                onClick={() => { setMedium("All"); setSize("All"); setPrice("All"); }}
                className="text-[11px] tracking-[0.2em] uppercase text-[#7C3020] hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
              {filtered.map((p) => (
                <div key={p.id} className="group flex flex-col">
                  <Link href={`/shop/${p.slug}`} className="img-zoom block relative aspect-[4/5] overflow-hidden bg-[#E4DDD2] mb-4">
                    <Image
                      src={p.image}
                      alt={p.title}
                      fill
                      className="object-cover"
                    />
                    {p.original_price && p.original_price > p.price && (
                      <div className="absolute top-3 right-3">
                        <span className="text-[9px] tracking-[0.2em] uppercase bg-[#7C3020] text-[#F2EDE3] px-2 py-1">
                          Sale
                        </span>
                      </div>
                    )}
                  </Link>
                  <div className="flex flex-col flex-1">
                    <Link href={`/shop/${p.slug}`}>
                      <h2 className="text-lg font-light text-[#18160F] hover:text-[#7C3020] transition-colors" style={{ fontFamily: "var(--font-serif)" }}>
                        {p.title}
                      </h2>
                    </Link>
                    <p className="text-[11px] text-[#18160F]/40 mt-1 mb-3 tracking-wide">
                      {p.medium} · {p.dimensions}
                    </p>
                    <div className="flex items-baseline gap-3 mb-5">
                      <p className="text-base text-[#7C3020]">
                        ${p.price.toLocaleString()}
                      </p>
                      {p.original_price && p.original_price > p.price && (
                        <p className="text-sm text-[#18160F]/30 line-through">
                          ${p.original_price.toLocaleString()}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-3 mt-auto">
                      <Link
                        href={`/shop/${p.slug}`}
                        className="flex-1 text-center text-[11px] tracking-[0.15em] uppercase px-4 py-2.5 border border-[#18160F]/20 text-[#18160F]/60 hover:border-[#18160F] hover:text-[#18160F] transition-colors"
                      >
                        View Details
                      </Link>
                      <Link
                        href={`/inquire?painting=${encodeURIComponent(p.title)}`}
                        className="flex-1 text-center text-[11px] tracking-[0.15em] uppercase px-4 py-2.5 bg-[#18160F] text-[#F2EDE3] hover:bg-[#7C3020] transition-colors"
                      >
                        Inquire
                      </Link>
                    </div>
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
      <span className="text-[10px] tracking-[0.15em] uppercase text-[#18160F]/40" style={{ fontFamily: "var(--font-sans)" }}>
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="text-sm bg-transparent border-b border-[#18160F]/20 text-[#18160F] py-1 pr-6 focus:outline-none focus:border-[#7C3020] cursor-pointer transition-colors"
      >
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}
