import AdminSectionHeader from "../components/AdminSectionHeader";
import AdminNewsListClient from "../components/AdminNewsListClient";
import { getNews } from "@/lib/content-store";

export default async function AdminNewsPage() {
  const items = await getNews();

  return (
    <main className="mx-auto max-w-7xl px-6 py-8">
      <AdminSectionHeader
        title="Quản lý tin tức"
        description="Quản lý các bài viết đang hiển thị trên chuyên mục tin tức."
        actionLabel="Tạo bài viết"
        actionHref="/admin/news/new"
      />

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
          <div className="text-sm text-white/55">Tổng bài viết</div>
          <div className="mt-3 text-4xl font-semibold text-yellow-400">{items.length}</div>
        </div>
        <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
          <div className="text-sm text-white/55">Slug đang hoạt động</div>
          <div className="mt-3 text-4xl font-semibold text-white">{items.length}</div>
        </div>
        <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
          <div className="text-sm text-white/55">Trạng thái</div>
          <div className="mt-3 text-xl font-semibold text-emerald-300">Biên tập đang hoạt động</div>
        </div>
      </div>

      <AdminNewsListClient items={items} />
    </main>
  );
}
