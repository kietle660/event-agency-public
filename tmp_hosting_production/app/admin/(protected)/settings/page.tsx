import AdminAccountsPanel from "../components/AdminAccountsPanel";
import AdminSectionHeader from "../components/AdminSectionHeader";
import WebsiteSettingsForm from "../components/WebsiteSettingsForm";
import { getAdminSession, getAdminUsername } from "@/lib/admin-auth";
import { getSiteSettings } from "@/lib/site-settings";

function toneClass(tone: string) {
  if (tone === "emerald") return "bg-emerald-500/20 text-emerald-300";
  if (tone === "red") return "bg-red-500/20 text-red-200";
  if (tone === "sky") return "bg-sky-500/20 text-sky-300";
  return "bg-yellow-500/20 text-yellow-300";
}

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams?: Promise<{ saved?: string; section?: string; error?: string }>;
}) {
  const params = searchParams ? await searchParams : undefined;
  const settings = await getSiteSettings();
  const session = await getAdminSession();

  const activeSection =
    params?.section === "slider" ||
    params?.section === "partners" ||
    params?.section === "testimonials" ||
    params?.section === "accounts"
      ? params.section
      : "basic";

  const checks = [
    {
      label: "Tài khoản admin",
      value: getAdminUsername(),
      tone: "yellow",
    },
    {
      label: "Tên miền website",
      value: settings.siteUrl,
      tone: "sky",
    },
    {
      label: "Email nhận lead",
      value: settings.contactEmail,
      tone: "emerald",
    },
    {
      label: "Slider trang chủ",
      value: `${settings.heroSlides.length} slide đang hoạt động`,
      tone: "emerald",
    },
  ];

  const envSummary = [
    {
      key: "ADMIN_USERNAME",
      state: process.env.ADMIN_USERNAME ? "Đã đặt" : "Đang dùng mặc định",
    },
    {
      key: "ADMIN_PASSWORD",
      state: process.env.ADMIN_PASSWORD ? "Đã đặt" : "Đang dùng mặc định",
    },
    {
      key: "ADMIN_SESSION_SECRET",
      state: process.env.ADMIN_SESSION_SECRET ? "Đã đặt" : "Cần đặt lại khi deploy",
    },
    {
      key: "GMAIL_USER",
      state: process.env.GMAIL_USER ? "Đã đặt" : "Chưa đặt",
    },
    {
      key: "SUPABASE_URL",
      state: process.env.SUPABASE_URL ? "Đã đặt" : "Chưa đặt",
    },
  ];

  return (
    <main className="mx-auto max-w-7xl px-5 py-6 md:px-6 md:py-8">
      <AdminSectionHeader
        title="Cài đặt website"
        description="Thiết lập thông tin website, slider, đối tác, đánh giá và quản lý tài khoản người dùng trong cùng một khu vực quản trị."
      />

      {params?.saved === "1" ? (
        <div className="mt-6 rounded-2xl border border-emerald-400/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
          {activeSection === "accounts"
            ? "Đã cập nhật tài khoản thành công."
            : "Đã lưu cài đặt website thành công."}
        </div>
      ) : null}

      {params?.error ? (
        <div className="mt-6 rounded-2xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          {params.error}
        </div>
      ) : null}

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {checks.map((item) => (
          <div key={item.label} className="rounded-[24px] border border-white/10 bg-white/5 p-5">
            <div className="text-sm text-white/55">{item.label}</div>
            <div className="mt-3 text-lg font-semibold text-white">{item.value}</div>
            <div className={`mt-4 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${toneClass(item.tone)}`}>
              OK
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        {activeSection === "accounts" && session ? (
          <AdminAccountsPanel currentUserId={session.id} />
        ) : (
          <WebsiteSettingsForm settings={settings} activeSection={activeSection} />
        )}

        <div className="space-y-6">
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-semibold">Preview nhanh</h2>
            <div className="mt-5 space-y-3 text-sm text-white/65">
              <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
                <div className="text-xs text-white/45">Google snippet</div>
                <div className="mt-2 text-lg font-medium text-sky-300">{settings.defaultTitle}</div>
                <div className="mt-1 text-sm text-emerald-300">{settings.siteUrl}</div>
                <div className="mt-2 leading-6 text-white/70">{settings.defaultDescription}</div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
                <div className="font-medium text-white">{settings.siteName}</div>
                <div className="mt-2 text-white/70">{settings.hotline}</div>
                <div className="mt-1 text-white/70">{settings.contactEmail}</div>
                <div className="mt-1 text-white/70">{settings.address}</div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
                <div className="text-xs text-white/45">Logo hiện tại</div>
                <div className="mt-2 break-all text-white/70">{settings.logoUrl}</div>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-semibold">Checklist biến môi trường</h2>
            <div className="mt-5 space-y-3">
              {envSummary.map((item) => (
                <div key={item.key} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
                  <div className="font-medium text-white">{item.key}</div>
                  <div className="mt-2 text-sm text-white/60">{item.state}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
