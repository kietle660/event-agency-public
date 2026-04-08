"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  BriefcaseBusiness,
  FileText,
  FolderKanban,
  Globe,
  ImageIcon,
  LayoutDashboard,
  Mail,
  Newspaper,
  ReceiptText,
  Settings,
  Sparkles,
  Users,
} from "lucide-react";

import type { AdminRole } from "@/lib/admin-users";

type NavChild = {
  href: string;
  label: string;
  section: "basic" | "slider" | "partners" | "testimonials" | "accounts";
};

type NavItem = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  children?: NavChild[];
  roles?: AdminRole[];
};

type NavGroup = {
  title: string;
  items: NavItem[];
};

const navGroups: NavGroup[] = [
  {
    title: "Tổng quan",
    items: [
      { href: "/admin", label: "Bảng điều khiển", icon: LayoutDashboard },
      { href: "/", label: "Website", icon: Globe },
    ],
  },
  {
    title: "Quản lý nội dung",
    items: [
      { href: "/admin/projects", label: "Dự án", icon: FolderKanban },
      { href: "/admin/news", label: "Tin tức", icon: Newspaper },
      { href: "/admin/customers", label: "CRM khách hàng", icon: Users },
      { href: "/admin/quotes", label: "Bảng báo giá", icon: ReceiptText },
      { href: "/admin/contracts", label: "Hợp đồng", icon: FileText },
      { href: "/admin/liquidations", label: "Thanh lý hợp đồng", icon: FileText },
      { href: "/admin/media", label: "Thư viện media", icon: ImageIcon },
      { href: "/admin/contacts", label: "Khách liên hệ", icon: Mail },
    ],
  },
  {
    title: "Vận hành",
    items: [{ href: "/admin/hrm", label: "HRM nhân sự", icon: BriefcaseBusiness, roles: ["admin"] }],
  },
  {
    title: "Hệ thống",
    items: [
      {
        href: "/admin/settings",
        label: "Cài đặt",
        icon: Settings,
        roles: ["admin"],
        children: [
          { href: "/admin/settings?section=basic", label: "Cơ bản", section: "basic" },
          { href: "/admin/settings?section=slider", label: "Slider", section: "slider" },
          { href: "/admin/settings?section=partners", label: "Đối tác", section: "partners" },
          {
            href: "/admin/settings?section=testimonials",
            label: "Đánh giá",
            section: "testimonials",
          },
          {
            href: "/admin/settings?section=accounts",
            label: "Tài khoản",
            section: "accounts",
          },
        ],
      },
    ],
  },
];

function isActive(pathname: string, href: string) {
  if (href === "/admin") {
    return pathname === "/admin";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

type AdminSidebarProps = {
  currentRole: AdminRole;
};

export default function AdminSidebar({ currentRole }: AdminSidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeSection = searchParams.get("section") || "basic";

  return (
    <aside className="flex h-full flex-col border-r border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))]">
      <div className="border-b border-white/10 px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-yellow-400 text-black">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.28em] text-yellow-400">
              TRONG THAI EVENT
            </div>
            <div className="mt-1 text-lg font-semibold text-white">Trung tâm quản trị</div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="space-y-6">
          {navGroups.map((group) => {
            const visibleItems = group.items.filter(
              (item) => !item.roles || item.roles.includes(currentRole),
            );

            if (!visibleItems.length) {
              return null;
            }

            return (
              <div key={group.title}>
                <div className="px-3 text-[11px] uppercase tracking-[0.28em] text-white/35">
                  {group.title}
                </div>

                <div className="mt-3 space-y-1">
                  {visibleItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(pathname, item.href);

                    return (
                      <div key={item.href}>
                        <Link
                          href={item.href}
                          className={[
                            "flex items-center gap-3 rounded-2xl px-3 py-3 text-sm transition",
                            active
                              ? "bg-yellow-400 text-black"
                              : "text-white/70 hover:bg-white/5 hover:text-white",
                          ].join(" ")}
                        >
                          <Icon className="h-4 w-4" />
                          <span className="font-medium">{item.label}</span>
                        </Link>

                        {active && item.children?.length ? (
                          <div className="mt-2 space-y-1 pl-6">
                            {item.children.map((child) => {
                              const childActive =
                                pathname === "/admin/settings" && activeSection === child.section;

                              return (
                                <Link
                                  key={child.href}
                                  href={child.href}
                                  className={[
                                    "flex rounded-xl px-3 py-2 text-sm transition",
                                    childActive
                                      ? "bg-white/10 text-yellow-300"
                                      : "text-white/55 hover:bg-white/5 hover:text-white",
                                  ].join(" ")}
                                >
                                  {child.label}
                                </Link>
                              );
                            })}
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="border-t border-white/10 px-5 py-5">
        <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
          <div className="flex items-center gap-2 text-sm font-medium text-white">
            <Users className="h-4 w-4 text-yellow-400" />
            Quyền hiện tại
          </div>
          <div className="mt-2 text-sm leading-6 text-white/55">
            {currentRole === "admin"
              ? "Quản trị viên có toàn quyền với nội dung, tài khoản và cài đặt hệ thống."
              : "Biên tập viên có thể quản lý nội dung, media, liên hệ, báo giá và thống kê, nhưng không được vào phần cài đặt."}
          </div>
        </div>
      </div>
    </aside>
  );
}
