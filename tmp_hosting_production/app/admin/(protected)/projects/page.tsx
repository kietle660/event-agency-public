import AdminSectionHeader from "../components/AdminSectionHeader";
import AdminProjectsListClient from "../components/AdminProjectsListClient";
import { getProjects } from "@/lib/content-store";

export default async function AdminProjectsPage() {
  const projects = await getProjects();

  return (
    <main className="mx-auto max-w-7xl px-6 py-8">
      <AdminSectionHeader
        title="Quản lý dự án"
        description="Quản lý danh sách dự án đang hiển thị trên website."
        actionLabel="Tạo dự án"
        actionHref="/admin/projects/new"
      />

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
          <div className="text-sm text-white/55">Tổng dự án</div>
          <div className="mt-3 text-4xl font-semibold text-yellow-400">{projects.length}</div>
        </div>
        <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
          <div className="text-sm text-white/55">Trang chi tiết</div>
          <div className="mt-3 text-4xl font-semibold text-white">{projects.length}</div>
        </div>
        <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
          <div className="text-sm text-white/55">Trạng thái</div>
          <div className="mt-3 text-xl font-semibold text-emerald-300">CRUD sẵn sàng</div>
        </div>
      </div>

      <AdminProjectsListClient projects={projects} />
    </main>
  );
}
