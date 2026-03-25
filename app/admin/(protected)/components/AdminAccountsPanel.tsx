import { listAdminUsers, type AdminUser } from "@/lib/admin-users";

export default async function AdminAccountsPanel({
  currentUserId,
}: {
  currentUserId: string;
}) {
  const users = await listAdminUsers();

  return (
    <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
      <h2 className="text-xl font-semibold">Tài khoản quản trị</h2>
      <p className="mt-2 text-sm text-white/60">
        Tạo, xóa và phân quyền tài khoản quản trị viên hoặc biên tập viên.
      </p>

      <div className="mt-6 rounded-[24px] border border-white/10 bg-black/20 p-5">
        <h3 className="text-lg font-semibold">Tạo tài khoản mới</h3>
        <form action="/api/admin/users" method="post" className="mt-4 grid gap-4 md:grid-cols-2">
          <input type="hidden" name="intent" value="create" />

          <label className="block">
            <span className="mb-2 block text-sm text-white/70">Tên đăng nhập</span>
            <input
              name="username"
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm text-white/70">Mật khẩu</span>
            <input
              name="password"
              type="password"
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400"
            />
          </label>

          <label className="block md:col-span-2">
            <span className="mb-2 block text-sm text-white/70">Quyền</span>
            <select
              name="role"
              defaultValue="editor"
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400"
            >
              <option value="admin">Quản trị viên</option>
              <option value="editor">Biên tập viên</option>
            </select>
          </label>

          <div className="md:col-span-2">
            <button
              type="submit"
              className="inline-flex h-11 items-center justify-center rounded-full bg-yellow-400 px-5 text-sm font-semibold text-black transition hover:bg-yellow-300"
            >
              Tạo tài khoản
            </button>
          </div>
        </form>
      </div>

      <div className="mt-6 space-y-4">
        {users.map((user) => (
          <AccountCard key={user.id} user={user} currentUserId={currentUserId} />
        ))}
      </div>
    </div>
  );
}

function AccountCard({
  user,
  currentUserId,
}: {
  user: AdminUser;
  currentUserId: string;
}) {
  const isCurrentUser = user.id === currentUserId;

  return (
    <div className="rounded-[24px] border border-white/10 bg-black/20 p-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="text-lg font-semibold text-white">{user.username}</div>
          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            <span
              className={`rounded-full px-3 py-1 font-semibold ${
                user.role === "admin"
                  ? "bg-yellow-400/15 text-yellow-300"
                  : "bg-sky-500/15 text-sky-300"
              }`}
            >
              {user.role === "admin" ? "Quản trị viên" : "Biên tập viên"}
            </span>
            {isCurrentUser ? (
              <span className="rounded-full bg-emerald-500/15 px-3 py-1 font-semibold text-emerald-300">
                Tài khoản hiện tại
              </span>
            ) : null}
          </div>
        </div>

        <div className="text-xs text-white/45">
          Tạo lúc {new Date(user.createdAt).toLocaleString("vi-VN")}
        </div>
      </div>

      <form action="/api/admin/users" method="post" className="mt-5 grid gap-4 md:grid-cols-2">
        <input type="hidden" name="intent" value="update" />
        <input type="hidden" name="id" value={user.id} />

        <label className="block">
          <span className="mb-2 block text-sm text-white/70">Quyền</span>
          <select
            name="role"
            defaultValue={user.role}
            className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400"
          >
            <option value="admin">Quản trị viên</option>
            <option value="editor">Biên tập viên</option>
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm text-white/70">Mật khẩu mới</span>
          <input
            name="password"
            type="password"
            placeholder="Bỏ trống nếu không đổi"
            className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400"
          />
        </label>

        <div className="md:col-span-2 flex flex-wrap gap-3">
          <button
            type="submit"
            className="inline-flex h-10 items-center justify-center rounded-full border border-white/10 px-4 text-sm transition hover:border-yellow-400/40"
          >
            Lưu thay đổi
          </button>
        </div>
      </form>

      <form action="/api/admin/users" method="post" className="mt-3">
        <input type="hidden" name="intent" value="delete" />
        <input type="hidden" name="id" value={user.id} />
        <button
          type="submit"
          disabled={isCurrentUser}
          className="inline-flex h-10 items-center justify-center rounded-full border border-red-400/30 px-4 text-sm text-red-200 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Xóa tài khoản
        </button>
      </form>
    </div>
  );
}

