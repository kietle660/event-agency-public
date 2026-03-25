import Link from "next/link";
import { redirect } from "next/navigation";

import { getAdminSession } from "@/lib/admin-auth";
import AdminSidebar from "./components/AdminSidebar";

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  const mobileItems = [
    { href: "/admin", label: "Tổng quan" },
    { href: "/admin/projects", label: "Dự án" },
    { href: "/admin/news", label: "Tin tức" },
    { href: "/admin/media", label: "Media" },
    { href: "/admin/contacts", label: "Khách liên hệ" },
    ...(session.role === "admin" ? [{ href: "/admin/settings", label: "Cài đặt" }] : []),
  ];

  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <div className="hidden lg:block">
          <AdminSidebar currentRole={session.role} />
        </div>

        <div className="flex min-h-screen flex-col">
          <header className="sticky top-0 z-20 border-b border-white/10 bg-black/55 backdrop-blur">
            <div className="flex items-center justify-between gap-4 px-5 py-4 md:px-6">
              <div>
                <div className="text-xs uppercase tracking-[0.28em] text-yellow-400 lg:hidden">
                  TRONG THAI EVENT
                </div>
                <div className="text-lg font-semibold text-white">Không gian quản trị</div>
                <div className="mt-1 text-xs text-white/45">
                  {session.username} •{" "}
                  {session.role === "admin" ? "Quản trị viên" : "Biên tập viên"}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/"
                  className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/70 transition hover:border-yellow-400/50 hover:text-white"
                >
                  Xem website
                </Link>
                <form action="/api/admin/logout" method="post">
                  <button
                    type="submit"
                    className="rounded-full bg-yellow-400 px-4 py-2 text-sm font-semibold text-black transition hover:bg-yellow-300"
                  >
                    Đăng xuất
                  </button>
                </form>
              </div>
            </div>

            <div className="border-t border-white/10 px-4 py-3 lg:hidden">
              <div className="flex gap-2 overflow-x-auto">
                {mobileItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="whitespace-nowrap rounded-full border border-white/10 px-4 py-2 text-sm text-white/70 transition hover:border-yellow-400/50 hover:text-white"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </header>

          <div className="flex-1">{children}</div>
        </div>
      </div>
    </div>
  );
}
