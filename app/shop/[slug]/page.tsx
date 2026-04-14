import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getPaintingBySlug, getRelatedPaintings, getAllSlugs } from "@/lib/paintings";

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const painting = getPaintingBySlug(slug);
  if (!painting) return {};
  return {
    title: `${painting.title} | Katelyn Cook`,
    description: painting.description,
  };
}

export default async function PaintingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const painting = getPaintingBySlug(slug);
  if (!painting) notFound();

  const related = getRelatedPaintings(painting);

  return (
    <>
      <section className="pt-24 pb-16 bg-[#F7F5F0]">
        <div className="max-w-7xl mx-auto px-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-[#2C2825]/50 mb-8">
            <Link href="/shop" className="hover:text-[#8B6914] transition-colors">Shop</Link>
            <span>/</span>
            <span className="text-[#2C2825]">{painting.title}</span>
          </nav>

          <div className="grid md:grid-cols-[60%_1fr] gap-12">
            {/* Image */}
            <div className="relative aspect-[4/5] rounded-xl overflow-hidden shadow-lg">
              <Image
                src={painting.image}
                alt={painting.title}
                fill
                className="object-cover"
                priority
              />
              {!painting.available && (
                <div className="absolute top-4 left-4">
                  <span className="bg-[#2C2825] text-white text-xs tracking-[0.2em] uppercase px-3 py-1.5 rounded-sm">
                    Sold
                  </span>
                </div>
              )}
            </div>

            {/* Details */}
            <div className="flex flex-col py-4">
              <div className="mb-2">
                {painting.available ? (
                  <span className="text-xs tracking-[0.2em] uppercase text-[#5C6B5A] border border-[#5C6B5A] px-2.5 py-1 rounded-sm">
                    Available
                  </span>
                ) : (
                  <span className="text-xs tracking-[0.2em] uppercase text-[#2C2825]/50 border border-[#2C2825]/30 px-2.5 py-1 rounded-sm">
                    Sold · Private Collection
                  </span>
                )}
              </div>

              <h1
                className="text-4xl md:text-5xl font-light text-[#2C2825] mt-4 mb-6 leading-tight"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {painting.title}
              </h1>

              <dl className="space-y-2 mb-8">
                {[
                  ["Medium", painting.medium],
                  ["Dimensions", painting.dimensions],
                  ["Year", painting.year.toString()],
                ].map(([label, val]) => (
                  <div key={label} className="flex gap-4">
                    <dt className="text-xs text-[#2C2825]/50 w-24 pt-0.5">{label}</dt>
                    <dd className="text-sm text-[#2C2825]">{val}</dd>
                  </div>
                ))}
              </dl>

              {painting.available && (
                <p className="text-3xl text-[#8B6914] font-light mb-8" style={{ fontFamily: "var(--font-serif)" }}>
                  ${painting.price.toLocaleString()}
                </p>
              )}

              <p className="text-[#2C2825]/70 text-sm leading-relaxed mb-8">
                {painting.description}
              </p>

              {painting.available ? (
                <Link
                  href={`/inquire?painting=${encodeURIComponent(painting.title)}`}
                  className="text-center px-8 py-4 bg-[#2C2825] text-[#F7F5F0] text-sm tracking-wide hover:bg-[#8B6914] transition-colors rounded-sm"
                >
                  Inquire to Purchase
                </Link>
              ) : (
                <Link
                  href="/commissions"
                  className="text-center px-8 py-4 border border-[#2C2825] text-[#2C2825] text-sm tracking-wide hover:border-[#8B6914] hover:text-[#8B6914] transition-colors rounded-sm"
                >
                  Commission a Similar Work
                </Link>
              )}

              <p className="text-xs text-[#2C2825]/40 mt-6 leading-relaxed">
                All works come with a certificate of authenticity, care instructions, and are shipped insured with tracking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Related Works */}
      {related.length > 0 && (
        <section className="py-16 bg-[#EBE8E1]">
          <div className="max-w-7xl mx-auto px-6">
            <h2
              className="text-2xl font-light text-[#2C2825] mb-10"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {related.map((p) => (
                <Link key={p.id} href={`/shop/${p.slug}`} className="group block">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-lg shadow-sm mb-3">
                    <Image
                      src={p.image}
                      alt={p.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <h3 className="text-base text-[#2C2825]" style={{ fontFamily: "var(--font-serif)" }}>
                    {p.title}
                  </h3>
                  <p className="text-xs text-[#2C2825]/60 mt-0.5">
                    {p.medium} · {p.available ? `$${p.price.toLocaleString()}` : "Sold"}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
