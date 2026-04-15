import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getPaintingBySlug, getAllSlugs } from "@/lib/paintings";
import { isSupabaseConfigured } from "@/lib/supabase";
import { createClient } from "@/lib/supabase/server";
import { Painting } from "@/lib/types";

// Pre-render known static slugs; dynamic Supabase slugs render on demand
export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const painting = await fetchPainting(slug);
  if (!painting) return {};
  return {
    title: `${painting.title} | Katelyn Mechelle`,
    description: painting.description,
  };
}

async function fetchPainting(slug: string): Promise<Painting | null> {
  const staticPainting = getPaintingBySlug(slug);
  if (staticPainting) return staticPainting;
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data } = await supabase.from("paintings").select("*").eq("slug", slug).single();
      if (data) return normalizePainting(data);
    } catch {}
  }
  return null;
}

async function fetchRelated(painting: Painting): Promise<Painting[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data } = await supabase
        .from("paintings")
        .select("*")
        .neq("slug", painting.slug)
        .eq("available", true)
        .limit(3)
        .order("sort_order");
      if (data && data.length > 0) return data.map(normalizePainting);
    } catch {}
  }
  const { PAINTINGS } = await import("@/lib/paintings");
  return PAINTINGS.filter(
    (p) => p.id !== painting.id && p.available && p.tags.some((t) => painting.tags.includes(t))
  ).slice(0, 3);
}

function normalizePainting(d: Record<string, unknown>): Painting {
  return {
    id: d.id as string,
    slug: d.slug as string,
    title: d.title as string,
    medium: d.medium as string,
    dimensions: d.dimensions as string,
    year: d.year as number,
    price: parseFloat(String(d.price)),
    original_price: d.original_price ? parseFloat(String(d.original_price)) : undefined,
    available: d.available as boolean,
    featured: d.featured as boolean,
    image: d.image_url as string,
    description: (d.description as string) ?? "",
    tags: (d.tags as string[]) ?? [],
  };
}

export default async function PaintingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const painting = await fetchPainting(slug);
  if (!painting) notFound();
  const related = await fetchRelated(painting);

  return (
    <>
      <section className="pt-24 pb-20 bg-[#F2EDE3]">
        <div className="max-w-7xl mx-auto px-6 md:px-10">

          {/* Back button */}
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-[#18160F]/40 hover:text-[#7C3020] transition-colors mb-10"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            ← Back to Shop
          </Link>

          <div className="grid md:grid-cols-[58%_1fr] gap-14 items-start">
            {/* Image */}
            <div className="relative aspect-[4/5] overflow-hidden bg-[#E4DDD2]">
              <Image src={painting.image} alt={painting.title} fill className="object-cover" priority />
              {!painting.available && (
                <div className="absolute top-4 left-4">
                  <span className="text-[9px] tracking-[0.25em] uppercase bg-[#18160F]/80 text-[#F2EDE3] px-3 py-1.5">
                    Sold
                  </span>
                </div>
              )}
            </div>

            {/* Details */}
            <div className="flex flex-col py-2">
              <div className="mb-6">
                {painting.available ? (
                  <span className="text-[10px] tracking-[0.2em] uppercase text-[#4A5240] border border-[#4A5240]/40 px-2.5 py-1.5">
                    Available
                  </span>
                ) : (
                  <span className="text-[10px] tracking-[0.2em] uppercase text-[#18160F]/30 border border-[#18160F]/20 px-2.5 py-1.5">
                    Sold · Private Collection
                  </span>
                )}
              </div>

              <h1 className="text-4xl md:text-5xl font-light text-[#18160F] mb-8 leading-tight" style={{ fontFamily: "var(--font-serif)" }}>
                {painting.title}
              </h1>

              <dl className="space-y-3 mb-8 pb-8 border-b border-[#18160F]/8">
                {[["Medium", painting.medium], ["Dimensions", painting.dimensions], ["Year", painting.year.toString()]].map(([label, val]) => (
                  <div key={label} className="flex gap-6">
                    <dt className="text-[10px] tracking-[0.15em] uppercase text-[#18160F]/30 w-24 pt-0.5" style={{ fontFamily: "var(--font-sans)" }}>
                      {label}
                    </dt>
                    <dd className="text-sm text-[#18160F]/80">{val}</dd>
                  </div>
                ))}
              </dl>

              {painting.available && (
                <div className="flex items-baseline gap-4 mb-8">
                  <p className="text-3xl text-[#18160F] font-light" style={{ fontFamily: "var(--font-serif)" }}>
                    ${painting.price.toLocaleString()}
                  </p>
                  {painting.original_price && painting.original_price > painting.price && (
                    <p className="text-lg text-[#18160F]/30 line-through">${painting.original_price.toLocaleString()}</p>
                  )}
                </div>
              )}

              <p className="text-[#18160F]/65 text-[15px] leading-relaxed mb-10">{painting.description}</p>

              {painting.available ? (
                <Link
                  href={`/inquire?painting=${encodeURIComponent(painting.title)}`}
                  className="text-center text-[11px] tracking-[0.2em] uppercase px-8 py-4 bg-[#18160F] text-[#F2EDE3] hover:bg-[#7C3020] transition-colors"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  Inquire to Purchase
                </Link>
              ) : (
                <Link
                  href="/commissions"
                  className="text-center text-[11px] tracking-[0.2em] uppercase px-8 py-4 border border-[#18160F]/20 text-[#18160F]/60 hover:border-[#7C3020] hover:text-[#7C3020] transition-colors"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  Commission a Similar Work
                </Link>
              )}

              <p className="text-[11px] text-[#18160F]/30 mt-6 leading-relaxed">
                All works come with a certificate of authenticity, care instructions, and are shipped fully insured.
              </p>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="py-20 bg-[#E4DDD2]">
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#7C3020] mb-3" style={{ fontFamily: "var(--font-sans)" }}>
              Continue Exploring
            </p>
            <h2 className="text-3xl font-light text-[#18160F] mb-10" style={{ fontFamily: "var(--font-serif)" }}>
              More Works
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {related.map((p) => (
                <Link key={p.id} href={`/shop/${p.slug}`} className="img-zoom group block">
                  <div className="relative aspect-[4/5] overflow-hidden bg-[#D0C8BC] mb-3">
                    <Image src={p.image} alt={p.title} fill className="object-cover" />
                  </div>
                  <h3 className="text-base font-light text-[#18160F]" style={{ fontFamily: "var(--font-serif)" }}>{p.title}</h3>
                  <p className="text-[11px] text-[#18160F]/40 mt-0.5">{p.medium} · {p.available ? `$${p.price.toLocaleString()}` : "Sold"}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
