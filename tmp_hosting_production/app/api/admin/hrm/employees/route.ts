import { NextResponse } from "next/server";

import { getAdminSession } from "@/lib/admin-auth";
import {
  createEmployee,
  deleteEmployee,
  type EmployeeStatus,
  updateEmployee,
} from "@/lib/hrm-store";

function formToEmployee(formData: FormData) {
  return {
    fullName: String(formData.get("fullName") || "").trim(),
    citizenId: String(formData.get("citizenId") || "").trim(),
    department: String(formData.get("department") || "").trim(),
    position: String(formData.get("position") || "").trim(),
    phone: String(formData.get("phone") || "").trim(),
    email: String(formData.get("email") || "").trim(),
    startDate: String(formData.get("startDate") || "").trim(),
    salary: String(formData.get("salary") || "").trim(),
    status: String(formData.get("status") || "dang_lam") as EmployeeStatus,
    notes: String(formData.get("notes") || "").trim(),
  };
}

export async function POST(req: Request) {
  const session = await getAdminSession();

  if (!session || session.role !== "admin") {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  const formData = await req.formData();
  const intent = String(formData.get("intent") || "create");

  if (intent === "delete") {
    await deleteEmployee(String(formData.get("id") || ""));
    return NextResponse.redirect(new URL("/admin/hrm/employees", req.url));
  }

  if (intent === "update") {
    await updateEmployee(String(formData.get("id") || ""), formToEmployee(formData));
    return NextResponse.redirect(new URL("/admin/hrm/employees", req.url));
  }

  await createEmployee(formToEmployee(formData));
  return NextResponse.redirect(new URL("/admin/hrm/employees", req.url));
}
