import Link from "next/link";
import { notFound } from "next/navigation";

import {
  buildCustomerHistory,
  buildCustomerSummaries,
  manualCustomerKey,
} from "@/lib/customer-helpers";
import { getCustomerCrmMap } from "@/lib/customer-crm-store";
import { getManualCustomers } from "@/lib/customer-store";
import { getLeads } from "@/lib/lead-store";

function formatDateTime(value: string) {
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
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function statusLabel(status: string) {
  switch (status) {
    case "dang_trao_doi":
      return "Đang trao đổi";
    case "da_gui_bao_gia":
      return "Đã gửi báo giá";
    case "chot":
      return "Chốt";
    default:
      return "Mới";
  }
}

export default async function AdminCustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const leads = await getLeads();
  const manualCustomers = await getManualCustomers();
  const crmMap = await getCustomerCrmMap();
  const crmRecord = crmMap.get(id);

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

  const customer = customerMap.get(id);

  if (!customer) {
    notFound();
  }

  const history = buildCustomerHistory(id, leads, manualCustomers);
  const websiteLeadCount = history.filter((item) => item.source === "lead").length;
  const manualEntryCount = history.filter((item) => item.source === "manual").length;
  const eventDateCount = history.filter((item) => item.eventDate).length;
  const locationCount = history.filter((item) => item.location).length;
  const contractSignedAt = crmRecord?.updatedAt || "";
  const zaloPhone = customer.phone.replace(/\D/g, "");
  const gmailHref = customer.email
    ? `mailto:${customer.email}?subject=${encodeURIComponent(`Trao đổi sự kiện - ${customer.name}`)}`
    : "";
  const quoteHref = `/admin/quotes?customerName=${encodeURIComponent(customer.name)}&customerCompany=${encodeURIComponent(customer.company)}&customerPhone=${encodeURIComponent(customer.phone)}&customerEmail=${encodeURIComponent(customer.email)}`;
  const contractHref = `/admin/contracts?customerName=${encodeURIComponent(customer.name)}&customerCompany=${encodeURIComponent(customer.company)}&customerPhone=${encodeURIComponent(customer.phone)}&customerEmail=${encodeURIComponent(customer.email)}`;
  const liquidationHref = `/admin/liquidations?customerName=${encodeURIComponent(customer.name)}&customerCompany=${encodeURIComponent(customer.company)}&customerPhone=${encodeURIComponent(customer.phone)}&customerEmail=${encodeURIComponent(customer.email)}`;

  return (
    <main className="mx-auto max-w-7xl px-5 py-6 md:px-6 md:py-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="text-sm uppercase tracking-[0.24em] text-white/35">
            CRM / Hồ sơ khách hàng
          </div>
          <h1 className="mt-3 text-3xl font-semibold text-white">{customer.name}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-white/60">
            Theo dõi thông tin liên hệ, mức độ quan tâm, lịch sử sự kiện và khả năng chốt sale của
            khách hàng.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/customers"
            className="inline-flex h-11 items-center justify-center rounded-full border border-white/10 px-5 text-sm transition hover:border-yellow-400/40"
          >
            Quay lại
          </Link>
          <Link
            href="/admin/quotes"
            className="inline-flex h-11 items-center justify-center rounded-full bg-yellow-400 px-5 text-sm font-semibold text-black transition hover:bg-yellow-300"
          >
            Tạo báo giá
          </Link>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
          <div className="text-sm text-white/55">Trạng thái CRM</div>
          <div className="mt-3 text-2xl font-semibold text-yellow-300">{statusLabel(customer.status)}</div>
        </div>
        <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
          <div className="text-sm text-white/55">Tổng lần tương tác</div>
          <div className="mt-3 text-2xl font-semibold text-white">{customer.leadCount}</div>
        </div>
        <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
          <div className="text-sm text-white/55">Lead website</div>
          <div className="mt-3 text-2xl font-semibold text-white">{websiteLeadCount}</div>
        </div>
        <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
          <div className="text-sm text-white/55">Nhập tay</div>
          <div className="mt-3 text-2xl font-semibold text-white">{manualEntryCount}</div>
        </div>
        <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
          <div className="text-sm text-white/55">Ngày sự kiện gần nhất</div>
          <div className="mt-3 text-2xl font-semibold text-white">
            {customer.latestEventDate || "Chưa có"}
          </div>
        </div>
        <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
          <div className="text-sm text-white/55">Liên hệ gần nhất</div>
          <div className="mt-3 text-2xl font-semibold text-white">
            {formatDateTime(customer.lastContactAt)}
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-[28px] border border-white/10 bg-white/5 p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <h2 className="text-xl font-semibold">Bảng thông tin quản trị CRM</h2>
            <div className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-white/55">
              Cập nhật lần cuối: {formatDateTime(customer.lastContactAt)}
            </div>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-xs uppercase tracking-[0.24em] text-white/35">
                Công ty / cá nhân
              </div>
              <div className="mt-2 text-sm text-white">{customer.company || "Cá nhân"}</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-xs uppercase tracking-[0.24em] text-white/35">Số điện thoại</div>
              <div className="mt-2 text-sm text-white">{customer.phone || "Chưa có"}</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-xs uppercase tracking-[0.24em] text-white/35">Email</div>
              <div className="mt-2 text-sm text-white">{customer.email || "Chưa có"}</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-xs uppercase tracking-[0.24em] text-white/35">Ngân sách gần nhất</div>
              <div className="mt-2 text-sm text-white">{customer.latestBudget || "Chưa có"}</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-xs uppercase tracking-[0.24em] text-white/35">Lần có ngày sự kiện</div>
              <div className="mt-2 text-sm text-white">{eventDateCount}</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-xs uppercase tracking-[0.24em] text-white/35">Lần có địa điểm</div>
              <div className="mt-2 text-sm text-white">{locationCount}</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-xs uppercase tracking-[0.24em] text-white/35">Ngày ký hợp đồng</div>
              <div className="mt-2 text-sm text-white">
                {contractSignedAt ? formatDateTime(contractSignedAt) : "Chưa cập nhật"}
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4 md:col-span-2">
              <div className="text-xs uppercase tracking-[0.24em] text-white/35">Địa điểm gần nhất</div>
              <div className="mt-2 text-sm text-white">{customer.latestLocation || "Chưa có"}</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4 md:col-span-2">
              <div className="text-xs uppercase tracking-[0.24em] text-white/35">Ghi chú gần nhất</div>
              <div className="mt-2 text-sm leading-7 text-white/70">
                {customer.latestMessage || "Chưa có ghi chú."}
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4 md:col-span-2">
              <div className="text-xs uppercase tracking-[0.24em] text-white/35">Thao tác nhanh</div>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  href={quoteHref}
                  className="inline-flex h-11 items-center justify-center rounded-full bg-yellow-400 px-5 text-sm font-semibold text-black transition hover:bg-yellow-300"
                >
                  Tạo báo giá
                </Link>
                <Link
                  href={contractHref}
                  className="inline-flex h-11 items-center justify-center rounded-full border border-white/10 px-5 text-sm text-white transition hover:border-yellow-400/40 hover:text-yellow-300"
                >
                  Tạo hợp đồng
                </Link>
                <Link
                  href={liquidationHref}
                  className="inline-flex h-11 items-center justify-center rounded-full border border-white/10 px-5 text-sm text-white transition hover:border-yellow-400/40 hover:text-yellow-300"
                >
                  Tạo thanh lý
                </Link>
                {gmailHref ? (
                  <a
                    href={gmailHref}
                    className="inline-flex h-11 items-center justify-center rounded-full border border-white/10 px-5 text-sm text-white transition hover:border-yellow-400/40 hover:text-yellow-300"
                  >
                    Nhắn tin Gmail
                  </a>
                ) : (
                  <span className="inline-flex h-11 items-center justify-center rounded-full border border-white/10 px-5 text-sm text-white/35">
                    Chưa có Gmail
                  </span>
                )}
                {zaloPhone ? (
                  <a
                    href={`https://zalo.me/${zaloPhone}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-11 items-center justify-center rounded-full border border-white/10 px-5 text-sm text-white transition hover:border-yellow-400/40 hover:text-yellow-300"
                  >
                    Nhắn tin Zalo
                  </a>
                ) : (
                  <span className="inline-flex h-11 items-center justify-center rounded-full border border-white/10 px-5 text-sm text-white/35">
                    Chưa có Zalo
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[28px] border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-semibold">Tổng quan sale / điều phối</h2>
          <div className="mt-5 space-y-4">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-xs uppercase tracking-[0.24em] text-white/35">
                Loại sự kiện đã quan tâm
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {customer.eventTypes.length ? (
                  customer.eventTypes.map((eventType) => (
                    <span
                      key={eventType}
                      className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white/75"
                    >
                      {eventType}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-white/55">Chưa có loại sự kiện cụ thể.</span>
                )}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-xs uppercase tracking-[0.24em] text-white/35">Tỷ trọng lead</div>
                <div className="mt-2 text-2xl font-semibold text-white">
                  {history.length ? Math.round((websiteLeadCount / history.length) * 100) : 0}%
                </div>
                <div className="mt-2 text-sm text-white/55">Nguồn từ website</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-xs uppercase tracking-[0.24em] text-white/35">Tỷ trọng nhập tay</div>
                <div className="mt-2 text-2xl font-semibold text-white">
                  {history.length ? Math.round((manualEntryCount / history.length) * 100) : 0}%
                </div>
                <div className="mt-2 text-sm text-white/55">Nguồn admin thêm thủ công</div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="mt-8 rounded-[28px] border border-white/10 bg-white/5 p-6">
        <h2 className="text-xl font-semibold">Lịch sử sự kiện / quan tâm</h2>
        <p className="mt-2 text-sm leading-6 text-white/60">
          Đây là toàn bộ các lần khách đã từng gửi lead hoặc được thêm thủ công vào hệ thống.
        </p>

        <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
          {history.length ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead className="border-b border-white/10 bg-black/20">
                  <tr className="text-xs uppercase tracking-[0.2em] text-white/40">
                    <th className="px-5 py-4">Lần</th>
                    <th className="px-5 py-4">Nguồn</th>
                    <th className="px-5 py-4">Ngày ghi nhận</th>
                    <th className="px-5 py-4">Loại sự kiện</th>
                    <th className="px-5 py-4">Ngày sự kiện</th>
                    <th className="px-5 py-4">Địa điểm</th>
                    <th className="px-5 py-4">Ngân sách</th>
                    <th className="px-5 py-4">Ghi chú</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item, index) => (
                    <tr key={item.id} className="border-b border-white/10 align-top text-sm text-white/80">
                      <td className="px-5 py-4 font-medium text-yellow-300">{history.length - index}</td>
                      <td className="px-5 py-4 text-white/65">
                        {item.source === "lead" ? "Website" : "Thủ công"}
                      </td>
                      <td className="px-5 py-4">{formatDateTime(item.createdAt)}</td>
                      <td className="px-5 py-4">{item.eventType || "Chưa có"}</td>
                      <td className="px-5 py-4">{item.eventDate || "Chưa có"}</td>
                      <td className="px-5 py-4">{item.location || "Chưa có"}</td>
                      <td className="px-5 py-4">{item.budget || "Chưa có"}</td>
                      <td className="px-5 py-4">
                        <div className="max-w-[340px] whitespace-pre-wrap text-white/70">
                          {item.message || "Chưa có nội dung chi tiết."}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-white/10 bg-black/20 px-4 py-10 text-center text-sm text-white/55">
              Chưa có lịch sử sự kiện nào cho khách hàng này.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
