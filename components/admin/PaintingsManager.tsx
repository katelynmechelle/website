"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { isSupabaseConfigured } from "@/lib/supabase";

interface PaintingRow {
  id: string;
  slug: string;
  title: string;
  medium: string;
  dimensions: string;
  year: number;
  price: number;
  original_price?: number | null;
  available: boolean;
  featured: boolean;
  image_url: string;
  description: string;
  tags: string[];
  sort_order: number;
}

const BLANK: Omit<PaintingRow, "id" | "slug"> = {
  title: "",
  medium: "Oil",
  dimensions: "",
  year: new Date().getFullYear(),
  price: 0,
  original_price: null,
  available: true,
  featured: false,
  image_url: "",
  description: "",
  tags: [],
  sort_order: 0,
};

export default function PaintingsManager() {
  const [paintings, setPaintings] = useState<PaintingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingPainting, setEditingPainting] = useState<PaintingRow | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState(BLANK);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const configured = isSupabaseConfigured();

  const loadPaintings = async () => {
    if (!configured) { setLoading(false); return; }
    const res = await fetch("/api/admin/paintings");
    const data = await res.json();
    setPaintings(data.paintings ?? []);
    setLoading(false);
  };

  useEffect(() => { loadPaintings(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = async (p: PaintingRow) => {
    setSaving(true);
    await fetch("/api/admin/paintings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: p.id,
        title: p.title,
        medium: p.medium,
        dimensions: p.dimensions,
        year: p.year,
        price: p.price,
        original_price: p.original_price || null,
        available: p.available,
        featured: p.featured,
        image_url: p.image_url,
        description: p.description,
        tags: p.tags,
        sort_order: p.sort_order,
      }),
    });
    setSaving(false);
    setEditingPainting(null);
    loadPaintings();
  };

  const handleAdd = async () => {
    setSaving(true);
    await fetch("/api/admin/paintings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...addForm, image_url: addForm.image_url }),
    });
    setSaving(false);
    setShowAddModal(false);
    setAddForm(BLANK);
    loadPaintings();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this painting? This cannot be undone.")) return;
    setDeleting(id);
    await fetch(`/api/admin/paintings?id=${id}`, { method: "DELETE" });
    setDeleting(null);
    loadPaintings();
  };

  const handleToggleAvailable = async (p: PaintingRow) => {
    await fetch("/api/admin/paintings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: p.id, available: !p.available }),
    });
    setPaintings((prev) => prev.map((x) => x.id === p.id ? { ...x, available: !p.available } : x));
  };

  const filtered = paintings.filter((p) =>
    !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.medium.toLowerCase().includes(search.toLowerCase())
  );

  if (!configured) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="max-w-lg text-center">
          <p className="text-[10px] tracking-[0.25em] uppercase text-[#7C3020] mb-4" style={{ fontFamily: "var(--font-sans)" }}>
            Setup Required
          </p>
          <h2 className="text-2xl font-light text-[#F2EDE3] mb-4" style={{ fontFamily: "var(--font-serif)" }}>
            Supabase Not Configured
          </h2>
          <p className="text-[#F2EDE3]/50 text-sm leading-relaxed">
            Add <code className="bg-[#F2EDE3]/10 px-1">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
            <code className="bg-[#F2EDE3]/10 px-1">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to your environment variables, then run <code className="bg-[#F2EDE3]/10 px-1">supabase-schema.sql</code>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#18160F] overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-4 px-6 py-4 border-b border-[#F2EDE3]/8 shrink-0">
        <div>
          <h1 className="text-sm font-light text-[#F2EDE3]" style={{ fontFamily: "var(--font-serif)" }}>
            Paintings Manager
          </h1>
          <p className="text-[10px] text-[#F2EDE3]/30 mt-0.5">{paintings.length} paintings</p>
        </div>
        <div className="flex-1 max-w-xs ml-4">
          <input
            type="text"
            placeholder="Search paintings…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#F2EDE3]/5 border border-[#F2EDE3]/10 px-3 py-2 text-sm text-[#F2EDE3] placeholder-[#F2EDE3]/25 focus:outline-none focus:border-[#7C3020]/60 transition-colors"
          />
        </div>
        <div className="ml-auto flex gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="text-[10px] tracking-[0.15em] uppercase px-3 py-1.5 bg-[#7C3020] hover:bg-[#6b2518] text-[#F2EDE3] transition-colors"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            + Add Painting
          </button>
          <button
            onClick={loadPaintings}
            className="text-[10px] tracking-[0.15em] uppercase px-3 py-1.5 bg-[#F2EDE3]/5 hover:bg-[#F2EDE3]/10 text-[#F2EDE3]/50 transition-colors"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            ↻ Refresh
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <p className="text-[#F2EDE3]/30 text-[11px] tracking-widest uppercase">Loading…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 gap-3">
            <p className="text-[#F2EDE3]/30 text-sm">No paintings found.</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="text-[11px] tracking-[0.15em] uppercase text-[#7C3020] hover:text-[#E8A898] transition-colors"
            >
              Add your first painting →
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-4 bg-[#1e1b14] border border-[#F2EDE3]/8 px-4 py-3 hover:border-[#F2EDE3]/15 transition-colors"
              >
                {/* Thumbnail */}
                <div className="w-12 h-12 shrink-0 bg-[#F2EDE3]/5 overflow-hidden relative">
                  {p.image_url ? (
                    <Image src={p.image_url} alt={p.title} fill className="object-cover" unoptimized />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-[#F2EDE3]/20 text-[8px]">No img</span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#F2EDE3]/90 truncate" style={{ fontFamily: "var(--font-serif)" }}>
                    {p.title}
                  </p>
                  <p className="text-[10px] text-[#F2EDE3]/30 mt-0.5">
                    {p.medium} · {p.dimensions} · {p.year}
                  </p>
                </div>

                {/* Price */}
                <div className="text-right shrink-0 w-28">
                  <p className="text-sm text-[#F2EDE3]/80">${p.price.toLocaleString()}</p>
                  {p.original_price && p.original_price > p.price && (
                    <p className="text-[10px] text-[#F2EDE3]/30 line-through">${p.original_price.toLocaleString()}</p>
                  )}
                </div>

                {/* Status badges */}
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => handleToggleAvailable(p)}
                    className={`text-[9px] tracking-[0.15em] uppercase px-2 py-1 transition-colors ${
                      p.available
                        ? "bg-emerald-900/40 text-emerald-400 hover:bg-red-900/40 hover:text-red-400"
                        : "bg-[#F2EDE3]/5 text-[#F2EDE3]/30 hover:bg-emerald-900/40 hover:text-emerald-400"
                    }`}
                    title={p.available ? "Click to mark sold" : "Click to mark available"}
                    style={{ fontFamily: "var(--font-sans)" }}
                  >
                    {p.available ? "Available" : "Sold"}
                  </button>
                  {p.featured && (
                    <span className="text-[9px] tracking-[0.15em] uppercase px-2 py-1 bg-[#7C3020]/30 text-[#E8A898]" style={{ fontFamily: "var(--font-sans)" }}>
                      Featured
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-1.5 shrink-0">
                  <button
                    onClick={() => setEditingPainting({ ...p })}
                    className="text-[10px] tracking-wide uppercase px-3 py-1.5 bg-[#F2EDE3]/5 hover:bg-[#F2EDE3]/10 text-[#F2EDE3]/50 transition-colors"
                    style={{ fontFamily: "var(--font-sans)" }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    disabled={deleting === p.id}
                    className="text-[10px] tracking-wide uppercase px-3 py-1.5 bg-[#F2EDE3]/5 hover:bg-red-900/30 text-[#F2EDE3]/30 hover:text-red-400 transition-colors disabled:opacity-40"
                    style={{ fontFamily: "var(--font-sans)" }}
                  >
                    {deleting === p.id ? "…" : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingPainting && (
        <PaintingModal
          title="Edit Painting"
          painting={editingPainting}
          onChange={setEditingPainting}
          onCancel={() => setEditingPainting(null)}
          onSave={() => handleSave(editingPainting)}
          saving={saving}
        />
      )}

      {/* Add Modal */}
      {showAddModal && (
        <PaintingModal
          title="Add Painting"
          painting={{ ...addForm, id: "", slug: "" } as PaintingRow}
          onChange={(p) => setAddForm({ ...addForm, ...p })}
          onCancel={() => { setShowAddModal(false); setAddForm(BLANK); }}
          onSave={handleAdd}
          saving={saving}
        />
      )}
    </div>
  );
}

function PaintingModal({
  title,
  painting,
  onChange,
  onCancel,
  onSave,
  saving,
}: {
  title: string;
  painting: PaintingRow;
  onChange: (p: PaintingRow) => void;
  onCancel: () => void;
  onSave: () => void;
  saving: boolean;
}) {
  const set = (key: keyof PaintingRow, value: unknown) =>
    onChange({ ...painting, [key]: value });

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onCancel}>
      <div
        className="bg-[#1e1b14] border border-[#F2EDE3]/10 w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#F2EDE3]/8 flex items-center justify-between shrink-0">
          <h2 className="text-xl font-light text-[#F2EDE3]" style={{ fontFamily: "var(--font-serif)" }}>
            {title}
          </h2>
          <button onClick={onCancel} className="text-[#F2EDE3]/30 hover:text-[#F2EDE3] text-2xl leading-none transition-colors">×</button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Image preview */}
          {painting.image_url && (
            <div className="w-full aspect-[16/7] relative overflow-hidden bg-[#F2EDE3]/5">
              <Image src={painting.image_url} alt="" fill className="object-contain" unoptimized />
            </div>
          )}

          <ModalField label="Image URL" value={painting.image_url} onChange={(v) => set("image_url", v)} placeholder="https://…" />
          <ModalField label="Title *" value={painting.title} onChange={(v) => set("title", v)} />

          <div className="grid grid-cols-2 gap-4">
            <ModalSelect label="Medium" value={painting.medium} onChange={(v) => set("medium", v)}
              options={["Oil", "Acrylic", "Watercolor", "Mixed Media", "Pastel", "Other"]} />
            <ModalField label="Dimensions" value={painting.dimensions} onChange={(v) => set("dimensions", v)} placeholder='e.g. 24" × 30"' />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <ModalField label="Year" value={String(painting.year)} onChange={(v) => set("year", parseInt(v) || painting.year)} type="number" />
            <ModalField label="Price ($)" value={String(painting.price)} onChange={(v) => set("price", parseFloat(v) || 0)} type="number" />
            <ModalField label="Original Price ($)" value={String(painting.original_price ?? "")} onChange={(v) => set("original_price", v ? parseFloat(v) : null)} type="number" placeholder="Leave blank if no discount" />
          </div>

          <div>
            <label className="text-[10px] tracking-[0.15em] uppercase text-[#F2EDE3]/30 block mb-2" style={{ fontFamily: "var(--font-sans)" }}>
              Description
            </label>
            <textarea
              rows={3}
              value={painting.description}
              onChange={(e) => set("description", e.target.value)}
              className="w-full bg-[#F2EDE3]/5 border border-[#F2EDE3]/10 px-3 py-2 text-sm text-[#F2EDE3]/80 focus:outline-none focus:border-[#7C3020]/60 resize-none transition-colors placeholder:text-[#F2EDE3]/20"
            />
          </div>

          <div>
            <label className="text-[10px] tracking-[0.15em] uppercase text-[#F2EDE3]/30 block mb-2" style={{ fontFamily: "var(--font-sans)" }}>
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={(painting.tags ?? []).join(", ")}
              onChange={(e) => set("tags", e.target.value.split(",").map((t) => t.trim()).filter(Boolean))}
              className="w-full bg-[#F2EDE3]/5 border border-[#F2EDE3]/10 px-3 py-2 text-sm text-[#F2EDE3]/80 focus:outline-none focus:border-[#7C3020]/60 transition-colors"
              placeholder="horse, oil, equestrian"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <ModalField label="Sort Order" value={String(painting.sort_order ?? 0)} onChange={(v) => set("sort_order", parseInt(v) || 0)} type="number" />
            <div className="flex items-center gap-3 pt-5">
              <input type="checkbox" id="avail" checked={painting.available} onChange={(e) => set("available", e.target.checked)} className="accent-[#7C3020]" />
              <label htmlFor="avail" className="text-[11px] tracking-wide uppercase text-[#F2EDE3]/50" style={{ fontFamily: "var(--font-sans)" }}>Available</label>
            </div>
            <div className="flex items-center gap-3 pt-5">
              <input type="checkbox" id="feat" checked={painting.featured} onChange={(e) => set("featured", e.target.checked)} className="accent-[#7C3020]" />
              <label htmlFor="feat" className="text-[11px] tracking-wide uppercase text-[#F2EDE3]/50" style={{ fontFamily: "var(--font-sans)" }}>Featured</label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#F2EDE3]/8 flex gap-3 shrink-0">
          <button
            onClick={onSave}
            disabled={saving || !painting.title}
            className="flex-1 py-3 bg-[#7C3020] text-[#F2EDE3] text-[10px] tracking-[0.2em] uppercase hover:bg-[#6b2518] transition-colors disabled:opacity-40"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            {saving ? "Saving…" : "Save Painting"}
          </button>
          <button
            onClick={onCancel}
            className="px-5 py-3 bg-[#F2EDE3]/5 text-[#F2EDE3]/50 text-[10px] tracking-[0.2em] uppercase hover:bg-[#F2EDE3]/10 transition-colors"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function ModalField({
  label, value, onChange, type = "text", placeholder,
}: {
  label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string;
}) {
  return (
    <div>
      <label className="text-[10px] tracking-[0.15em] uppercase text-[#F2EDE3]/30 block mb-1.5" style={{ fontFamily: "var(--font-sans)" }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[#F2EDE3]/5 border border-[#F2EDE3]/10 px-3 py-2 text-sm text-[#F2EDE3]/80 focus:outline-none focus:border-[#7C3020]/60 transition-colors placeholder:text-[#F2EDE3]/20"
      />
    </div>
  );
}

function ModalSelect({
  label, value, onChange, options,
}: {
  label: string; value: string; onChange: (v: string) => void; options: string[];
}) {
  return (
    <div>
      <label className="text-[10px] tracking-[0.15em] uppercase text-[#F2EDE3]/30 block mb-1.5" style={{ fontFamily: "var(--font-sans)" }}>
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[#F2EDE3]/5 border border-[#F2EDE3]/10 px-3 py-2 text-sm text-[#F2EDE3]/80 focus:outline-none focus:border-[#7C3020]/60 transition-colors"
      >
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}
