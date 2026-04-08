import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import HrmEmployeeForm from "../../../../components/HrmEmployeeForm";
import { getAdminSession } from "@/lib/admin-auth";
import { getEmployeeById } from "@/lib/hrm-store";

export default async function AdminEmployeeEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getAdminSession();

  if (!session || session.role !== "admin") {
    redirect("/admin");
  }

  const { id } = await params;
  const employee = await getEmployeeById(id);

  if (!employee) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-8">
      <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 md:p-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Cap nhat nhan vien</h1>
            <p className="mt-2 text-sm text-white/60">
              Chinh sua ho so va trang thai lam viec cua nhan vien.
            </p>
          </div>

          <Link
            href="/admin/hrm/employees"
            className="inline-flex h-11 items-center justify-center rounded-full border border-white/10 px-5 text-sm transition hover:border-yellow-400/40"
          >
            Quay lai
          </Link>
        </div>

        <div className="mt-8">
          <HrmEmployeeForm
            action="/api/admin/hrm/employees"
            submitLabel="Luu cap nhat"
            employee={employee}
          />
        </div>
      </div>
    </main>
  );
}
