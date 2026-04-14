"use client";

import dynamic from "next/dynamic";

const AdminBoard = dynamic(() => import("@/components/admin/AdminBoard"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-screen bg-[#1a1a1a]">
      <div className="text-white/40 text-sm">Loading board…</div>
    </div>
  ),
});

export default function AdminPage() {
  return <AdminBoard />;
}
