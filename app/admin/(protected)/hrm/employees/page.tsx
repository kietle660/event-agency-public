import Link from "next/link";
import { redirect } from "next/navigation";

import { getAdminSession } from "@/lib/admin-auth";
import { listEmployees } from "@/lib/hrm-store";

function statusLabel(status: string) {
  switch (status) {
    case "thu_viec":
      return "Thu viec";
    case "tam_nghi":
      return "Tam nghi";
    case "nghi_viec":
      return "Nghi viec";
    default:
      return "Dang lam";
  }
}

export default async function AdminEmployeesPage() {
  const session = await getAdminSession();

  if (!session || session.role !== "admin") {
    redirect("/admin");
  }

  const employees = await listEmployees();

  return (
    <main className="mx-auto max-w-7xl px-5 py-6 md:px-6 md:py-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Danh sach nhan vien</h1>
          <p className="mt-2 text-sm leading-6 text-white/60">
            Bang quan ly nhan vien de theo doi ma nhan su, phong ban, trang thai va thong tin lien he.
          </p>
        </div>

        <Link
          href="/admin/hrm/employees/new"
          className="inline-flex h-11 items-center justify-center rounded-full bg-yellow-400 px-5 text-sm font-semibold text-black transition hover:bg-yellow-300"
        >
          Them nhan vien
        </Link>
      </div>

      <div className="mt-8 overflow-hidden rounded-[28px] border border-white/10 bg-white/5">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="border-b border-white/10 bg-black/20">
              <tr className="text-xs uppercase tracking-[0.2em] text-white/40">
                <th className="px-5 py-4">Ma NS</th>
                <th className="px-5 py-4">Ho ten</th>
                <th className="px-5 py-4">CCCD</th>
                <th className="px-5 py-4">Phong ban</th>
                <th className="px-5 py-4">Chuc vu</th>
                <th className="px-5 py-4">Lien he</th>
                <th className="px-5 py-4">Trang thai</th>
                <th className="px-5 py-4">Bat dau</th>
                <th className="px-5 py-4">Thao tac</th>
              </tr>
            </thead>
            <tbody>
              {employees.length ? (
                employees.map((employee) => (
                  <tr key={employee.id} className="border-b border-white/10 text-sm text-white/80">
                    <td className="px-5 py-4 text-white/50">{employee.code}</td>
                    <td className="px-5 py-4 font-medium text-white">{employee.fullName}</td>
                    <td className="px-5 py-4">{employee.citizenId || "Chua co"}</td>
                    <td className="px-5 py-4">{employee.department}</td>
                    <td className="px-5 py-4">{employee.position}</td>
                    <td className="px-5 py-4">
                      <div className="space-y-1 text-white/65">
                        <div>{employee.phone || "Chua co SDT"}</div>
                        <div>{employee.email || "Chua co email"}</div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-yellow-500/20 px-3 py-1 text-xs font-semibold text-yellow-300">
                        {statusLabel(employee.status)}
                      </span>
                    </td>
                    <td className="px-5 py-4">{employee.startDate || "Chua co"}</td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`/admin/hrm/employees/${employee.id}/edit`}
                          className="inline-flex items-center justify-center rounded-full border border-white/10 px-3 py-2 text-xs font-medium text-white/75 transition hover:border-yellow-400/50 hover:text-yellow-300"
                        >
                          Sua
                        </Link>
                        <Link
                          href={`/admin/hrm/employees/${employee.id}/badge`}
                          className="inline-flex items-center justify-center rounded-full border border-white/10 px-3 py-2 text-xs font-medium text-white/75 transition hover:border-yellow-400/50 hover:text-yellow-300"
                        >
                          Bang ten
                        </Link>
                        <Link
                          href={`/admin/hrm/employees/${employee.id}/piecework-contract`}
                          className="inline-flex items-center justify-center rounded-full border border-white/10 px-3 py-2 text-xs font-medium text-white/75 transition hover:border-yellow-400/50 hover:text-yellow-300"
                        >
                          Khoan viec
                        </Link>
                        <form action="/api/admin/hrm/employees" method="post">
                          <input type="hidden" name="intent" value="delete" />
                          <input type="hidden" name="id" value={employee.id} />
                          <button
                            type="submit"
                            className="inline-flex items-center justify-center rounded-full border border-red-500/30 px-3 py-2 text-xs font-medium text-red-300 transition hover:bg-red-500/10"
                          >
                            Xoa
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-sm text-white/50">
                    Chua co nhan vien nao trong he thong.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
