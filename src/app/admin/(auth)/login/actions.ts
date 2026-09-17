"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/server/db";
import { isAccountLocked, loginSucceeded, recordFailedLogin, verifyPassword } from "@/lib/server/auth";
import { isRateLimited } from "@/lib/server/rateLimit";
import { loginSchema } from "@/lib/server/validation/auth";

export type LoginState = { error?: string };

const GENERIC_ERROR = "Email hoặc mật khẩu không đúng.";
const LOCKED_ERROR = "Tài khoản tạm thời bị khóa do đăng nhập sai nhiều lần. Vui lòng thử lại sau ít phút.";

export async function loginAction(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const headerList = await headers();
  const ip = headerList.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(`login:${ip}`, 20, 5 * 60_000)) {
    return { error: "Quá nhiều lượt thử. Vui lòng thử lại sau." };
  }

  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? GENERIC_ERROR };
  }

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email.toLowerCase() } });
  if (!user) return { error: GENERIC_ERROR };

  if (await isAccountLocked(user)) return { error: LOCKED_ERROR };

  const validPassword = await verifyPassword(parsed.data.password, user.passwordHash);
  if (!validPassword) {
    await recordFailedLogin(user.id);
    return { error: GENERIC_ERROR };
  }

  await loginSucceeded(user.id, headerList.get("user-agent") ?? undefined);
  redirect("/admin");
}
