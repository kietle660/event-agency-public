import { redirect } from "next/navigation";

import { getAdminSession } from "@/lib/admin-auth";

export default async function AdminSettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  if (session.role !== "admin") {
    redirect("/admin");
  }

  return children;
}
