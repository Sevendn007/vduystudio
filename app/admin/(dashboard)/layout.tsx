"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Settings, DollarSign, MessageSquare, Briefcase, LogOut, FileText } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

const navigation = [
  { name: "Tổng quan", href: "/admin", icon: LayoutDashboard },
  { name: "Feedback", href: "/admin/feedbacks", icon: MessageSquare },
  { name: "Dự án", href: "/admin/projects", icon: Briefcase },
  { name: "Blog", href: "/admin/blog", icon: FileText },
  { name: "Bảng giá", href: "/admin/pricing", icon: DollarSign },
  { name: "Liên hệ", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Sidebar (desktop) / thanh ngang (mobile) */}
      <div className="w-full md:w-60 bg-white shadow-sm md:shadow-md flex-shrink-0 md:flex md:flex-col">
        <div className="h-14 md:h-16 flex items-center justify-between md:justify-center border-b px-4">
          <h1 className="text-lg font-bold text-gray-800">VDuyStudio Admin</h1>
          <button onClick={handleLogout} className="md:hidden text-red-600" aria-label="Đăng xuất">
            <LogOut className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex md:flex-col gap-1 px-2 py-2 md:mt-2 overflow-x-auto md:flex-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium rounded-lg whitespace-nowrap ${
                  isActive ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <item.icon className={`h-5 w-5 flex-shrink-0 ${isActive ? "text-blue-600" : "text-gray-400"}`} aria-hidden />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="hidden md:block p-3 border-t">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2.5 px-3 py-2.5 text-sm font-medium rounded-lg text-red-600 hover:bg-red-50"
          >
            <LogOut className="h-5 w-5 text-red-500" aria-hidden />
            Đăng xuất
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
