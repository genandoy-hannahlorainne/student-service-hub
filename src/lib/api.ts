/**
 * api.ts — Typed fetch helpers for Netlify Functions.
 *
 * Security decisions:
 *  - Every request that touches protected data includes the GoTrue JWT
 *    in the Authorization header. The Functions verify this server-side.
 *  - Passwords are NEVER sent to our own Functions — GoTrue owns them.
 *  - A single apiFetch() helper normalises error handling so callers always
 *    get a typed Error with the server's message, not raw HTTP status codes.
 */

import { getToken } from "./identity";

const BASE = "/.netlify/functions";

// ─── Core fetch ───────────────────────────────────────────────────────────────

async function authHeaders(): Promise<HeadersInit> {
  const token = await getToken();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const headers = await authHeaders();
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: { ...headers, ...(options?.headers ?? {}) },
  });

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = (await res.json()) as { error?: string };
      if (body.error) message = body.error;
    } catch { /* non-JSON body — keep the default message */ }
    throw new Error(message);
  }

  return res.json() as Promise<T>;
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface UserProfile {
  id: string;
  display_name: string;
  email: string;
  phone: string | null;
  student_number: string | null;
  account_status: "pending" | "active" | "suspended" | "rejected";
  student_verification_status: string;
  created_at: string;
  roles: UserRole[];
}

export type UserRole = "student" | "provider" | "guest" | "admin" | "co_admin";

export interface ProviderRecord {
  id: string;
  business_name: string;
  contact_person: string;
  business_address: string;
  service_type: string;
  status: "pending_approval" | "active" | "suspended" | "rejected";
  approved_at: string | null;
  rejection_reason: string | null;
}

export interface MeResponse {
  profile: UserProfile;
  provider: ProviderRecord | null;
}

// ─── Endpoints ────────────────────────────────────────────────────────────────

/** Fetch the current user's profile + provider record. */
export async function fetchMe(): Promise<MeResponse> {
  return apiFetch<MeResponse>("/me");
}

/**
 * Register payload — passwords are intentionally absent.
 * GoTrue owns the credential; we only store the profile metadata.
 */
export interface RegisterPayload {
  role: "student" | "provider" | "guest";
  display_name: string;
  student_number?: string;
  phone?: string;
  // Provider-only
  business_name?: string;
  contact_person?: string;
  business_address?: string;
  service_type?: string;
  // Guest-only
  affiliation?: string;
}

export interface RegisterResponse {
  user_id: string;
  email: string;
  role: string;
  account_status: string;
  message: string;
}

/** Create the extended profile in our DB after Identity account is confirmed. */
export async function registerProfile(payload: RegisterPayload): Promise<RegisterResponse> {
  return apiFetch<RegisterResponse>("/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export interface ApproveProviderPayload {
  provider_id: string;
  action: "approve" | "reject";
  reason?: string;
}

export async function approveProvider(
  payload: ApproveProviderPayload
): Promise<{ provider_id: string; action: string; message: string }> {
  return apiFetch("/approve-provider", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
