"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CRMLead } from "@/lib/types";
import { BADGE_COLORS } from "./AdminBoard";

interface Props {
  lead: CRMLead;
  onClick?: () => void;
  isDragging?: boolean;
}

function daysSince(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export default function LeadCard({ lead, onClick, isDragging }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging: isSortDragging } =
    useSortable({ id: lead.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortDragging ? 0.4 : 1,
  };

  const days = daysSince(lead.created_at);
  const overdue = lead.next_action_due && new Date(lead.next_action_due) < new Date();
  const badgeColor = BADGE_COLORS[lead.inquiry_type] ?? BADGE_COLORS.general;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={`bg-[#1e1e1e] border border-white/10 rounded-xl p-3 cursor-pointer hover:border-[#8B6914]/50 transition-colors select-none ${
        isDragging ? "shadow-2xl rotate-1" : ""
      } ${overdue ? "border-l-2 border-l-red-500/60" : ""}`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="text-sm text-white font-medium truncate">{lead.full_name}</span>
        <span className={`text-[10px] px-1.5 py-0.5 rounded-md shrink-0 ${badgeColor}`}>
          {lead.inquiry_type}
        </span>
      </div>

      {lead.painting_interest && (
        <p className="text-xs text-white/50 truncate mb-1.5">🖼 {lead.painting_interest}</p>
      )}

      {lead.budget_range && (
        <p className="text-xs text-[#8B6914]/80 mb-1.5">{lead.budget_range}</p>
      )}

      {(lead.city || lead.state) && (
        <p className="text-xs text-white/30 mb-1.5">
          📍 {[lead.city, lead.state].filter(Boolean).join(", ")}
        </p>
      )}

      <div className="flex items-center justify-between mt-2">
        <span className="text-[10px] text-white/25">{days}d ago</span>
        {overdue && (
          <span className="text-[10px] text-red-400">● Overdue</span>
        )}
      </div>
    </div>
  );
}
