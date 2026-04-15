"use client";

import dynamic from "next/dynamic";

const PaintingsManager = dynamic(() => import("@/components/admin/PaintingsManager"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-[#18160F]">
      <div className="text-[#F2EDE3]/30 text-[11px] tracking-widest uppercase" style={{ fontFamily: "var(--font-sans)" }}>
        Loading…
      </div>
    </div>
  ),
});

export default function PaintingsPage() {
  return <PaintingsManager />;
}
