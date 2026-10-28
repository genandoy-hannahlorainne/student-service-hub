-- ============================================================
-- UniServe Student Services Hub — Seed Admin Account
-- Migration: 002_seed_admin
--
-- BEFORE running this migration:
--   1. Create the admin account in Netlify Identity:
--        Email   : admin@uniserve.edu.ph
--        Password: Admin@123456
--   2. Copy the user's UUID from:
--        Netlify dashboard → Identity → Users → click the user → copy "ID"
--   3. Replace EVERY occurrence of the placeholder UUID below:
--        00000000-0000-0000-0000-000000000001
--      with the real Netlify Identity UUID before running.
--
-- Run once against your Neon PostgreSQL database after 001_initial.sql.
-- ============================================================

-- ─── Admin user profile ──────────────────────────────────────────────────────
-- Replace the UUID below with the real Netlify Identity sub for admin@uniserve.edu.ph
INSERT INTO user_profiles (
  id,
  display_name,
  email,
  phone,
  student_number,
  account_status,
  student_verification_status,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000001',   -- REPLACE with real Netlify Identity UUID
  'UniServe Administrator',
  'admin@uniserve.edu.ph',
  NULL,
  NULL,
  'active',
  'not_required',
  now(),
  now()
)
ON CONFLICT (email) DO UPDATE
  SET display_name   = EXCLUDED.display_name,
      account_status = EXCLUDED.account_status,
      updated_at     = now();

-- ─── Admin role grant ─────────────────────────────────────────────────────────
-- Grants the 'admin' role to the profile inserted above.
-- granted_by is NULL because this is the seed account (no granting actor exists yet).
INSERT INTO user_roles (
  user_id,
  role,
  granted_by,
  created_at
) VALUES (
  '00000000-0000-0000-0000-000000000001',   -- REPLACE with real Netlify Identity UUID
  'admin',
  NULL,
  now()
)
ON CONFLICT (user_id, role) DO NOTHING;

-- ─── Audit trail ─────────────────────────────────────────────────────────────
INSERT INTO audit_events (
  actor_id,
  action,
  target_type,
  target_id,
  metadata,
  created_at
) VALUES (
  NULL,                                     -- system-seeded, no human actor
  'seed_admin_account',
  'user',
  '00000000-0000-0000-0000-000000000001',   -- REPLACE with real Netlify Identity UUID
  '{"note": "Initial admin seed via 002_seed_admin.sql", "email": "admin@uniserve.edu.ph"}',
  now()
);
