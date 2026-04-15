"use client";

import { useState, useEffect, useCallback } from "react";
import { isSupabaseConfigured } from "@/lib/supabase";
import { CRMLead, CRMColumn } from "@/lib/types";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import KanbanColumn from "./KanbanColumn";
import LeadCard from "./LeadCard";
import LeadModal from "./LeadModal";

const BADGE_COLORS: Record<string, string> = {
  purchase: "bg-emerald-900/50 text-emerald-400",
  commission: "bg-[#7C3020]/40 text-[#E8A898]",
  general: "bg-[#F2EDE3]/10 text-[#F2EDE3]/50",
};

export { BADGE_COLORS };

export default function AdminBoard() {
  const [columns, setColumns] = useState<CRMColumn[]>([]);
  const [leads, setLeads] = useState<CRMLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [activeLead, setActiveLead] = useState<CRMLead | null>(null);
  const [selectedLead, setSelectedLead] = useState<CRMLead | null>(null);
  const [showAddLead, setShowAddLead] = useState(false);
  const [newLeadForm, setNewLeadForm] = useState({ full_name: "", email: "", inquiry_type: "purchase" });
  const [addingColumn, setAddingColumn] = useState(false);
  const [newColumnName, setNewColumnName] = useState("");

  const configured = isSupabaseConfigured();

  const fetchBoard = useCallback(async () => {
    if (!configured) { setLoading(false); return; }
    const res = await fetch("/api/admin/leads?board=artist-studio");
    const data = await res.json();
    setColumns(data.columns ?? []);
    setLeads(data.leads ?? []);
    setLoading(false);
  }, [configured]);

  useEffect(() => { fetchBoard(); }, [fetchBoard]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleDragStart = (e: DragStartEvent) => {
    const lead = leads.find((l) => l.id === e.active.id);
    setActiveLead(lead ?? null);
  };

  const handleDragOver = (e: DragOverEvent) => {
    const { active, over } = e;
    if (!over) return;
    const overId = over.id as string;
    const lead = leads.find((l) => l.id === active.id);
    if (!lead) return;
    // If dragging over a column id
    const targetColId = columns.find((c) => c.id === overId)?.id
      ?? leads.find((l) => l.id === overId)?.pipeline_column_id;
    if (targetColId && targetColId !== lead.pipeline_column_id) {
      setLeads((prev) =>
        prev.map((l) =>
          l.id === lead.id ? { ...l, pipeline_column_id: targetColId } : l
        )
      );
    }
  };

  const handleDragEnd = async (e: DragEndEvent) => {
    setActiveLead(null);
    const { active, over } = e;
    if (!over) return;
    const lead = leads.find((l) => l.id === active.id);
    if (!lead) return;
    const newColId = lead.pipeline_column_id;
    if (!newColId) return;
    await fetch("/api/admin/leads", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: lead.id, pipeline_column_id: newColId }),
    });
  };

  const handleAddLead = async () => {
    const res = await fetch("/api/admin/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newLeadForm),
    });
    if (res.ok) {
      setShowAddLead(false);
      setNewLeadForm({ full_name: "", email: "", inquiry_type: "purchase" });
      fetchBoard();
    }
  };

  const handleAddColumn = async () => {
    if (!newColumnName.trim()) return;
    await fetch("/api/admin/columns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newColumnName }),
    });
    setAddingColumn(false);
    setNewColumnName("");
    fetchBoard();
  };

  const filteredLeads = leads.filter((l) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      l.full_name?.toLowerCase().includes(q) ||
      l.email?.toLowerCase().includes(q) ||
      l.painting_interest?.toLowerCase().includes(q);
    const matchesFilter = filterType === "All" || l.inquiry_type === filterType.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  if (!configured) {
    return (
      <div className="min-h-screen bg-[#18160F] flex items-center justify-center p-8">
        <div className="max-w-lg text-center">
          <p className="text-[10px] tracking-[0.25em] uppercase text-[#7C3020] mb-6" style={{ fontFamily: "var(--font-sans)" }}>
            Setup Required
          </p>
          <h1 className="text-2xl font-light text-[#F2EDE3] mb-5" style={{ fontFamily: "var(--font-serif)" }}>
            Supabase Not Configured
          </h1>
          <p className="text-[#F2EDE3]/50 text-sm mb-6 leading-relaxed">
            Add your Supabase credentials to <code className="bg-[#F2EDE3]/10 px-1.5 py-0.5 rounded-sm text-[#F2EDE3]/70">.env.local</code>:
          </p>
          <pre className="bg-black/40 border border-[#F2EDE3]/8 p-4 text-left text-xs text-[#7C3020]/80 mb-6">
{`NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key`}
          </pre>
          <p className="text-[#F2EDE3]/30 text-xs">
            Then run <code className="bg-[#F2EDE3]/10 px-1.5 py-0.5 rounded-sm">supabase-schema.sql</code> in your Supabase SQL Editor.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#18160F]">
        <div className="text-[#F2EDE3]/30 text-sm tracking-widest uppercase text-[11px]" style={{ fontFamily: "var(--font-sans)" }}>
          Loading…
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#18160F] overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-4 px-6 py-4 border-b border-[#F2EDE3]/8 shrink-0">
        <div>
          <h1 className="text-sm font-light text-[#F2EDE3]" style={{ fontFamily: "var(--font-serif)" }}>
            Katelyn Cook · CRM
          </h1>
          <p className="text-[10px] text-[#F2EDE3]/30 mt-0.5 tracking-wide">{leads.length} leads</p>
        </div>

        <div className="flex-1 max-w-xs ml-4">
          <input
            type="text"
            placeholder="Search leads…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#F2EDE3]/5 border border-[#F2EDE3]/10 px-3 py-2 text-sm text-[#F2EDE3] placeholder-[#F2EDE3]/25 focus:outline-none focus:border-[#7C3020]/60 transition-colors"
          />
        </div>

        <div className="flex gap-1.5">
          {["All", "Purchase", "Commission", "General"].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`text-[10px] tracking-[0.12em] uppercase px-3 py-1.5 transition-colors ${
                filterType === t
                  ? "bg-[#7C3020] text-[#F2EDE3]"
                  : "bg-[#F2EDE3]/5 text-[#F2EDE3]/50 hover:bg-[#F2EDE3]/10"
              }`}
              style={{ fontFamily: "var(--font-sans)" }}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="ml-auto flex gap-2">
          <button
            onClick={() => setShowAddLead(true)}
            className="text-[10px] tracking-[0.12em] uppercase px-3 py-1.5 bg-[#7C3020] hover:bg-[#6b2518] text-[#F2EDE3] transition-colors"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            + Add Lead
          </button>
          <button
            onClick={fetchBoard}
            className="text-[10px] tracking-[0.12em] uppercase px-3 py-1.5 bg-[#F2EDE3]/5 hover:bg-[#F2EDE3]/10 text-[#F2EDE3]/50 transition-colors"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            ↻ Refresh
          </button>
        </div>
      </div>

      {/* Board */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-4 h-full px-6 py-6" style={{ minWidth: "max-content" }}>
            {columns.map((col) => {
              const colLeads = filteredLeads
                .filter((l) => l.pipeline_column_id === col.id)
                .sort((a, b) => a.position - b.position);
              return (
                <KanbanColumn
                  key={col.id}
                  column={col}
                  leads={colLeads}
                  onLeadClick={(lead) => setSelectedLead(lead)}
                  onRename={async (id, name) => {
                    await fetch("/api/admin/columns", {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ id, name }),
                    });
                    fetchBoard();
                  }}
                />
              );
            })}

            {/* Add Column */}
            <div className="w-72 shrink-0">
              {addingColumn ? (
                <div className="bg-[#F2EDE3]/5 border border-[#F2EDE3]/10 p-3">
                  <input
                    autoFocus
                    value={newColumnName}
                    onChange={(e) => setNewColumnName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddColumn()}
                    placeholder="Column name…"
                    className="w-full bg-transparent text-sm text-[#F2EDE3] border-b border-[#F2EDE3]/20 focus:border-[#7C3020] outline-none pb-1 mb-3"
                  />
                  <div className="flex gap-2">
                    <button onClick={handleAddColumn} className="text-[10px] tracking-wide uppercase px-3 py-1.5 bg-[#7C3020] text-[#F2EDE3]">
                      Add
                    </button>
                    <button onClick={() => setAddingColumn(false)} className="text-[10px] tracking-wide uppercase px-3 py-1.5 bg-[#F2EDE3]/5 text-[#F2EDE3]/40">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setAddingColumn(true)}
                  className="w-full h-12 border border-dashed border-[#F2EDE3]/15 text-[#F2EDE3]/25 hover:text-[#F2EDE3]/50 hover:border-[#F2EDE3]/30 text-xs tracking-widest uppercase transition-colors"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  + Add Column
                </button>
              )}
            </div>
          </div>

          <DragOverlay>
            {activeLead ? <LeadCard lead={activeLead} isDragging /> : null}
          </DragOverlay>
        </DndContext>
      </div>

      {/* Lead Modal */}
      {selectedLead && (
        <LeadModal
          lead={selectedLead}
          columns={columns}
          onClose={() => { setSelectedLead(null); fetchBoard(); }}
          onUpdate={async (updates) => {
            await fetch("/api/admin/leads", {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ id: selectedLead.id, ...updates }),
            });
            setSelectedLead((prev) => prev ? { ...prev, ...updates } : null);
            fetchBoard();
          }}
        />
      )}

      {/* Add Lead Modal */}
      {showAddLead && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowAddLead(false)}
        >
          <div
            className="bg-[#1e1b14] border border-[#F2EDE3]/10 p-6 w-full max-w-md shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-light text-[#F2EDE3] mb-6" style={{ fontFamily: "var(--font-serif)" }}>
              Add Lead
            </h2>
            <div className="space-y-5">
              <div>
                <label className="text-[10px] tracking-[0.15em] uppercase text-[#F2EDE3]/40 block mb-1.5" style={{ fontFamily: "var(--font-sans)" }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  value={newLeadForm.full_name}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, full_name: e.target.value })}
                  className="w-full bg-[#F2EDE3]/5 border border-[#F2EDE3]/10 px-3 py-2 text-sm text-[#F2EDE3] focus:outline-none focus:border-[#7C3020]/60 transition-colors"
                />
              </div>
              <div>
                <label className="text-[10px] tracking-[0.15em] uppercase text-[#F2EDE3]/40 block mb-1.5" style={{ fontFamily: "var(--font-sans)" }}>
                  Email *
                </label>
                <input
                  type="email"
                  value={newLeadForm.email}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, email: e.target.value })}
                  className="w-full bg-[#F2EDE3]/5 border border-[#F2EDE3]/10 px-3 py-2 text-sm text-[#F2EDE3] focus:outline-none focus:border-[#7C3020]/60 transition-colors"
                />
              </div>
              <div>
                <label className="text-[10px] tracking-[0.15em] uppercase text-[#F2EDE3]/40 block mb-1.5" style={{ fontFamily: "var(--font-sans)" }}>
                  Type
                </label>
                <select
                  value={newLeadForm.inquiry_type}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, inquiry_type: e.target.value })}
                  className="w-full bg-[#F2EDE3]/5 border border-[#F2EDE3]/10 px-3 py-2 text-sm text-[#F2EDE3] focus:outline-none focus:border-[#7C3020]/60 transition-colors"
                >
                  <option value="purchase">Purchase</option>
                  <option value="commission">Commission</option>
                  <option value="general">General</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-7">
              <button
                onClick={handleAddLead}
                className="flex-1 py-3 bg-[#7C3020] text-[#F2EDE3] text-[10px] tracking-[0.15em] uppercase hover:bg-[#6b2518] transition-colors"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                Create Lead
              </button>
              <button
                onClick={() => setShowAddLead(false)}
                className="px-4 py-3 bg-[#F2EDE3]/5 text-[#F2EDE3]/50 text-[10px] tracking-[0.15em] uppercase hover:bg-[#F2EDE3]/10 transition-colors"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
