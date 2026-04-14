"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function InquireForm() {
  const searchParams = useSearchParams();
  const prefilledPainting = searchParams.get("painting") ?? "";

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    inquiry_type: "purchase" as "purchase" | "commission" | "general",
    painting_interest: prefilledPainting,
    commission_description: "",
    budget_range: "",
    timeline: "",
    source: "",
    message: "",
  });

  useEffect(() => {
    if (prefilledPainting) {
      setForm((f) => ({ ...f, painting_interest: prefilledPainting }));
    }
  }, [prefilledPainting]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/inquire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-16 max-w-md mx-auto">
        <div className="text-5xl mb-6 text-[#8B6914]">✦</div>
        <h2 className="text-2xl text-[#2C2825] mb-4" style={{ fontFamily: "var(--font-serif)" }}>
          Message Received
        </h2>
        <p className="text-[#2C2825]/70 text-sm leading-relaxed mb-8">
          Thank you for reaching out. Katelyn personally reviews every inquiry and will respond within 2–3 business days.
        </p>
        <a
          href="https://www.instagram.com/katelynmechelle_/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-[#8B6914] hover:underline"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
          Follow @katelynmechelle_ on Instagram
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-6">
        <FormField label="Full Name *" type="text" value={form.full_name} onChange={(v) => setForm({ ...form, full_name: v })} required />
        <FormField label="Email *" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required />
      </div>
      <FormField label="Phone" type="tel" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />

      {/* Inquiry Type */}
      <div>
        <label className="block text-xs text-[#2C2825]/60 tracking-wide mb-2">Inquiry Type *</label>
        <div className="flex flex-wrap gap-3">
          {[
            { val: "purchase", label: "Purchase a Painting" },
            { val: "commission", label: "Commission a New Work" },
            { val: "general", label: "General Question" },
          ].map((opt) => (
            <button
              key={opt.val}
              type="button"
              onClick={() => setForm({ ...form, inquiry_type: opt.val as typeof form.inquiry_type })}
              className={`text-sm px-4 py-2 rounded-sm border transition-colors ${
                form.inquiry_type === opt.val
                  ? "border-[#8B6914] bg-[#8B6914] text-white"
                  : "border-[#2C2825]/30 text-[#2C2825] hover:border-[#8B6914]"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <FormField
        label="Painting of Interest"
        type="text"
        value={form.painting_interest}
        onChange={(v) => setForm({ ...form, painting_interest: v })}
        placeholder="Enter painting title or describe what you're looking for"
      />

      {form.inquiry_type === "commission" && (
        <div>
          <label className="block text-xs text-[#2C2825]/60 tracking-wide mb-1.5">Commission Description</label>
          <textarea
            rows={4}
            placeholder="Describe your vision — subject, size, colors, setting, intended space..."
            value={form.commission_description}
            onChange={(e) => setForm({ ...form, commission_description: e.target.value })}
            className="w-full border-b-2 border-[#EBE8E1] focus:border-[#8B6914] bg-transparent py-2 text-sm text-[#2C2825] outline-none resize-none transition-colors"
          />
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-6">
        <FormSelect
          label="Budget Range"
          value={form.budget_range}
          onChange={(v) => setForm({ ...form, budget_range: v })}
          options={["", "Under $500", "$500–$1,500", "$1,500–$3,000", "$3,000+"]}
        />
        {form.inquiry_type === "commission" && (
          <FormSelect
            label="Timeline"
            value={form.timeline}
            onChange={(v) => setForm({ ...form, timeline: v })}
            options={["", "Flexible", "3–6 months", "6–12 weeks", "Under 4 weeks (rush)"]}
          />
        )}
      </div>

      <FormSelect
        label="How did you hear about me?"
        value={form.source}
        onChange={(v) => setForm({ ...form, source: v })}
        options={["", "Instagram", "Referral", "Google", "Other"]}
      />

      <div>
        <label className="block text-xs text-[#2C2825]/60 tracking-wide mb-1.5">Message</label>
        <textarea
          rows={4}
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
        {loading ? "Sending…" : "Send Inquiry"}
      </button>
    </form>
  );
}

export default function InquirePage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-[#EBE8E1]">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <p
            className="text-xs tracking-[0.3em] uppercase text-[#8B6914] mb-4"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Get in Touch
          </p>
          <h1
            className="text-5xl md:text-6xl font-light text-[#2C2825] mb-4"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Inquire
          </h1>
          <p className="text-[#2C2825]/60 leading-relaxed">
            Whether you&apos;re interested in a painting, a commission, or just have a question — Katelyn reads and responds to every message.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="py-16 bg-[#F7F5F0]">
        <div className="max-w-2xl mx-auto px-6">
          <Suspense fallback={<div className="py-8 text-center text-[#2C2825]/50">Loading form…</div>}>
            <InquireForm />
          </Suspense>
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
