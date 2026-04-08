import Link from "next/link";
import { redirect } from "next/navigation";

import { getAdminSession } from "@/lib/admin-auth";
import { listEmployees } from "@/lib/hrm-store";

function countByStatus(statuses: string[], target: string) {
  return statuses.filter((status) => status === target).length;
}

export default async function AdminHrmPage() {
  const session = await getAdminSession();

  if (!session || session.role !== "admin") {
    redirect("/admin");
  }

  const employees = await listEmployees();
  const statuses = employees.map((employee) => employee.status);
  const departments = new Set(employees.map((employee) => employee.department).filter(Boolean));

  return (
    <main className="mx-auto max-w-7xl px-5 py-6 md:px-6 md:py-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold">HRM quản lý nhân sự</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-white/60">
            Trung tâm điều phối nhân sự để theo dõi phòng ban, trạng thái làm việc và danh sách
            nhân viên.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/hrm/employees"
            className="inline-flex h-11 items-center justify-center rounded-full border border-white/10 px-5 text-sm transition hover:border-yellow-400/40"
          >
            Danh sách nhân viên
          </Link>
          <Link
            href="/admin/hrm/employees/new"
            className="inline-flex h-11 items-center justify-center rounded-full bg-yellow-400 px-5 text-sm font-semibold text-black transition hover:bg-yellow-300"
          >
            Thêm nhân viên
          </Link>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
          <div className="text-sm text-white/55">Tổng nhân viên</div>
          <div className="mt-3 text-4xl font-semibold text-yellow-400">{employees.length}</div>
        </div>
        <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
          <div className="text-sm text-white/55">Đang làm</div>
          <div className="mt-3 text-4xl font-semibold text-white">
            {countByStatus(statuses, "dang_lam")}
          </div>
        </div>
        <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
          <div className="text-sm text-white/55">Thử việc</div>
          <div className="mt-3 text-4xl font-semibold text-white">
            {countByStatus(statuses, "thu_viec")}
          </div>
        </div>
        <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
          <div className="text-sm text-white/55">Tạm nghỉ</div>
          <div className="mt-3 text-4xl font-semibold text-white">
            {countByStatus(statuses, "tam_nghi")}
          </div>
        </div>
        <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
          <div className="text-sm text-white/55">Phòng ban</div>
          <div className="mt-3 text-4xl font-semibold text-white">{departments.size}</div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[28px] border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-semibold">Nhân viên mới nhất</h2>
          <div className="mt-5 space-y-3">
            {employees.slice(0, 5).map((employee) => (
              <div
                key={employee.id}
                className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="font-medium text-white">{employee.fullName}</div>
                    <div className="mt-2 text-sm text-white/55">
                      {employee.position} • {employee.department}
                    </div>
                  </div>
                  <div className="text-sm text-white/45">{employee.code}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[28px] border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-semibold">Hướng mở rộng HRM</h2>
          <div className="mt-5 space-y-3">
            {[
              "Chấm công theo ngày / tháng",
              "Nghỉ phép và phê duyệt đơn nghỉ",
              "Lương, thưởng và công nợ nội bộ",
              "Hợp đồng, hồ sơ nhân sự và lịch sử thay đổi",
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm text-white/65"
              >
                {item}
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
