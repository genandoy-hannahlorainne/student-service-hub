/**
 * api.ts — Typed fetch helpers for Netlify Functions.
 *
 * All requests automatically include the current user's JWT in the
 * Authorization header if one is available.
 */

import { getToken } from "./identity";

const BASE = "/.netlify/functions";

async function authHeaders(): Promise<HeadersInit> {
  const token = await getToken();
  return token
    ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
    : { "Content-Type": "application/json" };
}

async function apiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const headers = await authHeaders();
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      ...headers,
      ...(options?.headers ?? {}),
    },
  });

  if (!res.ok) {
    let message = `API error ${res.status}`;
    try {
      const body = await res.json() as { error?: string };
      if (body.error) message = body.error;
    } catch { /* ignore parse errors */ }
    throw new Error(message);
  }

  return res.json() as Promise<T>;
}

// ─── Typed API calls ─────────────────────────────────────────────────────────

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

export async function fetchMe(): Promise<MeResponse> {
  return apiFetch<MeResponse>("/me");
}

export interface RegisterPayload {
  role: "student" | "provider" | "guest";
  display_name?: string;
  student_number?: string;
  phone?: string;
  business_name?: string;
  contact_person?: string;
  business_address?: string;
  service_type?: string;
  affiliation?: string;
}

export interface RegisterResponse {
  user_id: string;
  email: string;
  role: string;
  account_status: string;
  message: string;
}

export async function registerProfile(
  payload: RegisterPayload
): Promise<RegisterResponse> {
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
