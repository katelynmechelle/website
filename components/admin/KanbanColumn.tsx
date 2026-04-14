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
      className={`w-72 shrink-0 flex flex-col rounded-xl transition-colors ${
        isOver ? "bg-white/10" : "bg-white/5"
      }`}
    >
      {/* Column header */}
      <div className="flex items-center justify-between px-3 pt-3 pb-2">
        {editing ? (
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={handleRename}
            onKeyDown={(e) => e.key === "Enter" && handleRename()}
            className="flex-1 bg-transparent text-sm text-white border-b border-[#8B6914] outline-none"
          />
        ) : (
          <button
            onDoubleClick={() => setEditing(true)}
            className="text-xs font-medium text-white/70 hover:text-white truncate"
          >
            {column.name}
          </button>
        )}
        <span className="ml-2 text-xs text-white/30 shrink-0">{leads.length}</span>
      </div>

      {/* Cards */}
      <SortableContext items={leads.map((l) => l.id)} strategy={verticalListSortingStrategy}>
        <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-2 max-h-[calc(100vh-160px)]">
          {leads.map((lead) => (
            <LeadCard key={lead.id} lead={lead} onClick={() => onLeadClick(lead)} />
          ))}
          {leads.length === 0 && (
            <div className="h-16 border border-dashed border-white/10 rounded-lg flex items-center justify-center">
              <span className="text-xs text-white/20">Drop here</span>
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}
