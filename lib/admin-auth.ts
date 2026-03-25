import crypto from "node:crypto";

import { cookies } from "next/headers";
import {
  getAdminUserById,
  getBootstrapAdminUsername,
  type AdminRole,
  verifyAdminCredentials,
} from "./admin-users";

const ADMIN_COOKIE_NAME = "tt_admin_session";

function getAdminSecret() {
  return process.env.ADMIN_SESSION_SECRET || "trong-thai-event-admin-session-secret";
}

function createSessionToken(userId: string, secret: string) {
  return crypto.createHmac("sha256", secret).update(userId).digest("hex");
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);

  if (left.length !== right.length) {
    return false;
  }

  return crypto.timingSafeEqual(left, right);
}

export async function getAdminSession(): Promise<{
  id: string;
  username: string;
  role: AdminRole;
} | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  const secret = getAdminSecret();

  if (!token) {
    return null;
  }

  const [userId, signature] = token.split(".");

  if (!userId || !signature) {
    return null;
  }

  const expected = createSessionToken(userId, secret);
  if (!safeEqual(signature, expected)) {
    return null;
  }

  const user = await getAdminUserById(userId);
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    username: user.username,
    role: user.role,
  };
}

export async function isAdminAuthenticated() {
  return !!(await getAdminSession());
}

export async function loginAdmin(username: string, password: string) {
  const user = await verifyAdminCredentials(username, password);
  if (!user) {
    return false;
  }

  const cookieStore = await cookies();
  const token = `${user.id}.${createSessionToken(user.id, getAdminSecret())}`;

  cookieStore.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return true;
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export function getAdminUsername() {
  return getBootstrapAdminUsername();
}

export async function isAdminRole(role: AdminRole) {
  const session = await getAdminSession();
  return session?.role === role;
}
