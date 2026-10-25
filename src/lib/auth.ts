import "server-only";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";

const COOKIE_NAME = "yuga_session";
const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "dev-secret-change-me"
);
const MAX_AGE = 60 * 60 * 8; // 8 hours

export type SessionPayload = {
  sub: string; // admin id
  name: string;
  email: string;
  role: string;
};

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSession(
  payload: SessionPayload,
  ipAddress: string = "Unknown",
  location: string = "Unknown",
  userAgent: string = "Unknown"
): Promise<void> {
  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(secret);

  // Safely record session in DB if available and writable
  try {
    const { db } = await import("./db");
    await db.adminSession.create({
      data: {
        adminId: payload.sub,
        token,
        ipAddress,
        location,
        userAgent,
        lastActiveAt: new Date(),
      },
    });
  } catch (err) {
    // If DB is read-only (e.g. Vercel serverless SQLite) or unreachable,
    // the signed JWT cookie still guarantees secure authentication.
    console.warn("Could not save session record in DB (stateless mode active):", err);
  }

  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: MAX_AGE,
    path: "/",
  });
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (token) {
    try {
      const { db } = await import("./db");
      await db.adminSession.deleteMany({ where: { token } }).catch(() => {});
    } catch {
      // Ignore DB errors during logout
    }
  }
  store.delete(COOKIE_NAME);
}

export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export const SESSION_COOKIE = COOKIE_NAME;
