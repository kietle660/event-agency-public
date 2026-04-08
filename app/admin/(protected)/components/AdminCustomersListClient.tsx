"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type CustomerItem = {
  id: string;
  name: string;
  phone: string;
  email: string;
  company: string;
  leadCount: number;
  lastContactAt: string;
  eventTypes: string[];
  latestEventDate: string;
  latestLocation: string;
  latestBudget: string;
  latestMessage: string;
  status: "moi" | "dang_trao_doi" | "da_gui_bao_gia" | "chot";
};

type AdminCustomersListClientProps = {
  customers: CustomerItem[];
};

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

function customerGroup(customer: CustomerItem) {
  const source = `${customer.name} ${customer.company}`.toLowerCase();
  return source.includes("công ty") || source.includes("cong ty") ? "Công ty" : "Cá nhân";
}

export default function AdminCustomersListClient({
  customers,
}: AdminCustomersListClientProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const filteredCustomers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return customers.filter((customer) => {
      if (!normalizedQuery) {
        return true;
      }

      return [
        customer.name,
        customer.phone,
        customer.email,
        customer.company,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery);
    });
  }, [customers, query]);

  const metricCards = useMemo(
    () => [
      { label: "Tổng khách", value: filteredCustomers.length, tone: "text-yellow-300" },
      {
        label: "Có số điện thoại",
        value: filteredCustomers.filter((customer) => customer.phone).length,
        tone: "text-sky-300",
      },
      {
        label: "Có email",
        value: filteredCustomers.filter((customer) => customer.email).length,
        tone: "text-violet-300",
      },
      {
        label: "Nhóm công ty",
        value: filteredCustomers.filter((customer) => customer.company).length,
        tone: "text-emerald-300",
      },
    ],
    [filteredCustomers],
  );

  return (
    <section className="space-y-4">
      <div className="rounded-[24px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.05),rgba(255,255,255,0.025))] px-5 py-4 shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="max-w-xl">
            <div className="text-sm font-medium text-white/60">Danh sách khách hàng</div>
            <div className="mt-1 text-sm leading-6 text-white/45">
              Hiển thị nhanh thông tin cơ bản để tìm và mở hồ sơ khách hàng.
            </div>
          </div>

          <div className="w-full xl:max-w-sm">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Tìm kiếm khách hàng..."
              className="h-11 w-full rounded-2xl border border-white/10 bg-black/30 px-4 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-yellow-400/60"
            />
          </div>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {metricCards.map((card) => (
          <div
            key={card.label}
            className="rounded-[22px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.025))] px-5 py-4"
          >
            <div className="text-sm font-medium text-white/50">{card.label}</div>
            <div className={`mt-2 text-2xl font-semibold ${card.tone}`}>{card.value}</div>
            <div className="mt-1 text-xs text-white/35">Tính trên dữ liệu đang hiển thị</div>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="border-b border-white/10 bg-black/20">
              <tr className="text-[11px] uppercase tracking-[0.22em] text-white/38">
                <th className="w-16 px-5 py-4">STT</th>
                <th className="min-w-[220px] px-5 py-4">Tên</th>
                <th className="min-w-[220px] px-5 py-4">Nhóm khách hàng</th>
                <th className="min-w-[150px] px-5 py-4">SĐT</th>
                <th className="min-w-[240px] px-5 py-4">Gmail</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length ? (
                filteredCustomers.map((customer, index) => (
                  <tr
                    key={customer.id}
                    className="cursor-pointer border-b border-white/10 text-sm text-white/80 transition hover:bg-white/[0.04]"
                    onClick={() => router.push(`/admin/customers/${encodeURIComponent(customer.id)}`)}
                  >
                    <td className="px-5 py-4 text-white/45">{index + 1}</td>
                    <td className="px-5 py-4">
                      <div className="font-semibold text-white">{customer.name}</div>
                      <div className="mt-1 text-xs text-white/45">
                        Cập nhật: {formatDate(customer.lastContactAt)}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-white/70">{customerGroup(customer)}</td>
                    <td className="px-5 py-4">
                      {customer.phone ? (
                        <a
                          href={`tel:${customer.phone}`}
                          onClick={(event) => event.stopPropagation()}
                          className="text-white transition hover:text-yellow-300"
                        >
                          {customer.phone}
                        </a>
                      ) : (
                        <span className="text-white/35">Chưa có</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      {customer.email ? (
                        <a
                          href={`mailto:${customer.email}`}
                          onClick={(event) => event.stopPropagation()}
                          className="break-all text-yellow-300 transition hover:text-yellow-200"
                        >
                          {customer.email}
                        </a>
                      ) : (
                        <span className="text-white/35">Chưa có</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-sm text-white/50">
                    Không có khách hàng nào phù hợp với bộ lọc hiện tại.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap gap-2 border-t border-white/10 bg-black/10 px-5 py-4">
          <Link
            href="/admin/customers/new"
            className="inline-flex h-10 items-center justify-center rounded-xl bg-yellow-400 px-4 text-sm font-semibold text-black transition hover:bg-yellow-300"
          >
            Thêm khách hàng
          </Link>
          <Link
            href="/admin/contacts"
            className="inline-flex h-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm font-medium text-white/75 transition hover:border-yellow-400/50 hover:text-yellow-300"
          >
            Xem lead liên hệ
          </Link>
        </div>
      </div>
    </section>
  );
}
