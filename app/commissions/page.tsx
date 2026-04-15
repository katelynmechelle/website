"use client";

import Image from "next/image";
import { useState } from "react";

const FAQ_ITEMS = [
  {
    q: "How long does a commission take?",
    a: "Most commissions take 6–12 weeks from deposit to delivery, depending on size, complexity, and my current schedule. I'll give you a specific timeline before we begin, and you'll receive progress photos along the way.",
  },
  {
    q: "Do you ship internationally?",
    a: "Yes. I ship worldwide, fully insured with tracking. International shipping typically adds 2–3 weeks and is priced based on destination and painting size. All duties and customs fees are the buyer's responsibility.",
  },
  {
    q: "Can I see progress photos?",
    a: "Absolutely. I share progress at key stages — typically after the underpainting, mid-development, and before final glazing. You're welcome to give input at these check-ins.",
  },
  {
    q: "What if I'm not happy with the result?",
    a: "I work collaboratively to make sure we're aligned before I start painting. If something isn't right at the progress stage, we address it then. Final satisfaction is a genuine priority — I'll make reasonable adjustments at the final review stage.",
  },
  {
    q: "How does pricing work?",
    a: "Commissions are priced based on size, medium, complexity, and timeline. A small study in oil might start around $600; a large, detailed work could be $4,000+. I'll send a detailed quote after our initial consultation.",
  },
  {
    q: "Do you require a deposit?",
    a: "Yes — a 50% deposit secures your spot on my schedule. The remaining 50% is due before shipment. Deposits are non-refundable once painting has begun, but I'll always discuss options if something unexpected comes up.",
  },
];

