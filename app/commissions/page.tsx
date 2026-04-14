"use client";

import Link from "next/link";
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
      {/* Hero */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-[#2C2825] to-[#3d3530]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p
            className="text-xs tracking-[0.3em] uppercase text-[#8B6914] mb-5"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Custom Commissions
          </p>
          <h1
            className="text-5xl md:text-7xl font-light text-[#F7F5F0] mb-6"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Bring Your Vision<br /><em>to Life</em>
          </h1>
          <p className="text-[#F7F5F0]/60 max-w-xl mx-auto leading-relaxed">
            A commissioned painting is the most personal form of art ownership. I work directly with each collector to create something entirely their own.
          </p>
        </div>
      </section>

      {/* How it works — 4-step timeline */}
      <section className="py-20 bg-[#F7F5F0]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-light text-[#2C2825]" style={{ fontFamily: "var(--font-serif)" }}>
              How Commissions Work
            </h2>
          </div>
          <div className="relative grid md:grid-cols-4 gap-8">
            {/* Line */}
            <div className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-px bg-[#8B6914]/30" />
            {[
              { num: "1", title: "Consultation", desc: "We discuss your vision — subject, size, medium, color palette, and intended space. No commitment required." },
              { num: "2", title: "Deposit", desc: "A 50% deposit secures your place on the schedule. I'll send a detailed quote and timeline before you commit." },
              { num: "3", title: "Creation", desc: "I paint with regular progress updates. You're invited to give feedback at key milestones before the work is complete." },
              { num: "4", title: "Delivery", desc: "The final 50% is due before shipping. Your painting arrives insured, with a certificate of authenticity and care guide." },
            ].map((step) => (
              <div key={step.num} className="relative flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full border-2 border-[#8B6914] flex items-center justify-center mb-4 bg-[#F7F5F0] z-10">
                  <span className="text-xl text-[#8B6914]" style={{ fontFamily: "var(--font-serif)" }}>{step.num}</span>
                </div>
                <h3 className="text-lg text-[#2C2825] mb-2" style={{ fontFamily: "var(--font-serif)" }}>
                  {step.title}
                </h3>
                <p className="text-sm text-[#2C2825]/60 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Factors */}
      <section className="py-20 bg-[#EBE8E1]">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-light text-[#2C2825] mb-10 text-center" style={{ fontFamily: "var(--font-serif)" }}>
            Pricing Factors
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { label: "Size", desc: "Larger works require more time and materials." },
              { label: "Medium", desc: "Oil commissions are priced higher than acrylic or watercolor due to drying/curing time." },
              { label: "Complexity", desc: "Detailed figurative work, multiple subjects, or complex backgrounds affect pricing." },
              { label: "Timeline", desc: "Rush commissions (under 4 weeks) carry a 25% premium." },
            ].map((item) => (
              <div key={item.label} className="bg-[#F7F5F0] rounded-lg p-6">
                <h3 className="text-base text-[#2C2825] mb-2" style={{ fontFamily: "var(--font-serif)" }}>
                  {item.label}
                </h3>
                <p className="text-sm text-[#2C2825]/70">{item.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-[#2C2825]/60 mt-8">
            Most commissions fall between <strong className="text-[#2C2825]">$600 and $4,000</strong>. I&apos;ll send a detailed quote before you commit to anything.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-[#F7F5F0]">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-light text-[#2C2825] mb-10 text-center" style={{ fontFamily: "var(--font-serif)" }}>
            Frequently Asked Questions
          </h2>
          <div className="space-y-1">
            {FAQ_ITEMS.map((item, i) => (
              <div key={i} className="border-b border-[#EBE8E1]">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex justify-between items-center py-5 text-left"
                >
                  <span className="text-base text-[#2C2825]" style={{ fontFamily: "var(--font-serif)" }}>
                    {item.q}
                  </span>
                  <span className="text-[#8B6914] text-xl ml-4">
                    {openFaq === i ? "−" : "+"}
                  </span>
                </button>
                {openFaq === i && (
                  <p className="text-sm text-[#2C2825]/70 pb-5 leading-relaxed">{item.a}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Commission Form */}
      <section className="py-20 bg-[#EBE8E1]" id="inquire">
        <div className="max-w-2xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light text-[#2C2825] mb-3" style={{ fontFamily: "var(--font-serif)" }}>
              Start Your Commission
            </h2>
            <p className="text-sm text-[#2C2825]/60">
              Tell me what you have in mind. No commitment, no pressure.
            </p>
          </div>

          {submitted ? (
            <div className="text-center py-12 bg-[#F7F5F0] rounded-xl px-8">
              <div className="text-4xl mb-4">✦</div>
              <h3 className="text-xl text-[#2C2825] mb-3" style={{ fontFamily: "var(--font-serif)" }}>
                Thank you!
              </h3>
              <p className="text-[#2C2825]/70 text-sm mb-6 leading-relaxed">
                I'll be in touch within 2–3 business days to discuss your vision and send a quote.
              </p>
              <a
                href="https://www.instagram.com/katelynmechelle_/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[#8B6914] hover:underline"
              >
                Follow along on Instagram →
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 bg-[#F7F5F0] rounded-xl p-8">
              <div className="grid sm:grid-cols-2 gap-5">
                <FormField label="Full Name *" type="text" value={form.full_name} onChange={(v) => setForm({ ...form, full_name: v })} required />
                <FormField label="Email *" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required />
              </div>
              <FormField label="Phone" type="tel" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
              <FormField label="Subject / Working Title" type="text" placeholder="e.g. Portrait of my horse, Autumn landscape for living room..." value={form.subject} onChange={(v) => setForm({ ...form, subject: v })} />
              <div>
                <label className="block text-xs text-[#2C2825]/60 tracking-wide mb-1.5">Commission Description</label>
                <textarea
                  rows={4}
                  placeholder="Describe what you have in mind — subject, setting, mood, size, any reference images..."
                  value={form.commission_description}
                  onChange={(e) => setForm({ ...form, commission_description: e.target.value })}
                  className="w-full border-b-2 border-[#EBE8E1] focus:border-[#8B6914] bg-transparent py-2 text-sm text-[#2C2825] outline-none resize-none transition-colors"
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <FormSelect label="Budget Range" value={form.budget_range} onChange={(v) => setForm({ ...form, budget_range: v })}
                  options={["", "Under $500", "$500–$1,500", "$1,500–$3,000", "$3,000+"]} />
                <FormSelect label="Timeline" value={form.timeline} onChange={(v) => setForm({ ...form, timeline: v })}
                  options={["", "Flexible (no rush)", "3–6 months", "6–12 weeks", "Under 4 weeks (rush)"]} />
              </div>
              <FormSelect label="How did you hear about me?" value={form.source} onChange={(v) => setForm({ ...form, source: v })}
                options={["", "Instagram", "Referral", "Google", "Other"]} />
              <div>
                <label className="block text-xs text-[#2C2825]/60 tracking-wide mb-1.5">Anything else?</label>
                <textarea
                  rows={3}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full border-b-2 border-[#EBE8E1] focus:border-[#8B6914] bg-transparent py-2 text-sm text-[#2C2825] outline-none resize-none transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-[#2C2825] text-[#F7F5F0] text-sm tracking-wide hover:bg-[#8B6914] transition-colors rounded-sm disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send Commission Inquiry"}
              </button>
            </form>
          )}
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
      <label className="block text-xs text-[#2C2825]/60 tracking-wide mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        className="w-full border-b-2 border-[#EBE8E1] focus:border-[#8B6914] bg-transparent py-2 text-sm text-[#2C2825] outline-none transition-colors placeholder:text-[#2C2825]/30"
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
      <label className="block text-xs text-[#2C2825]/60 tracking-wide mb-1.5">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border-b-2 border-[#EBE8E1] focus:border-[#8B6914] bg-transparent py-2 text-sm text-[#2C2825] outline-none transition-colors"
      >
        {options.map((o) => (
          <option key={o} value={o}>{o || "Select…"}</option>
        ))}
      </select>
    </div>
  );
}
