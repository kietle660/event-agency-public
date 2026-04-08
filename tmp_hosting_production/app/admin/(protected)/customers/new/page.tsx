import Link from "next/link";

export default function AdminCustomerNewPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-8">
      <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 md:p-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Tạo khách hàng mới</h1>
            <p className="mt-2 text-sm text-white/60">
              Thêm thủ công thông tin khách hàng để đưa vào bảng CRM ngay cả khi khách chưa gửi
              form từ website.
            </p>
          </div>

          <Link
            href="/admin/customers"
            className="inline-flex h-11 items-center justify-center rounded-full border border-white/10 px-5 text-sm transition hover:border-yellow-400/40"
          >
            Quay lại
          </Link>
        </div>

        <form action="/api/admin/customers" method="post" className="mt-8 space-y-6">
          <div className="grid gap-5 md:grid-cols-2">
            <label className="block">
              <div className="mb-2 text-sm text-white/70">Tên khách hàng</div>
              <input
                name="name"
                required
                placeholder="Nhập tên khách hàng"
                className="h-12 w-full rounded-2xl border border-white/10 bg-black/20 px-4 text-white outline-none transition focus:border-yellow-400/60"
              />
            </label>

            <label className="block">
              <div className="mb-2 text-sm text-white/70">Công ty / đơn vị</div>
              <input
                name="company"
                placeholder="Nhập tên công ty hoặc đơn vị"
                className="h-12 w-full rounded-2xl border border-white/10 bg-black/20 px-4 text-white outline-none transition focus:border-yellow-400/60"
              />
            </label>

            <label className="block">
              <div className="mb-2 text-sm text-white/70">Số điện thoại</div>
              <input
                name="phone"
                placeholder="Nhập số điện thoại"
                className="h-12 w-full rounded-2xl border border-white/10 bg-black/20 px-4 text-white outline-none transition focus:border-yellow-400/60"
              />
            </label>

            <label className="block">
              <div className="mb-2 text-sm text-white/70">Gmail</div>
              <input
                name="email"
                type="email"
                placeholder="Nhập địa chỉ email"
                className="h-12 w-full rounded-2xl border border-white/10 bg-black/20 px-4 text-white outline-none transition focus:border-yellow-400/60"
              />
            </label>
          </div>

          <label className="block">
            <div className="mb-2 text-sm text-white/70">Ghi chú</div>
            <textarea
              name="note"
              rows={5}
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-yellow-400/60"
              placeholder="Ví dụ: Khách cũ, ưu tiên follow-up tháng này, nhu cầu tổ chức sự kiện khai trương..."
            />
          </label>

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              className="inline-flex h-11 items-center justify-center rounded-full bg-yellow-400 px-5 text-sm font-semibold text-black transition hover:bg-yellow-300"
            >
              Lưu khách hàng
            </button>
            <Link
              href="/admin/customers"
              className="inline-flex h-11 items-center justify-center rounded-full border border-white/10 px-5 text-sm transition hover:border-white/20"
            >
              Hủy
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
