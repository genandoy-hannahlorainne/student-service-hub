-- ============================================================
-- PASOA Student Services Hub — Initial Schema
-- Migration: 001_initial
-- Run once against your Neon PostgreSQL database.
-- ============================================================

-- ─── Extensions ───────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "pgcrypto";    -- gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "citext";      -- case-insensitive email text

-- ─── Enums ───────────────────────────────────────────────────────────────────
CREATE TYPE account_status AS ENUM ('pending', 'active', 'suspended', 'rejected');
CREATE TYPE student_verification AS ENUM ('not_required', 'pending', 'verified', 'rejected');
CREATE TYPE user_role AS ENUM ('student', 'provider', 'guest', 'admin', 'co_admin');
CREATE TYPE provider_status AS ENUM ('pending_approval', 'active', 'suspended', 'rejected');

-- ─── user_profiles ────────────────────────────────────────────────────────────
-- One row per Netlify Identity user. `id` matches the Netlify Identity sub claim.
CREATE TABLE user_profiles (
  id                         UUID PRIMARY KEY,            -- matches Netlify Identity JWT sub
  display_name               TEXT NOT NULL,
  email                      CITEXT NOT NULL UNIQUE,
  phone                      TEXT,
  student_number             TEXT,                        -- PUPTians only
  account_status             account_status NOT NULL DEFAULT 'pending',
  student_verification_status student_verification NOT NULL DEFAULT 'not_required',
  created_at                 TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at                 TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── user_roles ───────────────────────────────────────────────────────────────
CREATE TABLE user_roles (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  role       user_role NOT NULL,
  granted_by UUID REFERENCES user_profiles(id),          -- NULL = self-registered
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- ─── providers ───────────────────────────────────────────────────────────────
CREATE TABLE providers (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL UNIQUE REFERENCES user_profiles(id) ON DELETE CASCADE,
  business_name    TEXT NOT NULL,
  contact_person   TEXT NOT NULL,
  business_address TEXT NOT NULL,
  service_type     TEXT NOT NULL,                        -- 'printing', 'supplies', 'both'
  status           provider_status NOT NULL DEFAULT 'pending_approval',
  approved_by      UUID REFERENCES user_profiles(id),
  approved_at      TIMESTAMPTZ,
  rejection_reason TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── audit_events ────────────────────────────────────────────────────────────
-- Append-only log for auth, approval, and administrative actions.
CREATE TABLE audit_events (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id    UUID REFERENCES user_profiles(id),
  action      TEXT NOT NULL,                             -- e.g. 'register', 'approve_provider'
  target_type TEXT,                                      -- e.g. 'user', 'provider'
  target_id   UUID,
  metadata    JSONB,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Indexes ─────────────────────────────────────────────────────────────────
CREATE INDEX idx_user_profiles_email        ON user_profiles(email);
CREATE INDEX idx_user_roles_user_id         ON user_roles(user_id);
CREATE INDEX idx_providers_user_id          ON providers(user_id);
CREATE INDEX idx_providers_status           ON providers(status);
CREATE INDEX idx_audit_events_actor_id      ON audit_events(actor_id);
CREATE INDEX idx_audit_events_action        ON audit_events(action);

-- ─── updated_at trigger ──────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_providers_updated_at
  BEFORE UPDATE ON providers
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
