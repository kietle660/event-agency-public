import type { EmployeeRecord, EmployeeStatus } from "@/lib/hrm-store";

const statusOptions: { value: EmployeeStatus; label: string }[] = [
  { value: "thu_viec", label: "Thu viec" },
  { value: "dang_lam", label: "Dang lam" },
  { value: "tam_nghi", label: "Tam nghi" },
  { value: "nghi_viec", label: "Nghi viec" },
];

type HrmEmployeeFormProps = {
  action: string;
  submitLabel: string;
  employee?: EmployeeRecord | null;
};

export default function HrmEmployeeForm({
  action,
  submitLabel,
  employee,
}: HrmEmployeeFormProps) {
  return (
    <form action={action} method="post" className="space-y-6">
      {employee ? <input type="hidden" name="intent" value="update" /> : null}
      {employee ? <input type="hidden" name="id" value={employee.id} /> : null}

      <div className="grid gap-5 md:grid-cols-2">
        <label className="block">
          <div className="mb-2 text-sm text-white/70">Ho va ten</div>
          <input
            name="fullName"
            required
            defaultValue={employee?.fullName || ""}
            className="h-12 w-full rounded-2xl border border-white/10 bg-black/20 px-4 text-white outline-none transition focus:border-yellow-400/60"
          />
        </label>

        <label className="block">
          <div className="mb-2 text-sm text-white/70">Can cuoc cong dan</div>
          <input
            name="citizenId"
            defaultValue={employee?.citizenId || ""}
            className="h-12 w-full rounded-2xl border border-white/10 bg-black/20 px-4 text-white outline-none transition focus:border-yellow-400/60"
          />
        </label>

        <label className="block">
          <div className="mb-2 text-sm text-white/70">Phong ban</div>
          <input
            name="department"
            required
            defaultValue={employee?.department || ""}
            className="h-12 w-full rounded-2xl border border-white/10 bg-black/20 px-4 text-white outline-none transition focus:border-yellow-400/60"
          />
        </label>

        <label className="block">
          <div className="mb-2 text-sm text-white/70">Chuc vu</div>
          <input
            name="position"
            required
            defaultValue={employee?.position || ""}
            className="h-12 w-full rounded-2xl border border-white/10 bg-black/20 px-4 text-white outline-none transition focus:border-yellow-400/60"
          />
        </label>

        <label className="block">
          <div className="mb-2 text-sm text-white/70">Trang thai</div>
          <select
            name="status"
            defaultValue={employee?.status || "dang_lam"}
            className="h-12 w-full rounded-2xl border border-white/10 bg-black/20 px-4 text-white outline-none transition focus:border-yellow-400/60"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <div className="mb-2 text-sm text-white/70">So dien thoai</div>
          <input
            name="phone"
            defaultValue={employee?.phone || ""}
            className="h-12 w-full rounded-2xl border border-white/10 bg-black/20 px-4 text-white outline-none transition focus:border-yellow-400/60"
          />
        </label>

        <label className="block">
          <div className="mb-2 text-sm text-white/70">Email</div>
          <input
            name="email"
            type="email"
            defaultValue={employee?.email || ""}
            className="h-12 w-full rounded-2xl border border-white/10 bg-black/20 px-4 text-white outline-none transition focus:border-yellow-400/60"
          />
        </label>

        <label className="block">
          <div className="mb-2 text-sm text-white/70">Ngay bat dau</div>
          <input
            name="startDate"
            type="date"
            defaultValue={employee?.startDate || ""}
            className="h-12 w-full rounded-2xl border border-white/10 bg-black/20 px-4 text-white outline-none transition focus:border-yellow-400/60"
          />
        </label>

        <label className="block">
          <div className="mb-2 text-sm text-white/70">Luong / phu cap</div>
          <input
            name="salary"
            defaultValue={employee?.salary || ""}
            className="h-12 w-full rounded-2xl border border-white/10 bg-black/20 px-4 text-white outline-none transition focus:border-yellow-400/60"
          />
        </label>
      </div>

      <label className="block">
        <div className="mb-2 text-sm text-white/70">Ghi chu noi bo</div>
        <textarea
          name="notes"
          rows={5}
          defaultValue={employee?.notes || ""}
          className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-yellow-400/60"
        />
      </label>

      <button
        type="submit"
        className="inline-flex h-11 items-center justify-center rounded-full bg-yellow-400 px-5 text-sm font-semibold text-black transition hover:bg-yellow-300"
      >
        {submitLabel}
      </button>
    </form>
  );
}
