import AdminCustomersListClient from "../components/AdminCustomersListClient";
import AdminSectionHeader from "../components/AdminSectionHeader";
import { buildCustomerSummaries, manualCustomerKey } from "@/lib/customer-helpers";
import { getCustomerCrmMap } from "@/lib/customer-crm-store";
import { getManualCustomers } from "@/lib/customer-store";
import { getLeads } from "@/lib/lead-store";

function formatDate(value: string) {
  if (!value) {
    return "Chưa có";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export default async function AdminCustomersPage() {
  const leads = await getLeads();
  const manualCustomers = await getManualCustomers();
  const crmMap = await getCustomerCrmMap();
  const customerMap = new Map(
    Array.from(buildCustomerSummaries(leads).values()).map((customer) => [
      customer.id,
      {
        ...customer,
        status: crmMap.get(customer.id)?.status || "moi",
      },
    ]),
  );

  for (const manualCustomer of manualCustomers) {
    const key = manualCustomerKey(manualCustomer);
    const existing = customerMap.get(key);

    if (existing) {
      existing.name = manualCustomer.name || existing.name;
      existing.company = manualCustomer.company || existing.company;
      existing.phone = manualCustomer.phone || existing.phone;
      existing.email = manualCustomer.email || existing.email;
      existing.latestMessage = manualCustomer.note || existing.latestMessage;
      existing.lastContactAt =
        manualCustomer.createdAt > existing.lastContactAt
          ? manualCustomer.createdAt
          : existing.lastContactAt;
      existing.status = crmMap.get(key)?.status || existing.status;
      continue;
    }

    customerMap.set(key, {
      id: key,
      name: manualCustomer.name || "Khách chưa đặt tên",
      company: manualCustomer.company || "",
      phone: manualCustomer.phone || "",
      email: manualCustomer.email || "",
      leadCount: 0,
      lastContactAt: manualCustomer.createdAt,
      eventTypes: [],
      latestEventDate: "",
      latestLocation: "",
      latestBudget: "",
      latestMessage: manualCustomer.note || "",
      status: crmMap.get(key)?.status || "moi",
    });
  }

  const customers = Array.from(customerMap.values()).sort((a, b) =>
    b.lastContactAt.localeCompare(a.lastContactAt),
  );
  const contactableCustomers = customers.filter((customer) => customer.phone || customer.email);
  const activeEventCustomers = customers.filter(
    (customer) => customer.latestEventDate || customer.latestLocation,
  );
  const quotationCustomers = customers.filter((customer) => customer.status === "da_gui_bao_gia");
  const closedCustomers = customers.filter((customer) => customer.status === "chot");

  return (
    <main className="mx-auto max-w-7xl px-5 py-6 md:px-6 md:py-8">
      <AdminSectionHeader
        title="CRM khách hàng"
        description="Trung tâm quản lý lead, khách hàng, trạng thái chốt sale và lịch sử tổ chức sự kiện theo thời gian."
        actionLabel="Tạo khách hàng"
        actionHref="/admin/customers/new"
      />

      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
          <div className="text-sm text-white/55">Tổng khách hàng</div>
          <div className="mt-3 text-4xl font-semibold text-yellow-400">{customers.length}</div>
          <p className="mt-3 text-sm leading-6 text-white/55">Gộp từ lead website và khách nhập tay.</p>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
          <div className="text-sm text-white/55">Có thể liên hệ lại</div>
          <div className="mt-3 text-4xl font-semibold text-white">{contactableCustomers.length}</div>
          <p className="mt-3 text-sm leading-6 text-white/55">
            Có số điện thoại hoặc email để follow-up.
          </p>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
          <div className="text-sm text-white/55">Đang có nhu cầu sự kiện</div>
          <div className="mt-3 text-4xl font-semibold text-white">{activeEventCustomers.length}</div>
          <p className="mt-3 text-sm leading-6 text-white/55">
            Có địa điểm hoặc ngày tổ chức được để lại.
          </p>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
          <div className="text-sm text-white/55">Đã gửi báo giá / chốt</div>
          <div className="mt-3 text-4xl font-semibold text-white">
            {quotationCustomers.length + closedCustomers.length}
          </div>
          <p className="mt-3 text-sm leading-6 text-white/55">
            {quotationCustomers.length} đã gửi báo giá, {closedCustomers.length} đã chốt.
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-semibold">Tổng quan pipeline khách hàng</h2>
          <div className="mt-5 space-y-4">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-sm font-medium text-white">Lead / khách mới nhất</div>
              <div className="mt-2 text-2xl font-semibold text-yellow-300">
                {customers[0]?.name || "Chưa có dữ liệu"}
              </div>
              <div className="mt-2 text-sm text-white/55">
                {customers[0]
                  ? `Liên hệ ngày ${formatDate(customers[0].lastContactAt)}`
                  : "Khi có lead mới, hệ thống sẽ hiển thị tại đây."}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-xs uppercase tracking-[0.24em] text-white/35">Tổng lead</div>
                <div className="mt-2 text-3xl font-semibold text-white">{leads.length}</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-xs uppercase tracking-[0.24em] text-white/35">
                  Loại sự kiện
                </div>
                <div className="mt-2 text-sm leading-7 text-white/70">
                  {Array.from(new Set(leads.map((lead) => lead.eventType).filter(Boolean)))
                    .slice(0, 4)
                    .join(" • ") || "Chưa có dữ liệu"}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-semibold">Gợi ý điều phối sale</h2>
          <div className="mt-5 space-y-3">
            {[
              "Gộp lead theo số điện thoại hoặc email để nhận ra khách hàng quen.",
              "Ưu tiên liên hệ lại các khách đã để ngân sách, địa điểm hoặc ngày tổ chức.",
              "Trạng thái CRM mini đã có sẵn: mới, đang trao đổi, đã gửi báo giá, chốt.",
            ].map((note) => (
              <div
                key={note}
                className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm leading-6 text-white/65"
              >
                {note}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <AdminCustomersListClient customers={customers} />
      </div>
    </main>
  );
}
