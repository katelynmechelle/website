import Link from "next/link";
import Image from "next/image";

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-[#EBE8E1]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p
            className="text-xs tracking-[0.3em] uppercase text-[#8B6914] mb-5"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            The Artist
          </p>
          <h1
            className="text-5xl md:text-7xl font-light text-[#2C2825] mb-4"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Katelyn Mechelle
          </h1>
          <p className="text-[#2C2825]/60 text-lg">Painter · Nashville, TN</p>
        </div>
      </section>

      {/* Long-form Story */}
      <section className="py-24 bg-[#F7F5F0]">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-[1fr_40%] gap-16 items-start">
          <div>
            <p
              className="text-xs tracking-[0.3em] uppercase text-[#8B6914] mb-6"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Story
            </p>
            <div className="prose prose-lg text-[#2C2825]/80 leading-relaxed space-y-5">
              <p>
                Katelyn Mechelle came to painting the way most people come to things that matter — slowly, then suddenly. Raised around horses and open land, her earliest visual education happened not in classrooms but in barns and fields: the particular bronze of a chestnut coat in afternoon light, the geometry of a horse&apos;s eye, the way green deepens in shadow.
              </p>
              <p>
                She studied fine art with a focus on traditional oil painting techniques, learning the slow discipline of layered grounds, lead-white underpaintings, and the glazing methods of the Old Masters. That rigor shows in her work — not as stiffness, but as depth. Her surfaces have a quality of presence that digital reproductions rarely capture.
              </p>
              <p>
                Today, Katelyn works from a studio in Nashville, taking commissions and selling original work to collectors across the country. Her subjects are almost always drawn from life — horses, animals, landscapes — painted with the conviction that the natural world is still the most compelling thing to look at.
              </p>
              <p>
                She posts regularly on Instagram <a href="https://www.instagram.com/katelynmechelle_/" className="text-[#8B6914] hover:underline" target="_blank" rel="noopener noreferrer">@katelynmechelle_</a>, where you can follow her studio practice and see new work as it develops.
              </p>
            </div>
          </div>
          <div className="relative md:sticky md:top-28">
            <div className="aspect-[4/5] relative rounded-xl overflow-hidden shadow-lg">
              <Image
                src="/IMG_2604.jpeg"
                alt="Katelyn Mechelle"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Studio Section */}
      <section className="py-20 bg-[#EBE8E1]">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1">
            <div className="aspect-[4/3] relative rounded-xl overflow-hidden shadow-md">
              <Image
                src="/AED3527A-5B71-4686-84CA-2843388D2F64.jpeg"
                alt="Katelyn Mechelle's Studio"
                fill
                className="object-cover"
              />
            </div>
          </div>
          <div className="order-1 md:order-2">
            <p
              className="text-xs tracking-[0.3em] uppercase text-[#8B6914] mb-4"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              The Studio
            </p>
            <h2 className="text-3xl md:text-4xl font-light text-[#2C2825] mb-6" style={{ fontFamily: "var(--font-serif)" }}>
              Where the Work Happens
            </h2>
            <p className="text-[#2C2825]/70 leading-relaxed mb-4">
              The studio is a converted space filled with natural light, the smell of linseed oil, and shelves of pigments from small-batch suppliers. Katelyn works on multiple pieces simultaneously, allowing layers to cure properly between sessions.
            </p>
            <p className="text-[#2C2825]/70 leading-relaxed">
              She often works from life or from extensive preliminary sketches and studies. The process is unhurried — a painting is finished when it&apos;s finished, not before.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-[#F7F5F0]">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-light text-[#2C2825] mb-12 text-center" style={{ fontFamily: "var(--font-serif)" }}>
            Approach & Values
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Intentional Work",
                desc: "Every painting is considered before it&apos;s started. Katelyn doesn&apos;t produce volume — she produces work worth living with.",
              },
              {
                title: "Built to Last",
                desc: "Traditional oil painting materials and techniques mean these works will outlast us. They&apos;re made with archival grounds, quality pigments, and museum-grade varnish.",
              },
              {
                title: "Every Piece is Unique",
                desc: "No prints, no editions. When you own a Katelyn Mechelle painting, you own the only one in existence. That&apos;s not a marketing line — it&apos;s just the truth.",
              },
            ].map((v) => (
              <div key={v.title} className="bg-[#EBE8E1] rounded-xl p-8">
                <div className="w-8 h-px bg-[#8B6914] mb-5" />
                <h3 className="text-xl text-[#2C2825] mb-3" style={{ fontFamily: "var(--font-serif)" }}>
                  {v.title}
                </h3>
                <p className="text-sm text-[#2C2825]/70 leading-relaxed" dangerouslySetInnerHTML={{ __html: v.desc }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Press & Exhibitions */}
      <section className="py-20 bg-[#EBE8E1]">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-light text-[#2C2825] mb-10 text-center" style={{ fontFamily: "var(--font-serif)" }}>
            Exhibitions & Collections
          </h2>
          <div className="space-y-4">
            {[
              { year: "2024", item: "Works in Private Collections, Nashville, TN & Lexington, KY" },
              { year: "2024", item: "Equine Art Exhibition — Nashville, TN (Group Show)" },
              { year: "2023", item: "Studio Open House — Original works sold to collectors in 8 states" },
              { year: "2023", item: "Featured: @katelynmechelle_ Instagram — 10K+ followers" },
              { year: "2022", item: "First solo commission series: The Horses of Kentucky" },
            ].map((e, i) => (
              <div key={i} className="flex gap-6 items-start border-b border-[#F7F5F0] pb-4">
                <span className="text-xs text-[#8B6914] w-10 shrink-0 pt-0.5">{e.year}</span>
                <p className="text-sm text-[#2C2825]/80">{e.item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#2C2825]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-light text-[#F7F5F0] mb-6" style={{ fontFamily: "var(--font-serif)" }}>
            Interested in working together?
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/shop"
              className="px-7 py-3.5 bg-[#8B6914] text-white text-sm tracking-wide hover:bg-[#7a5c10] transition-colors rounded-sm"
            >
              Shop Available Works
            </Link>
            <Link
              href="/commissions"
              className="px-7 py-3.5 border border-[#F7F5F0]/40 text-[#F7F5F0] text-sm tracking-wide hover:border-[#8B6914] hover:text-[#8B6914] transition-colors rounded-sm"
            >
              Request a Commission
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
