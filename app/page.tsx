import Link from "next/link";
import Image from "next/image";
import { getFeaturedPaintings } from "@/lib/paintings";

export default function HomePage() {
  const featured = getFeaturedPaintings();

  return (
    <>
      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-gradient-to-br from-[#F7F5F0] via-[#EBE8E1] to-[#ddd8cf]">
        <div className="max-w-7xl mx-auto px-6 pt-28 pb-16 flex flex-col items-start">
          <p
            className="text-xs tracking-[0.3em] uppercase text-[#8B6914] mb-6"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Fine Art by
          </p>
          <h1
            className="text-6xl md:text-8xl lg:text-9xl font-light text-[#2C2825] leading-[0.95] mb-8"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Katelyn
            <br />
            <em>Cook</em>
          </h1>
          <p className="text-lg md:text-xl text-[#2C2825]/70 max-w-md mb-10 leading-relaxed">
            Original oil paintings that transform your space — animals, landscapes, and the quiet poetry of the living world.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/shop"
              className="px-7 py-3.5 bg-[#2C2825] text-[#F7F5F0] text-sm tracking-wide hover:bg-[#8B6914] transition-colors rounded-sm"
            >
              Shop Paintings
            </Link>
            <Link
              href="/portfolio"
              className="px-7 py-3.5 border border-[#2C2825] text-[#2C2825] text-sm tracking-wide hover:border-[#8B6914] hover:text-[#8B6914] transition-colors rounded-sm"
            >
              View Portfolio
            </Link>
          </div>
        </div>

        {/* Photo strip */}
        <div className="max-w-7xl mx-auto px-6 pb-16 w-full">
          <div className="flex gap-4 overflow-hidden">
            {[
              { img: "https://placehold.co/400x500/5C6B5A/F7F5F0?text=Detail+I", cls: "h-52 mt-0" },
              { img: "https://placehold.co/400x600/8B6914/F7F5F0?text=Detail+II", cls: "h-64 mt-6" },
              { img: "https://placehold.co/400x450/3d5a3e/F7F5F0?text=Detail+III", cls: "h-48 mt-2" },
            ].map((item, i) => (
              <div key={i} className={`${item.cls} flex-1 rounded-xl overflow-hidden shadow-md`}>
                <Image
                  src={item.img}
                  alt={`Painting detail ${i + 1}`}
                  width={400}
                  height={600}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED WORKS ── */}
      <section className="py-24 bg-[#F7F5F0]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-14">
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-[#8B6914] mb-3" style={{ fontFamily: "var(--font-serif)" }}>
                Selected Works
              </p>
              <h2 className="text-4xl md:text-5xl font-light text-[#2C2825]" style={{ fontFamily: "var(--font-serif)" }}>
                Featured Paintings
              </h2>
            </div>
            <Link href="/portfolio" className="hidden md:inline text-sm text-[#8B6914] hover:underline tracking-wide">
              View all →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((p, i) => (
              <Link key={p.id} href={`/shop/${p.slug}`} className="group block">
                <div
                  className={`relative overflow-hidden rounded-lg shadow-sm ${
                    i % 3 === 0 ? "aspect-[4/5]" : i % 3 === 1 ? "aspect-[3/4]" : "aspect-square"
                  }`}
                >
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {!p.available && (
                    <div className="absolute inset-0 bg-[#2C2825]/50 flex items-center justify-center">
                      <span className="text-white text-xs tracking-[0.2em] uppercase border border-white px-3 py-1">
                        Sold
                      </span>
                    </div>
                  )}
                </div>
                <div className="mt-3">
                  <h3 className="text-base text-[#2C2825]" style={{ fontFamily: "var(--font-serif)" }}>
                    {p.title}
                  </h3>
                  <p className="text-xs text-[#2C2825]/60 mt-0.5">
                    {p.medium} · {p.dimensions}
                  </p>
                  <p className="text-sm font-medium text-[#8B6914] mt-1">
                    {p.available ? `$${p.price.toLocaleString()}` : "Sold"}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-10 text-center md:hidden">
            <Link href="/portfolio" className="text-sm text-[#8B6914] hover:underline">
              View all works →
            </Link>
          </div>
        </div>
      </section>

      {/* ── ABOUT PREVIEW ── */}
      <section className="py-24 bg-[#EBE8E1]">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-[#8B6914] mb-4" style={{ fontFamily: "var(--font-serif)" }}>
              The Artist
            </p>
            <h2 className="text-4xl md:text-5xl font-light text-[#2C2825] mb-6" style={{ fontFamily: "var(--font-serif)" }}>
              Katelyn Cook
            </h2>
            <p className="text-[#2C2825]/80 leading-relaxed mb-4">
              Katelyn Cook is a painter working primarily in oils, with a deep reverence for the animal world and the landscapes it inhabits. Her work bridges the representational and the expressive — precise enough to feel present, loose enough to breathe.
            </p>
            <p className="text-[#2C2825]/80 leading-relaxed mb-8">
              Based in the American South, her studio practice is rooted in direct observation and a commitment to the slow, intentional qualities of traditional oil painting. Each work is built in layers — raw linen, oil ground, and accumulated glazes — that give the surfaces their characteristic depth and warmth.
            </p>
            <Link href="/about" className="text-sm text-[#8B6914] hover:underline tracking-wide">
              Read full story →
            </Link>
          </div>
          <div className="relative">
            <div className="aspect-[4/5] relative rounded-xl overflow-hidden shadow-lg">
              <Image
                src="https://placehold.co/600x750/5C6B5A/F7F5F0?text=Artist+Photo"
                alt="Katelyn Cook in studio"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -left-4 w-28 h-28 rounded-lg overflow-hidden shadow-md border-4 border-[#F7F5F0]">
              <Image
                src="https://placehold.co/200x200/8B6914/F7F5F0?text=Studio"
                alt="Studio detail"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── PROCESS ── */}
      <section className="py-24 bg-[#F7F5F0]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.3em] uppercase text-[#8B6914] mb-3" style={{ fontFamily: "var(--font-serif)" }}>
              How it Works
            </p>
            <h2 className="text-4xl md:text-5xl font-light text-[#2C2825]" style={{ fontFamily: "var(--font-serif)" }}>
              Bringing Art Home
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                num: "01",
                title: "Original Work",
                desc: "Every painting is one-of-a-kind, made by hand with traditional materials. When it sells, it's gone — which makes owning one genuinely rare.",
                icon: "✦",
              },
              {
                num: "02",
                title: "Choose Yours",
                desc: "Browse the shop or commission something made specifically for you. Reach out through the inquiry form — Katelyn responds to every message personally.",
                icon: "◎",
              },
              {
                num: "03",
                title: "Shipped to You",
                desc: "Each work is carefully packed and shipped with a certificate of authenticity, care instructions, and a note from the artist.",
                icon: "→",
              },
            ].map((step) => (
              <div key={step.num} className="flex flex-col">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-3xl text-[#8B6914]">{step.icon}</span>
                  <span className="text-xs text-[#2C2825]/40 tracking-[0.2em]">{step.num}</span>
                </div>
                <h3 className="text-xl text-[#2C2825] mb-3" style={{ fontFamily: "var(--font-serif)" }}>
                  {step.title}
                </h3>
                <p className="text-[#2C2825]/70 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-24 bg-[#EBE8E1]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-[#8B6914] mb-12" style={{ fontFamily: "var(--font-serif)" }}>
            Collectors
          </p>
          <div className="grid md:grid-cols-2 gap-12">
            {[
              {
                quote:
                  "The painting arrived even more beautiful than in the photos. The depth of color and the quality of the work is extraordinary — it&apos;s the first thing people notice in our home.",
                name: "Sarah M.",
                city: "Nashville, TN",
              },
              {
                quote:
                  "Katelyn painted a portrait of our mare for us and it was everything we hoped for. She captured her personality perfectly. We will treasure it forever.",
                name: "James R.",
                city: "Lexington, KY",
              },
            ].map((t) => (
              <div key={t.name} className="text-left">
                <p className="text-2xl font-light text-[#2C2825] italic leading-relaxed mb-6" style={{ fontFamily: "var(--font-serif)" }}>
                  &ldquo;{t.quote}&rdquo;
                </p>
                <p className="text-sm text-[#2C2825]/60">
                  — {t.name}, {t.city}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMMISSION CTA BAND ── */}
      <section className="py-20 bg-[#2C2825]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-[#8B6914] mb-4" style={{ fontFamily: "var(--font-serif)" }}>
            Custom Commissions
          </p>
          <h2 className="text-4xl md:text-5xl font-light text-[#F7F5F0] mb-6" style={{ fontFamily: "var(--font-serif)" }}>
            Want something made for you?
          </h2>
          <p className="text-[#F7F5F0]/60 mb-10 leading-relaxed">
            A commission is a deeply personal process. Whether it&apos;s a beloved horse, a meaningful landscape, or something entirely your own — Katelyn will work with you from concept to completion.
          </p>
          <Link
            href="/commissions"
            className="inline-block px-8 py-4 border border-[#8B6914] text-[#F7F5F0] text-sm tracking-wide hover:bg-[#8B6914] transition-colors rounded-sm"
          >
            Request a Commission
          </Link>
        </div>
      </section>
    </>
  );
}
