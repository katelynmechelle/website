"use client";

import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CRMColumn, CRMLead } from "@/lib/types";
import LeadCard from "./LeadCard";

interface Props {
  column: CRMColumn;
  leads: CRMLead[];
  onLeadClick: (lead: CRMLead) => void;
  onRename: (id: string, name: string) => void;
}

export default function KanbanColumn({ column, leads, onLeadClick, onRename }: Props) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(column.name);

  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  const handleRename = () => {
    if (name.trim() && name !== column.name) {
      onRename(column.id, name.trim());
    }
    setEditing(false);
  };

  return (
    <div
      ref={setNodeRef}
      className={`w-72 shrink-0 flex flex-col transition-colors ${
        isOver ? "bg-[#7C3020]/10" : "bg-[#F2EDE3]/4"
      }`}
      style={{ backgroundColor: isOver ? "rgba(124,48,32,0.10)" : "rgba(242,237,227,0.03)" }}
    >
      {/* Column header */}
      <div className="flex items-center justify-between px-3 pt-3 pb-2 border-b border-[#F2EDE3]/8">
        {editing ? (
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={handleRename}
            onKeyDown={(e) => e.key === "Enter" && handleRename()}
            className="flex-1 bg-transparent text-xs text-[#F2EDE3] border-b border-[#7C3020] outline-none tracking-wide"
          />
        ) : (
          <button
            onDoubleClick={() => setEditing(true)}
            className="text-[10px] tracking-[0.2em] uppercase text-[#F2EDE3]/50 hover:text-[#F2EDE3]/80 truncate transition-colors"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            {column.name}
          </button>
        )}
        <span className="ml-2 text-[10px] text-[#F2EDE3]/20 shrink-0 tabular-nums">{leads.length}</span>
      </div>

      {/* Cards */}
      <SortableContext items={leads.map((l) => l.id)} strategy={verticalListSortingStrategy}>
        <div className="flex-1 overflow-y-auto px-2 pb-2 pt-2 space-y-2 max-h-[calc(100vh-160px)]">
          {leads.map((lead) => (
            <LeadCard key={lead.id} lead={lead} onClick={() => onLeadClick(lead)} />
          ))}
          {leads.length === 0 && (
            <div className="h-16 border border-dashed border-[#F2EDE3]/8 flex items-center justify-center">
              <span className="text-[10px] tracking-widest uppercase text-[#F2EDE3]/15" style={{ fontFamily: "var(--font-sans)" }}>
                Drop here
              </span>
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}