export default function CommissionsPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    subject: "",
    commission_description: "",
    budget_range: "",
    timeline: "",
    source: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/inquire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, inquiry_type: "commission" }),
      });
      if (res.ok) setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ── HERO ── */}
      <section className="relative min-h-[80vh] bg-[#18160F] flex items-end overflow-hidden">
        {/* Background painting — softly lit */}
        <div className="absolute inset-0">
          <Image
            src="/IMG_8638.jpeg"
            alt="Commission painting detail"
            fill
            className="object-cover opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#18160F] via-[#18160F]/60 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 md:px-10 pb-24 pt-40 w-full">
          <p
            className="text-[10px] tracking-[0.3em] uppercase text-[#7C3020] mb-6"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Custom Commissions
          </p>
          <h1
            className="text-5xl md:text-7xl lg:text-8xl font-light text-[#F2EDE3] leading-[0.9] max-w-3xl"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            A painting made<br />
            <em>only for you</em>
          </h1>
          <p className="mt-8 text-[#F2EDE3]/50 text-base max-w-md leading-relaxed">
            The most personal form of art ownership. We begin with a conversation, and end with something singular.
          </p>
        </div>
      </section>

      {/* ── NARRATIVE INTRO ── */}
      <section className="py-28 bg-[#F2EDE3]">
        <div className="max-w-7xl mx-auto px-6 md:px-10 grid md:grid-cols-2 gap-20 items-center">
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#7C3020] mb-6" style={{ fontFamily: "var(--font-sans)" }}>
              The Process
            </p>
            <h2
              className="text-4xl md:text-5xl font-light text-[#18160F] leading-tight mb-10"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              We begin with<br />a conversation
            </h2>
            <div className="space-y-5 text-[#18160F]/70 leading-relaxed text-[15px]">
              <p>
                Every commission starts the same way — you tell me about something you love. A horse with a particular way of standing in morning light. A stretch of land that means something to you. A memory you want to hold onto.
              </p>
              <p>
                From there, I work through sketches and color studies until we have a direction that feels right to both of us. You&apos;ll receive progress photos at every significant stage, and your input shapes the outcome.
              </p>
              <p>
                What arrives at your door is something made specifically for you — not a print, not a reproduction. One original painting that belongs to your life.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/5] relative overflow-hidden bg-[#E4DDD2]">
              <Image
                src="/IMG_2604.jpeg"
                alt="Artist at work on a commission"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-[#7C3020]/8 -z-10" />
          </div>
        </div>
      </section>

      {/* ── PAST COMMISSIONS STRIP ── */}
      <section className="py-20 bg-[#E4DDD2]">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <p className="text-[10px] tracking-[0.3em] uppercase text-[#7C3020] mb-10" style={{ fontFamily: "var(--font-sans)" }}>
            Past Commissions
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
            {[
              { img: "/IMG_7946.jpeg", caption: "Equestrian portrait · 24×30″" },
              { img: "/IMG_9262.jpeg", caption: "Custom landscape · 18×24″" },
              { img: "/IMG_6750.jpeg", caption: "Animal study · 12×16″" },
              { img: "/IMG_6326.jpeg", caption: "Large commission · 30×40″" },
            ].map((item, i) => (
              <div key={i} className="img-zoom">
                <div className="relative aspect-[4/5] overflow-hidden bg-[#D0C8BC]">
                  <Image src={item.img} alt={item.caption} fill className="object-cover" />
                </div>
                <p className="mt-2.5 text-[10px] tracking-[0.15em] uppercase text-[#18160F]/40" style={{ fontFamily: "var(--font-sans)" }}>
                  {item.caption}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS — STEPS ── */}
      <section className="py-28 bg-[#F2EDE3]">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="mb-16">
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#7C3020] mb-3" style={{ fontFamily: "var(--font-sans)" }}>
              How It Works
            </p>
            <h2 className="text-4xl font-light text-[#18160F]" style={{ fontFamily: "var(--font-serif)" }}>
              From concept to completion
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-0">
            {[
              {
                num: "01",
                title: "Consultation",
                desc: "We discuss your vision — subject, size, medium, color palette, intended space. No commitment required.",
              },
              {
                num: "02",
                title: "Deposit & Timeline",
                desc: "A 50% deposit secures your place on the schedule. I'll send a detailed quote and specific timeline before you commit.",
              },
              {
                num: "03",
                title: "Creation",
                desc: "I paint with regular progress updates. You're invited to give feedback at key milestones before the work is complete.",
              },
              {
                num: "04",
                title: "Delivery",
                desc: "Final balance due before shipment. Your painting arrives insured, with a certificate of authenticity and care guide.",
              },
            ].map((step, i) => (
              <div key={step.num} className={`py-10 px-8 border-t border-[#18160F]/10 ${i > 0 ? "md:border-l" : ""}`}>
                <p className="text-[10px] tracking-[0.3em] uppercase text-[#7C3020]/60 mb-6" style={{ fontFamily: "var(--font-sans)" }}>
                  {step.num}
                </p>
                <h3 className="text-xl font-light text-[#18160F] mb-4" style={{ fontFamily: "var(--font-serif)" }}>
                  {step.title}
                </h3>
                <p className="text-sm text-[#18160F]/60 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section className="py-20 bg-[#18160F]">
        <div className="max-w-7xl mx-auto px-6 md:px-10 grid md:grid-cols-2 gap-16 items-start">
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#7C3020] mb-6" style={{ fontFamily: "var(--font-sans)" }}>
              Investment
            </p>
            <h2 className="text-4xl font-light text-[#F2EDE3] mb-6" style={{ fontFamily: "var(--font-serif)" }}>
              Pricing
            </h2>
            <p className="text-[#F2EDE3]/50 leading-relaxed mb-8 text-[15px]">
              Most commissions fall between <span className="text-[#F2EDE3]/80">$600 and $4,000</span>. I&apos;ll send a detailed quote before you commit to anything.
            </p>
            <div className="space-y-4">
              {[
                { label: "Small Study", range: "8×10″ – 12×16″", price: "From $600" },
                { label: "Mid-size Work", range: "16×20″ – 24×30″", price: "From $1,200" },
                { label: "Large Painting", range: "30×40″ and above", price: "From $2,800" },
              ].map((tier) => (
                <div key={tier.label} className="flex items-center justify-between py-4 border-b border-[#F2EDE3]/8">
                  <div>
                    <p className="text-sm text-[#F2EDE3]/80" style={{ fontFamily: "var(--font-serif)" }}>{tier.label}</p>
                    <p className="text-[11px] text-[#F2EDE3]/30 mt-0.5">{tier.range}</p>
                  </div>
                  <p className="text-sm text-[#7C3020]">{tier.price}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#7C3020] mb-6" style={{ fontFamily: "var(--font-sans)" }}>
              What Affects Pricing
            </p>
            {[
              { label: "Size", desc: "Larger works require significantly more time and materials." },
              { label: "Medium", desc: "Oil commissions are priced higher than acrylic or watercolor due to drying and curing time." },
              { label: "Complexity", desc: "Detailed figurative work, multiple subjects, or complex backgrounds affect the final price." },
              { label: "Timeline", desc: "Rush commissions (under 4 weeks) carry a 25% premium." },
            ].map((item) => (
              <div key={item.label} className="border border-[#F2EDE3]/8 p-5">
                <h3 className="text-sm text-[#F2EDE3]/80 mb-1" style={{ fontFamily: "var(--font-serif)" }}>
                  {item.label}
                </h3>
                <p className="text-[13px] text-[#F2EDE3]/40 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-28 bg-[#F2EDE3]">
        <div className="max-w-3xl mx-auto px-6 md:px-10">
          <h2 className="text-3xl font-light text-[#18160F] mb-14" style={{ fontFamily: "var(--font-serif)" }}>
            Questions
          </h2>
          <div className="space-y-0">
            {FAQ_ITEMS.map((item, i) => (
              <div key={i} className="border-b border-[#18160F]/8">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex justify-between items-center py-6 text-left gap-8"
                >
                  <span className="text-base text-[#18160F]" style={{ fontFamily: "var(--font-serif)" }}>
                    {item.q}
                  </span>
                  <span
                    className={`text-[#7C3020] text-xl shrink-0 transition-transform duration-200 ${openFaq === i ? "rotate-45" : ""}`}
                    aria-hidden
                  >
                    +
                  </span>
                </button>
                {openFaq === i && (
                  <p className="text-sm text-[#18160F]/60 pb-6 leading-relaxed pr-10">{item.a}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMMISSION FORM ── */}
      <section className="py-28 bg-[#E4DDD2]" id="inquire">
        <div className="max-w-7xl mx-auto px-6 md:px-10 grid md:grid-cols-2 gap-20">
          {/* Left: context */}
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#7C3020] mb-6" style={{ fontFamily: "var(--font-sans)" }}>
              Start Here
            </p>
            <h2
              className="text-4xl md:text-5xl font-light text-[#18160F] leading-tight mb-8"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Tell me about<br />your vision
            </h2>
            <p className="text-[#18160F]/60 leading-relaxed text-[15px] mb-8">
              Use this form to share your ideas — no commitment, no pressure. I respond to every inquiry personally within a few days, usually faster.
            </p>
            <div className="space-y-4 text-[13px] text-[#18160F]/50">
              <div className="flex items-start gap-3">
                <span className="text-[#7C3020] mt-0.5">→</span>
                <span>Tell me what you have in mind — even a rough idea is enough to start</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-[#7C3020] mt-0.5">→</span>
                <span>Reference photos and inspiration are always welcome</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-[#7C3020] mt-0.5">→</span>
                <span>I&apos;ll follow up with a quote and timeline before anything is finalized</span>
              </div>
            </div>
          </div>

          {/* Right: form */}
          <div>
            {submitted ? (
              <div className="bg-[#F2EDE3] p-10 h-full flex flex-col justify-center">
                <p className="text-[10px] tracking-[0.3em] uppercase text-[#7C3020] mb-5" style={{ fontFamily: "var(--font-sans)" }}>
                  Received
                </p>
                <h3 className="text-3xl font-light text-[#18160F] mb-5" style={{ fontFamily: "var(--font-serif)" }}>
                  Thank you.
                </h3>
                <p className="text-[#18160F]/60 text-sm leading-relaxed mb-8">
                  I&apos;ll be in touch within 2–3 business days to discuss your vision and send a detailed quote.
                </p>
                <a
                  href="https://www.instagram.com/katelynmechelle_/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] tracking-[0.2em] uppercase text-[#18160F]/40 hover:text-[#7C3020] transition-colors"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  Follow on Instagram →
                </a>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <FormField label="Full Name *" type="text" value={form.full_name} onChange={(v) => setForm({ ...form, full_name: v })} required />
                  <FormField label="Email *" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required />
                </div>
                <FormField label="Phone" type="tel" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
                <FormField
                  label="Subject / Working Title"
                  type="text"
                  placeholder="e.g. Portrait of my horse, autumn landscape for living room…"
                  value={form.subject}
                  onChange={(v) => setForm({ ...form, subject: v })}
                />
                <div>
                  <label className="block text-[10px] tracking-[0.15em] uppercase text-[#18160F]/50 mb-2" style={{ fontFamily: "var(--font-sans)" }}>
                    Commission Description
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Describe what you have in mind — subject, setting, mood, size, reference images…"
                    value={form.commission_description}
                    onChange={(e) => setForm({ ...form, commission_description: e.target.value })}
                    className="w-full border-b border-[#18160F]/15 focus:border-[#7C3020] bg-transparent py-2 text-sm text-[#18160F] outline-none resize-none transition-colors placeholder:text-[#18160F]/25"
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-6">
                  <FormSelect
                    label="Budget Range"
                    value={form.budget_range}
                    onChange={(v) => setForm({ ...form, budget_range: v })}
                    options={["", "Under $500", "$500–$1,500", "$1,500–$3,000", "$3,000+"]}
                  />
                  <FormSelect
                    label="Timeline"
                    value={form.timeline}
                    onChange={(v) => setForm({ ...form, timeline: v })}
                    options={["", "Flexible (no rush)", "3–6 months", "6–12 weeks", "Under 4 weeks (rush)"]}
                  />
                </div>
                <FormSelect
                  label="How did you hear about me?"
                  value={form.source}
                  onChange={(v) => setForm({ ...form, source: v })}
                  options={["", "Instagram", "Referral", "Google", "Other"]}
                />
                <div>
                  <label className="block text-[10px] tracking-[0.15em] uppercase text-[#18160F]/50 mb-2" style={{ fontFamily: "var(--font-sans)" }}>
                    Anything else?
                  </label>
                  <textarea
                    rows={3}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full border-b border-[#18160F]/15 focus:border-[#7C3020] bg-transparent py-2 text-sm text-[#18160F] outline-none resize-none transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-[#18160F] text-[#F2EDE3] text-[11px] tracking-[0.2em] uppercase hover:bg-[#7C3020] transition-colors disabled:opacity-50"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  {loading ? "Sending…" : "Send Commission Inquiry"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

function FormField({
  label,
  type,
  value,
  onChange,
  required,
  placeholder,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label
        className="block text-[10px] tracking-[0.15em] uppercase text-[#18160F]/50 mb-2"
        style={{ fontFamily: "var(--font-sans)" }}
      >
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        className="w-full border-b border-[#18160F]/15 focus:border-[#7C3020] bg-transparent py-2 text-sm text-[#18160F] outline-none transition-colors placeholder:text-[#18160F]/25"
      />
    </div>
  );
}

function FormSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div>
      <label
        className="block text-[10px] tracking-[0.15em] uppercase text-[#18160F]/50 mb-2"
        style={{ fontFamily: "var(--font-sans)" }}
      >
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border-b border-[#18160F]/15 focus:border-[#7C3020] bg-transparent py-2 text-sm text-[#18160F] outline-none transition-colors"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o || "Select…"}
          </option>
        ))}
      </select>
    </div>
  );
}
