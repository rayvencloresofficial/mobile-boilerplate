import rawRateLimit, { rateLimit as namedRateLimit } from 'express-rate-limit';
import type { Request } from 'express';

const rateLimit = (
  typeof namedRateLimit === 'function'
    ? namedRateLimit
    : typeof rawRateLimit === 'function'
      ? rawRateLimit
      : (rawRateLimit as unknown as { default: typeof namedRateLimit }).default
) as typeof namedRateLimit;

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    type: 'https://httpstatuses.com/429',
    title: 'Too Many Requests',
    status: 429,
    detail: 'Too many authentication attempts from this IP. Please try again in 15 minutes.',
    timestamp: new Date().toISOString(),
  },
});

const isDev = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;

export const apiRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: isDev ? 2000 : 600, // Relaxed in development, 600 requests/min in production
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    type: 'https://httpstatuses.com/429',
    title: 'Too Many Requests',
    status: 429,
    detail: 'Rate limit exceeded. Please slow down your requests.',
    timestamp: new Date().toISOString(),
  },
});

export const bookingRequestRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request) => `${req.ip ?? 'unknown'}:${(req.body as { room_id?: string } | undefined)?.room_id ?? 'global'}`,
  message: {
    type: 'https://httpstatuses.com/429',
    title: 'Too Many Booking Requests',
    status: 429,
    detail: 'This room is receiving too many booking requests. Please wait a moment before trying again.',
    timestamp: new Date().toISOString(),
  },
});
