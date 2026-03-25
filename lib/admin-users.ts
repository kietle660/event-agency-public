import crypto from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export type AdminRole = "admin" | "editor";

type AdminUserRecord = {
  id: string;
  username: string;
  role: AdminRole;
  passwordSalt: string;
  passwordHash: string;
  createdAt: string;
};

export type AdminUser = {
  id: string;
  username: string;
  role: AdminRole;
  createdAt: string;
};

const dataDir = path.join(process.cwd(), "data");
const usersFile = path.join(dataDir, "admin-users.json");

function getBootstrapAdminConfig() {
  return {
    username: process.env.ADMIN_USERNAME || "admin",
    password: process.env.ADMIN_PASSWORD || "12345678",
  };
}

function hashPassword(password: string, salt: string) {
  return crypto.scryptSync(password, salt, 64).toString("hex");
}

function sanitizeUser(user: AdminUserRecord): AdminUser {
  return {
    id: user.id,
    username: user.username,
    role: user.role,
    createdAt: user.createdAt,
  };
}

async function ensureUsersFile() {
  await mkdir(dataDir, { recursive: true });

  try {
    await readFile(usersFile, "utf8");
  } catch {
    await writeFile(usersFile, "[]", "utf8");
  }
}

async function readUsers(): Promise<AdminUserRecord[]> {
  await ensureUsersFile();
  const raw = await readFile(usersFile, "utf8");
  const parsed = JSON.parse(raw) as AdminUserRecord[];
  return parsed;
}

async function writeUsers(users: AdminUserRecord[]) {
  await ensureUsersFile();
  await writeFile(usersFile, JSON.stringify(users, null, 2), "utf8");
}

async function ensureBootstrapAdmin() {
  const users = await readUsers();
  const bootstrap = getBootstrapAdminConfig();

  if (users.some((user) => user.username === bootstrap.username)) {
    return users;
  }

  const passwordSalt = crypto.randomUUID();
  const nextUser: AdminUserRecord = {
    id: crypto.randomUUID(),
    username: bootstrap.username,
    role: "admin",
    passwordSalt,
    passwordHash: hashPassword(bootstrap.password, passwordSalt),
    createdAt: new Date().toISOString(),
  };

  const nextUsers = [nextUser, ...users];
  await writeUsers(nextUsers);
  return nextUsers;
}

async function getUserRecords() {
  return ensureBootstrapAdmin();
}

export async function listAdminUsers() {
  const users = await getUserRecords();
  return users.map(sanitizeUser);
}

export async function getAdminUserById(id: string) {
  const users = await getUserRecords();
  const user = users.find((item) => item.id === id);
  return user ? sanitizeUser(user) : null;
}

export async function verifyAdminCredentials(username: string, password: string) {
  const users = await getUserRecords();
  const user = users.find((item) => item.username === username);

  if (!user) {
    return null;
  }

  const expected = hashPassword(password, user.passwordSalt);
  const left = Buffer.from(expected);
  const right = Buffer.from(user.passwordHash);

  if (left.length !== right.length || !crypto.timingSafeEqual(left, right)) {
    return null;
  }

  return sanitizeUser(user);
}

export async function createAdminUser(input: {
  username: string;
  password: string;
  role: AdminRole;
}) {
  const username = input.username.trim();
  const password = input.password;
  const role = input.role;

  if (!username) {
    throw new Error("Tên đăng nhập không được để trống.");
  }

  if (password.length < 6) {
    throw new Error("Mật khẩu phải từ 6 ký tự trở lên.");
  }

  const users = await getUserRecords();

  if (users.some((user) => user.username.toLowerCase() === username.toLowerCase())) {
    throw new Error("Tên đăng nhập đã tồn tại.");
  }

  const passwordSalt = crypto.randomUUID();
  const nextUser: AdminUserRecord = {
    id: crypto.randomUUID(),
    username,
    role,
    passwordSalt,
    passwordHash: hashPassword(password, passwordSalt),
    createdAt: new Date().toISOString(),
  };

  const nextUsers = [nextUser, ...users];
  await writeUsers(nextUsers);
  return sanitizeUser(nextUser);
}

export async function updateAdminUser(input: {
  id: string;
  role: AdminRole;
  password?: string;
  currentUserId?: string;
}) {
  const users = await getUserRecords();
  const target = users.find((user) => user.id === input.id);

  if (!target) {
    throw new Error("Không tìm thấy tài khoản.");
  }

  if (target.id === input.currentUserId && input.role !== "admin") {
    throw new Error("Không thể tự hạ quyền tài khoản hiện tại.");
  }

  target.role = input.role;

  if (input.password?.trim()) {
    if (input.password.trim().length < 6) {
      throw new Error("Mật khẩu mới phải từ 6 ký tự trở lên.");
    }

    target.passwordSalt = crypto.randomUUID();
    target.passwordHash = hashPassword(input.password.trim(), target.passwordSalt);
  }

  if (!users.some((user) => user.role === "admin")) {
    throw new Error("Hệ thống phải có ít nhất một quản trị viên.");
  }

  await writeUsers(users);
  return sanitizeUser(target);
}

export async function deleteAdminUser(id: string, currentUserId?: string) {
  const users = await getUserRecords();
  const target = users.find((user) => user.id === id);

  if (!target) {
    throw new Error("Không tìm thấy tài khoản.");
  }

  if (target.id === currentUserId) {
    throw new Error("Không thể xóa tài khoản đang đăng nhập.");
  }

  const nextUsers = users.filter((user) => user.id !== id);

  if (!nextUsers.some((user) => user.role === "admin")) {
    throw new Error("Hệ thống phải có ít nhất một quản trị viên.");
  }

  await writeUsers(nextUsers);
}

export function getBootstrapAdminUsername() {
  return getBootstrapAdminConfig().username;
}
