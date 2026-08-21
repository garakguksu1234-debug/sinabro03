import { betterAuth } from 'better-auth'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const origin = process.env.V0_RUNTIME_URL || process.env.VERCEL_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL
const baseURL = process.env.BETTER_AUTH_URL || (origin ? `https://${origin.replace(/^https?:\/\//, '')}` : undefined)

export const auth = betterAuth({
  database: pool,
  baseURL,
  emailAndPassword: { enabled: true },
  trustedOrigins: [baseURL, process.env.V0_RUNTIME_URL ? `https://${process.env.V0_RUNTIME_URL}` : undefined].filter(Boolean) as string[],
  ...(process.env.NODE_ENV === 'development' ? { advanced: { defaultCookieAttributes: { sameSite: 'none' as const, secure: true } } } : {}),
})
