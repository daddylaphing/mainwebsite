/**
 * Simple in-memory sliding window rate limiter.
 * Works per-instance on Vercel (good enough for abuse prevention on low-traffic apps).
 * For multi-region high-scale, swap to Upstash Redis.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean up old entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (entry.resetAt < now) store.delete(key);
  }
}, 10 * 60 * 1000);

export interface RateLimitConfig {
  /** Unique identifier for this limit (e.g. "contact", "signup") */
  id: string;
  /** IP or user identifier */
  identifier: string;
  /** Max requests allowed in the window */
  limit: number;
  /** Window duration in seconds */
  windowSeconds: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetIn: number; // seconds until window resets
}

export function checkRateLimit(config: RateLimitConfig): RateLimitResult {
  const key = `${config.id}:${config.identifier}`;
  const now = Date.now();
  const windowMs = config.windowSeconds * 1000;

  const entry = store.get(key);

  if (!entry || entry.resetAt < now) {
    // New window
    store.set(key, { count: 1, resetAt: now + windowMs });
    return {
      allowed: true,
      remaining: config.limit - 1,
      resetIn: config.windowSeconds,
    };
  }

  if (entry.count >= config.limit) {
    return {
      allowed: false,
      remaining: 0,
      resetIn: Math.ceil((entry.resetAt - now) / 1000),
    };
  }

  entry.count += 1;
  return {
    allowed: true,
    remaining: config.limit - entry.count,
    resetIn: Math.ceil((entry.resetAt - now) / 1000),
  };
}

/**
 * Get the real client IP from Next.js request headers.
 */
export function getClientIp(request: Request): string {
  const headers = request.headers;
  return (
    headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    headers.get("x-real-ip") ||
    "unknown"
  );
}
