import type { Metadata } from "next";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata: Metadata = {
  title: "Admin | Katelyn Mechelle",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-[#18160F] overflow-hidden">
      <AdminSidebar />
      <main className="flex-1 overflow-hidden min-w-0">
        {children}
      </main>
    </div>
  );
}
