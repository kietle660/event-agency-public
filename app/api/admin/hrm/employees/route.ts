import { NextResponse } from "next/server";

import { getAdminSession } from "@/lib/admin-auth";
import { createRequestUrl } from "@/lib/request-url";
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
    return NextResponse.redirect(createRequestUrl(req, "/admin"));
  }

  const formData = await req.formData();
  const intent = String(formData.get("intent") || "create");

  if (intent === "delete") {
    await deleteEmployee(String(formData.get("id") || ""));
    return NextResponse.redirect(createRequestUrl(req, "/admin/hrm/employees"));
  }

  if (intent === "update") {
    await updateEmployee(String(formData.get("id") || ""), formToEmployee(formData));
    return NextResponse.redirect(createRequestUrl(req, "/admin/hrm/employees"));
  }

  await createEmployee(formToEmployee(formData));
  return NextResponse.redirect(createRequestUrl(req, "/admin/hrm/employees"));
}
