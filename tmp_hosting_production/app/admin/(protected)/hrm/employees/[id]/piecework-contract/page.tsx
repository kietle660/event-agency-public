import { notFound, redirect } from "next/navigation";

import { HrmPieceworkContractBuilder } from "@/app/admin/(protected)/components/HrmPieceworkContractBuilder";
import { getAdminSession } from "@/lib/admin-auth";
import { getEmployeeById } from "@/lib/hrm-store";

type EmployeePieceworkContractPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EmployeePieceworkContractPage({
  params,
}: EmployeePieceworkContractPageProps) {
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
    <main className="mx-auto max-w-7xl px-5 py-6 print:max-w-none print:px-0 print:py-0 md:px-6 md:py-8">
      <div className="mb-6 print:hidden">
        <p className="text-xs uppercase tracking-[0.35em] text-yellow-300/80">HRM nhân sự</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">Hợp đồng khoán việc</h1>
        <p className="mt-2 text-sm leading-6 text-white/60">
          Tạo nhanh hợp đồng khoán việc cho nhân viên {employee.fullName} và in trực tiếp từ hệ thống.
        </p>
      </div>

      <HrmPieceworkContractBuilder employee={employee} />
    </main>
  );
}
