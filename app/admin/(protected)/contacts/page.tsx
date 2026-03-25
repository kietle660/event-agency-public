import AdminSectionHeader from "../components/AdminSectionHeader";
import { getLeadStats } from "@/lib/lead-store";

const inboxSteps = [
  {
    title: "Lead từ website",
    detail: "Form liên hệ hiện đang gửi email và đồng thời lưu lead vào hệ thống.",
    status: "Đang hoạt động",
  },
  {
    title: "Xác nhận brief",
    detail: "Nên phân loại theo loại sự kiện, địa điểm, quy mô khách và ngân sách dự kiến.",
    status: "Đang xử lý",
  },
  {
    title: "Báo giá / follow-up",
    detail: "Bước tiếp theo có thể nâng cấp thành CRM mini với trạng thái lead và người phụ trách.",
    status: "Sẵn sàng",
  },
];

export default async function AdminContactsPage() {
  const mailConfigured = Boolean(
    process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD
  );
  const leadStats = await getLeadStats();

  return (
    <main className="mx-auto max-w-7xl px-5 py-6 md:px-6 md:py-8">
      <AdminSectionHeader
        title="Trung tâm liên hệ"
        description="Theo dõi số lượng khách hàng đã nhắn tin, trạng thái tiếp nhận và cấu hình gửi email hiện tại."
      />

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
          <div className="text-sm text-white/55">Tổng lead</div>
          <div className="mt-3 text-4xl font-semibold text-yellow-400">{leadStats.total}</div>
        </div>
        <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
          <div className="text-sm text-white/55">Lead gần đây</div>
          <div className="mt-3 text-4xl font-semibold text-white">{leadStats.recent.length}</div>
        </div>
        <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
          <div className="text-sm text-white/55">Email gateway</div>
          <div className="mt-3 text-xl font-semibold text-white">
            {mailConfigured ? "Đã cấu hình" : "Chưa cấu hình"}
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-semibold">Quy trình tiếp nhận lead</h2>
          <div className="mt-6 space-y-4">
            {inboxSteps.map((step) => (
              <div key={step.title} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-medium text-white">{step.title}</div>
                    <div className="mt-2 text-sm leading-6 text-white/60">{step.detail}</div>
                  </div>
                  <div className="rounded-full bg-yellow-500/20 px-3 py-1 text-xs font-semibold text-yellow-300">
                    {step.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-semibold">Lead mới nhất</h2>
            <div className="mt-5 space-y-3">
              {leadStats.recent.length ? (
                leadStats.recent.map((lead) => (
                  <div key={lead.id} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
                    <div className="font-medium text-white">{lead.name}</div>
                    <div className="mt-2 text-sm text-white/55">
                      {lead.phone} • {lead.eventType}
                    </div>
                    <div className="mt-1 text-xs text-white/40">{lead.createdAt}</div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm text-white/55">
                  Chưa có lead nào.
                </div>
              )}
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-semibold">Trạng thái email</h2>
            <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-sm text-white/55">Cấu hình gửi mail</div>
              <div className="mt-3 text-2xl font-semibold text-white">
                {mailConfigured ? "Đã cấu hình" : "Chưa cấu hình"}
              </div>
              <p className="mt-3 text-sm leading-6 text-white/60">
                {mailConfigured
                  ? "GMAIL_USER và GMAIL_APP_PASSWORD đang tồn tại trong biến môi trường."
                  : "Cần thêm GMAIL_USER và GMAIL_APP_PASSWORD để form liên hệ gửi được email."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
