import Link from "next/link";
import Image from "next/image";
import { getFeaturedPaintings } from "@/lib/paintings";

export default function HomePage() {
  const featured = getFeaturedPaintings();

  return (
    <>
      {/* ── HERO ── */}
      <section className="relative min-h-screen overflow-hidden">
        {/* Full-bleed background painting */}
        <div className="absolute inset-0">
          <Image
            src="/Main.png"
            alt=""
            fill
            className="object-cover object-center"
            priority
          />
        </div>
        {/* Soft vignette mask — painting emerges on both left and right edges,
            opacity peaks only in the center-left where the text sits */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to right, rgba(242,237,227,0.38) 0%, rgba(242,237,227,0.82) 22%, rgba(242,237,227,0.78) 46%, rgba(242,237,227,0.18) 72%, rgba(242,237,227,0.06) 100%)",
          }}
        />
        {/* Bottom scrim */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#F2EDE3]/25 to-transparent" />

        {/* Text column */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 min-h-screen flex flex-col justify-end pb-20 pt-32">
          <div className="md:max-w-[46%]">
            <p
              className="text-[10px] tracking-[0.3em] uppercase text-[#7C3020] mb-8"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              Fine Art · Nashville, TN
            </p>
            <h1
              className="text-[clamp(3.5rem,9vw,8rem)] font-light leading-[0.9] text-[#18160F] mb-8"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Katelyn<br />
              <em>Mechelle</em>
            </h1>
            <p className="text-[#18160F]/70 text-base md:text-lg max-w-sm leading-relaxed mb-12">
              Original paintings rooted in nature, memory, and the quiet life of animals. Every work is singular — made once, owned forever.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/shop"
                className="text-[11px] tracking-[0.2em] uppercase px-7 py-3.5 bg-[#18160F] text-[#F2EDE3] hover:bg-[#7C3020] transition-colors"
              >
                Shop Paintings
              </Link>
              <Link
                href="/commissions"
                className="text-[11px] tracking-[0.2em] uppercase px-7 py-3.5 border border-[#18160F]/30 text-[#18160F]/70 hover:border-[#7C3020] hover:text-[#7C3020] transition-colors"
              >
                Commission a Work
              </Link>
            </div>
          </div>

          {/* Scroll cue */}
          <div className="absolute bottom-10 right-10 hidden md:flex flex-col items-center gap-2 text-[#18160F]/20">
            <div className="w-px h-12 bg-[#18160F]/20" />
            <span className="text-[9px] tracking-[0.3em] uppercase" style={{ fontFamily: "var(--font-sans)" }}>
              Scroll
            </span>
          </div>
        </div>
      </section>

      {/* ── FEATURED WORKS ── */}
      <section className="py-28 bg-[#F2EDE3]">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          {/* Section header */}
          <div className="flex items-end justify-between mb-16">
            <div>
              <p className="text-[10px] tracking-[0.3em] uppercase text-[#7C3020] mb-3" style={{ fontFamily: "var(--font-sans)" }}>
                Selected Works
              </p>
              <h2
                className="text-4xl md:text-5xl font-light text-[#18160F] leading-tight"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                From the Studio
              </h2>
            </div>
            <Link
              href="/portfolio"
              className="hidden md:inline-flex items-center gap-2 text-[11px] tracking-[0.15em] uppercase text-[#18160F]/40 hover:text-[#7C3020] transition-colors"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              View all
              <span className="text-base">→</span>
            </Link>
          </div>

          {/* Editorial grid: 1 large + 3 smaller */}
          <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr] gap-5 md:gap-6">
            {/* Large hero painting */}
            {featured[0] && (
              <Link href={`/shop/${featured[0].slug}`} className="img-zoom group block row-span-2 md:row-span-1">
                <div className="relative aspect-[3/4] overflow-hidden bg-[#E4DDD2]">
                  <Image
                    src={featured[0].image}
                    alt={featured[0].title}
                    fill
                    className="object-cover"
                  />
                  {!featured[0].available && (
                    <div className="absolute top-4 left-4">
                      <span className="text-[9px] tracking-[0.25em] uppercase bg-[#18160F]/80 text-[#F2EDE3] px-3 py-1.5">
                        Sold
                      </span>
                    </div>
                  )}
                </div>
                <div className="mt-3 flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-light text-[#18160F]" style={{ fontFamily: "var(--font-serif)" }}>
                      {featured[0].title}
                    </h3>
                    <p className="text-[11px] text-[#18160F]/40 mt-0.5 tracking-wide">
                      {featured[0].medium} · {featured[0].dimensions}
                    </p>
                  </div>
                  <p className="text-sm text-[#7C3020]">
                    {featured[0].available ? `$${featured[0].price.toLocaleString()}` : "Sold"}
                  </p>
                </div>
              </Link>
            )}

            {/* Right column: 2 stacked paintings */}
            <div className="md:col-span-2 grid grid-cols-2 gap-5 md:gap-6">
              {featured.slice(1, 5).map((p) => (
                <Link key={p.id} href={`/shop/${p.slug}`} className="img-zoom group block">
                  <div className="relative aspect-[4/5] overflow-hidden bg-[#E4DDD2]">
                    <Image
                      src={p.image}
                      alt={p.title}
                      fill
                      className="object-cover"
                    />
                    {!p.available && (
                      <div className="absolute top-3 left-3">
                        <span className="text-[8px] tracking-[0.2em] uppercase bg-[#18160F]/80 text-[#F2EDE3] px-2 py-1">
                          Sold
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="mt-2.5">
                    <h3 className="text-sm font-light text-[#18160F]" style={{ fontFamily: "var(--font-serif)" }}>
                      {p.title}
                    </h3>
                    <p className="text-[10px] text-[#18160F]/40 mt-0.5">
                      {p.medium}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-10 text-center md:hidden">
            <Link href="/portfolio" className="text-[11px] tracking-[0.2em] uppercase text-[#18160F]/50 hover:text-[#7C3020] transition-colors">
              View all works →
            </Link>
          </div>
        </div>
      </section>

      {/* ── PULL-QUOTE BAND ── */}
      <section className="py-28 bg-[#18160F]">
        <div className="max-w-4xl mx-auto px-6 md:px-10 text-center">
          <p className="text-[#7C3020] text-5xl md:text-7xl leading-none mb-8" style={{ fontFamily: "var(--font-serif)" }}>
            &ldquo;
          </p>
          <p
            className="text-[#F2EDE3]/80 text-2xl md:text-4xl font-light italic leading-relaxed mb-10"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            The painting arrived even more beautiful than in the photos. The depth of color is extraordinary — it&apos;s the first thing people notice in our home.
          </p>
          <p className="text-[10px] tracking-[0.25em] uppercase text-[#F2EDE3]/30" style={{ fontFamily: "var(--font-sans)" }}>
            — Sarah M., Nashville, TN
          </p>
        </div>
      </section>

      {/* ── IN COLLECTORS' HOMES ── */}
      <section className="py-28 bg-[#E4DDD2]">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="mb-16">
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#7C3020] mb-3" style={{ fontFamily: "var(--font-sans)" }}>
              In Collectors&apos; Homes
            </p>
            <h2
              className="text-4xl md:text-5xl font-light text-[#18160F] leading-tight max-w-lg"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Art that becomes part of your life
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { img: "https://placehold.co/800x1000/C4B5A0/F2EDE3?text=In+Home+I", label: "Living Room · Nashville, TN" },
              { img: "https://placehold.co/800x1000/9B8575/F2EDE3?text=In+Home+II", label: "Study · Lexington, KY" },
              { img: "https://placehold.co/800x1000/7A6858/F2EDE3?text=In+Home+III", label: "Entry Hall · Charleston, SC" },
            ].map((item, i) => (
              <div key={i}>
                <div className="img-zoom relative overflow-hidden aspect-[4/5]">
                  <Image
                    src={item.img}
                    alt={item.label}
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="mt-3 text-[11px] tracking-[0.15em] text-[#18160F]/40 uppercase" style={{ fontFamily: "var(--font-sans)" }}>
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT PREVIEW ── */}
      <section className="py-28 bg-[#F2EDE3]">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            {/* Image */}
            <div className="relative order-2 md:order-1">
              <div className="relative aspect-[4/5] overflow-hidden bg-[#E4DDD2]">
                <Image
                  src="https://placehold.co/700x875/5C4A3A/F2EDE3?text=Artist+Photo"
                  alt="Katelyn Mechelle in her studio"
                  fill
                  className="object-cover"
                />
              </div>
              {/* Offset accent block */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#7C3020]/10 -z-10" />
            </div>

            {/* Text */}
            <div className="order-1 md:order-2">
              <p className="text-[10px] tracking-[0.3em] uppercase text-[#7C3020] mb-6" style={{ fontFamily: "var(--font-sans)" }}>
                The Artist
              </p>
              <h2
                className="text-4xl md:text-5xl font-light text-[#18160F] leading-tight mb-8"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Katelyn Mechelle
              </h2>
              <div className="space-y-5 text-[#18160F]/70 leading-relaxed text-[15px]">
                <p>
                  Katelyn Mechelle is a painter working primarily in oils, with a deep reverence for the animal world and the landscapes it inhabits. Her work bridges the representational and the expressive — precise enough to feel present, loose enough to breathe.
                </p>
                <p>
                  Based in Nashville, her studio practice is rooted in direct observation and a commitment to the slow, intentional qualities of traditional oil painting. Each work is built in layers that give the surfaces their characteristic depth and warmth.
                </p>
              </div>
              <Link
                href="/about"
                className="inline-block mt-10 text-[11px] tracking-[0.2em] uppercase text-[#18160F]/50 hover:text-[#7C3020] transition-colors"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                Read full story →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECOND TESTIMONIAL ── */}
      <section className="py-20 bg-[#E4DDD2]">
        <div className="max-w-3xl mx-auto px-6 md:px-10">
          <div className="border-l-2 border-[#7C3020]/40 pl-8">
            <p
              className="text-2xl md:text-3xl font-light italic text-[#18160F]/80 leading-relaxed mb-6"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              &ldquo;Katelyn painted a portrait of our mare for us and it was everything we hoped for. She captured her personality perfectly. We will treasure it forever.&rdquo;
            </p>
            <p className="text-[11px] tracking-[0.2em] uppercase text-[#18160F]/40" style={{ fontFamily: "var(--font-sans)" }}>
              — James R., Lexington, KY
            </p>
          </div>
        </div>
      </section>

      {/* ── COMMISSION CTA ── */}
      <section className="py-28 bg-[#18160F]">
        <div className="max-w-7xl mx-auto px-6 md:px-10 grid md:grid-cols-2 gap-16 items-end">
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#7C3020] mb-6" style={{ fontFamily: "var(--font-sans)" }}>
              Custom Commissions
            </p>
            <h2
              className="text-4xl md:text-6xl font-light text-[#F2EDE3] leading-tight"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              A painting made<br />
              <em>only for you</em>
            </h2>
          </div>
          <div>
            <p className="text-[#F2EDE3]/50 leading-relaxed mb-10 text-[15px]">
              A commission is a deeply personal process — we begin with a conversation about your vision and work together from concept to completion. Whether it&apos;s a beloved horse, a meaningful landscape, or something entirely your own, the result is a singular work of art.
            </p>
            <Link
              href="/commissions"
              className="inline-block text-[11px] tracking-[0.2em] uppercase px-8 py-4 border border-[#7C3020]/60 text-[#F2EDE3]/80 hover:bg-[#7C3020] hover:border-[#7C3020] hover:text-white transition-all"
            >
              Begin a Commission
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
