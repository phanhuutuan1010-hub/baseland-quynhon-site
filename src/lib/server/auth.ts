import "server-only";

import { randomBytes, createHash } from "node:crypto";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import type { Role, User } from "@prisma/client";
import { prisma } from "./db";
import { SESSION_COOKIE_NAME } from "./authConstants";

export { SESSION_COOKIE_NAME };
const SESSION_TTL_DAYS = 7;
const RESET_TOKEN_TTL_MINUTES = 30;
const MAX_FAILED_LOGINS = 5;
const LOCKOUT_MINUTES = 15;
const BCRYPT_ROUNDS = 12;

function hashToken(rawToken: string): string {
  return createHash("sha256").update(rawToken).digest("hex");
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

export async function verifyPassword(password: string, passwordHash: string): Promise<boolean> {
  return bcrypt.compare(password, passwordHash);
}

// --- Login throttling (per-account, DB-backed so it holds across serverless
// invocations/regions — an in-memory counter would not). ---

export async function isAccountLocked(user: Pick<User, "lockedUntil">): Promise<boolean> {
  return !!user.lockedUntil && user.lockedUntil.getTime() > Date.now();
}

export async function recordFailedLogin(userId: string): Promise<void> {
  const user = await prisma.user.update({
    where: { id: userId },
    data: { failedLoginCount: { increment: 1 } },
  });
  if (user.failedLoginCount >= MAX_FAILED_LOGINS) {
    await prisma.user.update({
      where: { id: userId },
      data: { lockedUntil: new Date(Date.now() + LOCKOUT_MINUTES * 60_000), failedLoginCount: 0 },
    });
  }
}

async function clearFailedLogins(userId: string): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: { failedLoginCount: 0, lockedUntil: null, lastLoginAt: new Date() },
  });
}

// --- Session lifecycle ---

export async function createSession(userId: string, userAgent?: string): Promise<string> {
  const rawToken = randomBytes(32).toString("hex");
  await prisma.session.create({
    data: {
      userId,
      tokenHash: hashToken(rawToken),
      userAgent,
      expiresAt: new Date(Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60_000),
    },
  });
  return rawToken;
}

export async function loginSucceeded(userId: string, userAgent?: string): Promise<void> {
  await clearFailedLogins(userId);
  const rawToken = await createSession(userId, userAgent);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, rawToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_DAYS * 24 * 60 * 60,
  });
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  const rawToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (rawToken) {
    await prisma.session.deleteMany({ where: { tokenHash: hashToken(rawToken) } }).catch(() => {});
  }
  cookieStore.delete(SESSION_COOKIE_NAME);
}

// The one place that turns "a cookie was sent" into "this is a real, active
// user" — every admin page/layout and every server action must call this (or
// requireRole) themselves. The middleware only does a cheap pre-check; it
// never grants access on its own.
//
// cache()-wrapped: a single page render often calls this 2-3 times (root
// admin layout + a nested per-section layout + the page itself all guard
// independently, by design — see each one's own comment). Without caching,
// that's 2-3 redundant round trips to the session table for the exact same
// cookie within one request; measured at ~600-1100ms each against this
// project's Neon (ap-southeast-1) instance, so the redundancy alone could
// add 1-2 extra seconds to a single page load. cache() (from "react") scopes
// the memoized result to one request — it does not leak across users or
// requests the way a module-level variable would.
export const getSessionUser = cache(async (): Promise<User | null> => {
  const cookieStore = await cookies();
  const rawToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!rawToken) return null;

  const session = await prisma.session.findUnique({
    where: { tokenHash: hashToken(rawToken) },
    include: { user: true },
  });
  if (!session || session.expiresAt.getTime() < Date.now()) {
    if (session) await prisma.session.delete({ where: { id: session.id } }).catch(() => {});
    return null;
  }
  return session.user;
});

export async function requireUser(): Promise<User> {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");
  return user;
}

export async function requireRole(...roles: Role[]): Promise<User> {
  const user = await requireUser();
  if (!roles.includes(user.role)) redirect("/admin");
  return user;
}

// --- Password reset ---

export async function createPasswordResetToken(userId: string): Promise<string> {
  const rawToken = randomBytes(32).toString("hex");
  await prisma.passwordResetToken.create({
    data: {
      userId,
      tokenHash: hashToken(rawToken),
      expiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MINUTES * 60_000),
    },
  });
  return rawToken;
}

export async function consumePasswordResetToken(rawToken: string): Promise<string | null> {
  const record = await prisma.passwordResetToken.findUnique({ where: { tokenHash: hashToken(rawToken) } });
  if (!record || record.usedAt || record.expiresAt.getTime() < Date.now()) return null;
  await prisma.passwordResetToken.update({ where: { id: record.id }, data: { usedAt: new Date() } });
  return record.userId;
}
