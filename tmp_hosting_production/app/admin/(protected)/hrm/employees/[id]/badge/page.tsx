import { notFound, redirect } from "next/navigation";

import { HrmEmployeeBadgeBuilder } from "@/app/admin/(protected)/components/HrmEmployeeBadgeBuilder";
import { getAdminSession } from "@/lib/admin-auth";
import { getEmployeeById } from "@/lib/hrm-store";

type EmployeeBadgePageProps = {
  params: Promise<{ id: string }>;
};

export default async function EmployeeBadgePage({ params }: EmployeeBadgePageProps) {
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
    <main className="mx-auto max-w-7xl px-5 py-6 md:px-6 md:py-8">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.35em] text-yellow-300/80">HRM nhan su</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">Bang ten nhan vien</h1>
        <p className="mt-2 text-sm leading-6 text-white/60">
          Tao nhanh mau bang ten de in cho nhan vien {employee.fullName}.
        </p>
      </div>

      <HrmEmployeeBadgeBuilder employee={employee} />
    </main>
  );
}
