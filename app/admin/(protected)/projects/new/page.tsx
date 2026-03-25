import Link from "next/link";

import ProjectForm from "../../components/ProjectForm";

export default function AdminProjectNewPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-8">
      <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 md:p-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Tạo dự án mới</h1>
            <p className="mt-2 text-sm text-white/60">Sau khi lưu, website public sẽ cập nhật theo nội dung mới.</p>
          </div>

          <Link href="/admin/projects" className="inline-flex h-11 items-center justify-center rounded-full border border-white/10 px-5 text-sm transition hover:border-yellow-400/40">
            Quay lại
          </Link>
        </div>

        <div className="mt-8">
          <ProjectForm action="/api/admin/projects" submitLabel="Tạo dự án" />
        </div>
      </div>
    </main>
  );
}
