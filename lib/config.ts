const normalizeUrl = (value?: string) => (value ? value.replace(/\/+$/, "") : "")

const envApi = normalizeUrl(process.env.NEXT_PUBLIC_API_URL)
const envBase = normalizeUrl(process.env.NEXT_PUBLIC_BASE_URL)
const defaultApiBase = "https://workingspacebackend-1.onrender.com/api"

export const API_BASE_URL = envApi || (envBase ? `${envBase}/api` : defaultApiBase)

const SESSION_TIMEOUT_MINUTES = Number(process.env.NEXT_PUBLIC_SESSION_TIMEOUT_MINUTES || 30)

export const SESSION_TIMEOUT_MS = SESSION_TIMEOUT_MINUTES * 60 * 1000

export const SESSION_HEARTBEAT_MS = Number(
  process.env.NEXT_PUBLIC_SESSION_HEARTBEAT_MS || 60_000,
)

