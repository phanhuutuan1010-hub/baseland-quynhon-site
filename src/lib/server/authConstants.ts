// Split out from auth.ts so middleware (Edge runtime) can read the cookie
// name without pulling in Prisma/bcryptjs/node:crypto, none of which run on
// the Edge runtime.
export const SESSION_COOKIE_NAME = "bl_admin_session";
