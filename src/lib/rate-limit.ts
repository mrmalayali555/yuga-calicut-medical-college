/**
 * Lightweight in-memory rate limiter (resets on server restart).
 * Good enough for admin login protection; replace with Redis for multi-instance.
 */
const store = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(
  key: string,
  { max = 10, windowMs = 60_000 }: { max?: number; windowMs?: number } = {}
): { ok: boolean; remaining: number } {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: max - 1 };
  }

  entry.count += 1;
  if (entry.count > max) {
    return { ok: false, remaining: 0 };
  }

  return { ok: true, remaining: max - entry.count };
}
