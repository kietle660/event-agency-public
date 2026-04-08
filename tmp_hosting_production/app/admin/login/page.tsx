import Link from "next/link";
import { redirect } from "next/navigation";

import { getAdminUsername, isAdminAuthenticated } from "@/lib/admin-auth";

type AdminLoginPageProps = {
  searchParams?: Promise<{
    error?: string;
  }>;
};

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  if (await isAdminAuthenticated()) {
    redirect("/admin");
  }

  const params = searchParams ? await searchParams : undefined;
  const hasError = params?.error === "1";

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#3f2c08_0%,#0a0a0a_35%,#000_100%)] px-6 py-12 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[32px] border border-white/10 bg-white/5 shadow-2xl shadow-black/40 backdrop-blur md:grid-cols-[1.1fr_0.9fr]">
          <section className="flex flex-col justify-between border-b border-white/10 p-8 md:border-b-0 md:border-r md:p-12">
            <div>
              <div className="text-sm uppercase tracking-[0.3em] text-yellow-400">
                Cổng quản trị
              </div>
              <h1 className="mt-6 max-w-xl text-4xl font-semibold leading-tight md:text-5xl">
                Khu quản trị riêng cho TRONG THAI EVENT.
              </h1>
              <p className="mt-6 max-w-lg text-base leading-8 text-white/70">
                Đăng nhập để quản lý nội dung, theo dõi dữ liệu hiện có và mở rộng thành hệ thống
                điều hành hoàn chỉnh cho website.
              </p>
            </div>

            <div className="mt-12 grid gap-4 text-sm text-white/70 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-white">Bảo mật bằng cookie HttpOnly</div>
                <div className="mt-2">
                  Phiên đăng nhập được xác thực trên server, không lưu ở localStorage.
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-white">Tài khoản mặc định</div>
                <div className="mt-2">
                  Tên đăng nhập hiện tại: <span className="text-yellow-400">{getAdminUsername()}</span>
                </div>
              </div>
            </div>
          </section>

          <section className="p-8 md:p-12">
            <div className="mx-auto max-w-md">
              <h2 className="text-2xl font-semibold">Đăng nhập admin</h2>
              <p className="mt-2 text-sm text-white/60">
                Đổi tài khoản trong file <code>.env.local</code> để dùng an toàn hơn khi deploy.
              </p>

              {hasError ? (
                <div className="mt-6 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                  Sai tài khoản hoặc mật khẩu. Kiểm tra lại thông tin đăng nhập.
                </div>
              ) : null}

              <form action="/api/admin/login" method="post" className="mt-8 space-y-5">
                <label className="block">
                  <span className="mb-2 block text-sm text-white/70">Tài khoản</span>
                  <input
                    name="username"
                    type="text"
                    autoComplete="username"
                    defaultValue={getAdminUsername()}
                    className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-yellow-400"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm text-white/70">Mật khẩu</span>
                  <input
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-yellow-400"
                  />
                </label>

                <button
                  type="submit"
                  className="w-full rounded-2xl bg-yellow-400 px-5 py-3 font-semibold text-black transition hover:bg-yellow-300"
                >
                  Đăng nhập
                </button>
              </form>

              <Link
                href="/"
                className="mt-6 inline-flex text-sm text-white/60 transition hover:text-yellow-400"
              >
                Quay về website
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
