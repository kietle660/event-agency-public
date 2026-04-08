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
    { href: "/admin/customers", label: "CRM" },
    { href: "/admin/quotes", label: "Báo giá" },
    { href: "/admin/contracts", label: "Hợp đồng" },
    { href: "/admin/liquidations", label: "Thanh lý" },
    ...(session.role === "admin" ? [{ href: "/admin/settings", label: "Cài đặt" }] : []),
  ];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(250,204,21,0.08),transparent_24%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.08),transparent_22%),linear-gradient(180deg,#09090b,#0f1115)] text-white print:bg-white print:text-black">
      <div className="grid min-h-screen lg:grid-cols-[292px_1fr] print:block">
        <div className="hidden lg:block print:hidden">
          <AdminSidebar currentRole={session.role} />
        </div>

        <div className="flex min-h-screen flex-col">
          <header className="sticky top-0 z-20 border-b border-white/10 bg-[rgba(9,9,11,0.82)] backdrop-blur-xl print:hidden">
            <div className="flex items-center justify-between gap-4 px-5 py-4 md:px-7">
              <div className="flex min-w-0 items-center gap-4">
                <div className="hidden h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 lg:flex">
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.7)]" />
                </div>

                <div>
                  <div className="text-xs uppercase tracking-[0.28em] text-yellow-400 lg:hidden">
                    TRONG THAI EVENT
                  </div>
                  <div className="text-lg font-semibold text-white">Không gian quản trị</div>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-white/45">
                    <span>{session.username}</span>
                    <span className="h-1 w-1 rounded-full bg-white/25" />
                    <span>{session.role === "admin" ? "Quản trị viên" : "Biên tập viên"}</span>
                    <span className="hidden h-1 w-1 rounded-full bg-white/25 sm:inline-block" />
                    <span className="hidden sm:inline">Hệ thống đang hoạt động ổn định</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/"
                  className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white/75 transition hover:border-yellow-400/50 hover:bg-white/[0.06] hover:text-white"
                >
                  Xem website
                </Link>
                <form action="/api/admin/logout" method="post">
                  <button
                    type="submit"
                    className="rounded-full bg-yellow-400 px-4 py-2 text-sm font-semibold text-black shadow-[0_14px_30px_rgba(250,204,21,0.2)] transition hover:bg-yellow-300"
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
                    className="whitespace-nowrap rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white/70 transition hover:border-yellow-400/50 hover:bg-white/[0.06] hover:text-white"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </header>

          <div className="flex-1">
            <div className="mx-auto w-full max-w-[1700px] print:max-w-none">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
