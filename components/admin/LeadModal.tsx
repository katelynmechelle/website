"use client";

import { useState, useEffect, useRef } from "react";
import { CRMLead, CRMColumn } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";

interface Props {
  lead: CRMLead;
  columns: CRMColumn[];
  onClose: () => void;
  onUpdate: (updates: Partial<CRMLead>) => Promise<void>;
}

function Field({
  label,
  value,
  onSave,
  type = "text",
  large,
}: {
  label: string;
  value: string;
  onSave: (v: string) => void;
  type?: string;
  large?: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(value);

  useEffect(() => setVal(value), [value]);

  const save = () => {
    setEditing(false);
    if (val !== value) onSave(val);
  };

  if (large) {
    return (
      <div>
        <label className="text-xs text-white/40 block mb-1">{label}</label>
        <textarea
          rows={3}
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onBlur={save}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#8B6914]/60 resize-none"
        />
      </div>
    );
  }

  return (
    <div>
      <label className="text-xs text-white/40 block mb-1">{label}</label>
      {editing ? (
        <input
          autoFocus
          type={type}
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onBlur={save}
          onKeyDown={(e) => e.key === "Enter" && save()}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#8B6914]/60"
        />
      ) : (
        <div
          onClick={() => setEditing(true)}
          className="px-3 py-2 text-sm text-white/80 hover:bg-white/5 rounded-lg cursor-text border border-transparent hover:border-white/10 transition-colors min-h-[36px]"
        >
          {val || <span className="text-white/20">Click to edit</span>}
        </div>
      )}
    </div>
  );
}

export default function LeadModal({ lead, columns, onClose, onUpdate }: Props) {
  const [notes, setNotes] = useState<Array<{ id: string; body: string; created_at: string }>>([]);
  const [activity, setActivity] = useState<Array<{ id: string; body: string; type: string; created_at: string }>>([]);
  const [newNote, setNewNote] = useState("");
  const [tags, setTags] = useState<string[]>(lead.tags ?? []);
  const [newTag, setNewTag] = useState("");
  const supabase = createClient();
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchTimeline = async () => {
      const [{ data: n }, { data: a }] = await Promise.all([
        supabase.from("crm_notes").select("*").eq("lead_id", lead.id).order("created_at", { ascending: false }),
        supabase.from("crm_activity_log").select("*").eq("lead_id", lead.id).order("created_at", { ascending: false }),
      ]);
      setNotes(n ?? []);
      setActivity(a ?? []);
    };
    fetchTimeline();
  }, [lead.id, supabase]);

  const addNote = async () => {
    if (!newNote.trim()) return;
    const { data } = await supabase
      .from("crm_notes")
      .insert({ lead_id: lead.id, body: newNote })
      .select()
      .single();
    if (data) setNotes((prev) => [data, ...prev]);
    setNewNote("");
  };

  const addTag = () => {
    const t = newTag.trim();
    if (!t || tags.includes(t)) return;
    const updated = [...tags, t];
    setTags(updated);
    onUpdate({ tags: updated });
    setNewTag("");
  };

  const removeTag = (t: string) => {
    const updated = tags.filter((x) => x !== t);
    setTags(updated);
    onUpdate({ tags: updated });
  };

  const merged = [
    ...notes.map((n) => ({ ...n, _type: "note" as const })),
    ...activity.map((a) => ({ ...a, _type: "activity" as const })),
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const currentColumn = columns.find((c) => c.id === lead.pipeline_column_id);

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#1e1e1e] rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 pt-5 pb-4 border-b border-white/10 shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <input
                className="text-xl text-white bg-transparent w-full outline-none border-b border-transparent focus:border-[#8B6914] pb-1"
                style={{ fontFamily: "var(--font-serif)" }}
                defaultValue={lead.full_name}
                onBlur={(e) => onUpdate({ full_name: e.target.value })}
              />
            </div>
            <button onClick={onClose} className="ml-4 text-white/40 hover:text-white text-xl leading-none">
              ×
            </button>
          </div>
          {/* Stage pill */}
          <select
            value={lead.pipeline_column_id}
            onChange={(e) => onUpdate({ pipeline_column_id: e.target.value })}
            className="mt-3 text-xs bg-[#8B6914]/20 text-[#8B6914] border border-[#8B6914]/30 rounded-full px-3 py-1 outline-none cursor-pointer"
          >
            {columns.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          {currentColumn && (
            <span className="ml-2 text-xs text-white/30">{currentColumn.name}</span>
          )}
        </div>

        {/* Body */}
        <div ref={bodyRef} className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* Contact info */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Email" value={lead.email ?? ""} onSave={(v) => onUpdate({ email: v })} type="email" />
            <Field label="Phone" value={lead.phone ?? ""} onSave={(v) => onUpdate({ phone: v })} />
            <Field label="City" value={lead.city ?? ""} onSave={(v) => onUpdate({ city: v })} />
            <Field label="State" value={lead.state ?? ""} onSave={(v) => onUpdate({ state: v })} />
          </div>

          {/* Inquiry details */}
          <div>
            <label className="text-xs text-white/40 block mb-2">Inquiry Type</label>
            <select
              value={lead.inquiry_type}
              onChange={(e) => onUpdate({ inquiry_type: e.target.value })}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#8B6914]/60"
            >
              <option value="purchase">Purchase</option>
              <option value="commission">Commission</option>
              <option value="general">General</option>
            </select>
          </div>

          <Field label="Painting of Interest" value={lead.painting_interest ?? ""} onSave={(v) => onUpdate({ painting_interest: v })} />
          <Field label="Budget Range" value={lead.budget_range ?? ""} onSave={(v) => onUpdate({ budget_range: v })} />
          <Field label="Quote Amount ($)" value={lead.quote_amount?.toString() ?? ""} onSave={(v) => onUpdate({ quote_amount: parseFloat(v) || undefined })} type="number" />
          <Field label="Commission Description" value={lead.commission_description ?? ""} onSave={(v) => onUpdate({ commission_description: v })} large />
          <Field label="Assigned To" value={lead.assigned_to ?? ""} onSave={(v) => onUpdate({ assigned_to: v })} />

          {/* Next action */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Next Action" value={lead.next_action ?? ""} onSave={(v) => onUpdate({ next_action: v })} />
            <Field label="Due Date" value={lead.next_action_due ?? ""} onSave={(v) => onUpdate({ next_action_due: v })} type="date" />
          </div>

          {/* Tags */}
          <div>
            <label className="text-xs text-white/40 block mb-2">Tags</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((t) => (
                <span key={t} className="flex items-center gap-1 text-xs bg-white/10 text-white/70 rounded-full px-2.5 py-1">
                  {t}
                  <button onClick={() => removeTag(t)} className="text-white/30 hover:text-white leading-none">×</button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTag()}
                placeholder="Add tag…"
                className="text-xs bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-[#8B6914]/60 w-36"
              />
              <button onClick={addTag} className="text-xs px-3 py-1.5 bg-white/5 text-white/50 rounded-lg hover:bg-white/10">
                Add
              </button>
            </div>
          </div>

          {/* Quick notes */}
          <Field label="Quick Notes" value={lead.notes_text ?? ""} onSave={(v) => onUpdate({ notes_text: v })} large />

          {/* Add note */}
          <div>
            <label className="text-xs text-white/40 block mb-2">Add Note to Timeline</label>
            <div className="flex gap-2">
              <textarea
                rows={2}
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Write a note…"
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#8B6914]/60 resize-none"
              />
              <button
                onClick={addNote}
                className="px-3 bg-[#8B6914] text-white rounded-lg text-sm hover:bg-[#7a5c10] transition-colors"
              >
                Post
              </button>
            </div>
          </div>

          {/* Timeline */}
          {merged.length > 0 && (
            <div>
              <label className="text-xs text-white/40 block mb-3">Activity Timeline</label>
              <div className="space-y-3">
                {merged.map((item) => (
                  <div key={item.id} className="flex gap-3 text-xs">
                    <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                      item._type === "note" ? "bg-[#8B6914]" : "bg-white/30"
                    }`} />
                    <div>
                      <p className="text-white/70 leading-relaxed">{item.body}</p>
                      <p className="text-white/25 mt-0.5">
                        {new Date(item.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-white/10 flex items-center justify-between text-xs text-white/25 shrink-0">
          <span>Created {new Date(lead.created_at).toLocaleDateString()}</span>
          <span>Updated {new Date(lead.updated_at).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}
