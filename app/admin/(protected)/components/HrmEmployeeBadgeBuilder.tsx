"use client";

import { useMemo, useState } from "react";

import type { EmployeeRecord } from "@/lib/hrm-store";

type HrmEmployeeBadgeBuilderProps = {
  employee: EmployeeRecord;
};

export function HrmEmployeeBadgeBuilder({ employee }: HrmEmployeeBadgeBuilderProps) {
  const [widthMm, setWidthMm] = useState("90");
  const [heightMm, setHeightMm] = useState("55");
  const [employeeName, setEmployeeName] = useState(employee.fullName || "");
  const [department, setDepartment] = useState(employee.department || "");

  const badgeStyle = useMemo(
    () => ({
      width: `${Number(widthMm || 90)}mm`,
      height: `${Number(heightMm || 55)}mm`,
    }),
    [heightMm, widthMm],
  );

  return (
    <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
      <section className="rounded-[28px] border border-white/10 bg-white/5 p-6">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.35em] text-yellow-300/80">Tuy chinh bang ten</p>
          <h2 className="text-2xl font-semibold text-white">Bang ten nhan vien</h2>
          <p className="text-sm leading-6 text-white/60">
            Chon kich thuoc phu hop roi bam in de xuat bang ten cho nhan vien.
          </p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 text-sm text-white/70">
            <span>Chieu rong (mm)</span>
            <input
              type="number"
              min="50"
              max="200"
              value={widthMm}
              onChange={(event) => setWidthMm(event.target.value)}
              className="h-12 w-full rounded-2xl border border-white/10 bg-black/20 px-4 text-white outline-none transition focus:border-yellow-400/50"
            />
          </label>

          <label className="space-y-2 text-sm text-white/70">
            <span>Chieu cao (mm)</span>
            <input
              type="number"
              min="30"
              max="150"
              value={heightMm}
              onChange={(event) => setHeightMm(event.target.value)}
              className="h-12 w-full rounded-2xl border border-white/10 bg-black/20 px-4 text-white outline-none transition focus:border-yellow-400/50"
            />
          </label>
        </div>

        <div className="mt-6 space-y-4">
          <label className="space-y-2 text-sm text-white/70">
            <span>Ten nhan vien</span>
            <input
              value={employeeName}
              onChange={(event) => setEmployeeName(event.target.value)}
              className="h-12 w-full rounded-2xl border border-white/10 bg-black/20 px-4 text-white outline-none transition focus:border-yellow-400/50"
            />
          </label>

          <label className="space-y-2 text-sm text-white/70">
            <span>Bo phan</span>
            <input
              value={department}
              onChange={(event) => setDepartment(event.target.value)}
              className="h-12 w-full rounded-2xl border border-white/10 bg-black/20 px-4 text-white outline-none transition focus:border-yellow-400/50"
            />
          </label>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex h-11 items-center justify-center rounded-full bg-yellow-400 px-5 text-sm font-semibold text-black transition hover:bg-yellow-300"
          >
            In bang ten
          </button>
          <a
            href="/admin/hrm/employees"
            className="inline-flex h-11 items-center justify-center rounded-full border border-white/10 px-5 text-sm font-medium text-white/75 transition hover:border-yellow-400/50 hover:text-yellow-300"
          >
            Quay lai danh sach
          </a>
        </div>
      </section>

      <section className="rounded-[28px] border border-white/10 bg-white/5 p-6 print:border-0 print:bg-white print:p-0">
        <div className="overflow-auto rounded-[24px] border border-dashed border-white/10 bg-black/20 p-6 print:overflow-visible print:border-0 print:bg-transparent print:p-0">
          <div className="mx-auto grid gap-6 print:gap-4">
            <div
              className="mx-auto flex flex-col justify-between rounded-[22px] border border-slate-200 bg-white p-5 text-slate-900 shadow-[0_24px_80px_rgba(0,0,0,0.18)] print:shadow-none"
              style={badgeStyle}
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-[9px] font-semibold uppercase tracking-[0.42em] text-slate-500">
                  TRONG THAI EVENT
                </p>
                <div className="rounded-2xl bg-yellow-300 px-3 py-2 text-[11px] font-semibold text-slate-900">
                  {employee.code}
                </div>
              </div>

              <div className="flex flex-1 flex-col items-center justify-center text-center">
                <h3 className="text-[30px] font-bold leading-none tracking-[-0.03em]">
                  {employeeName || "Chua nhap ten"}
                </h3>
              </div>

              <div className="grid gap-2 text-slate-700">
                <div>
                  <p className="text-[9px] uppercase tracking-[0.4em] text-slate-500">BO PHAN</p>
                  <p className="mt-1 text-[18px] font-semibold leading-tight">
                    {department || "Chua nhap bo phan"}
                  </p>
                </div>
              </div>
            </div>

            <div
              className="mx-auto flex items-center justify-center rounded-[22px] border border-slate-200 bg-white p-5 text-slate-900 shadow-[0_24px_80px_rgba(0,0,0,0.18)] print:shadow-none"
              style={badgeStyle}
            >
              <div className="flex flex-col items-center justify-center text-center">
                <img
                  src="/quote-logo.png"
                  alt="Logo cong ty"
                  className="h-24 w-auto object-contain"
                />
                <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.45em] text-slate-500">
                  TRONG THAI EVENT
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
