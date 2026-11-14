-- Seed a real provider profile for local/staging testing.
-- The password must be created in Netlify Identity; it is never stored in Neon.
-- Run this after 001_initial.sql and replace the email if needed.

-- If the previous test provider seed was already run, convert it to the
-- correct nearby provider instead of leaving a stale demo account.
UPDATE user_profiles
SET display_name = 'Charie Ledesma Printing Services',
    email = 'hann000345@gmail.com',
    phone = '09170000000',
    account_status = 'active'::account_status,
    updated_at = now()
WHERE email IN ('speedyprint@puptaguig.edu.ph', 'charie.ledesma@puptaguig.edu.ph')
  AND NOT EXISTS (
    SELECT 1 FROM user_profiles WHERE email = 'hann000345@gmail.com'
  );

INSERT INTO user_profiles (
  id,
  display_name,
  email,
  phone,
  account_status,
  student_verification_status
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  'Charie Ledesma Printing Services',
  'hann000345@gmail.com',
  '09170000000',
  'active'::account_status,
  'not_required'::student_verification
) 
ON CONFLICT (email) DO UPDATE
SET display_name = EXCLUDED.display_name,
    phone = EXCLUDED.phone,
    account_status = 'active'::account_status,
    updated_at = now();

INSERT INTO user_roles (user_id, role)
SELECT id, 'provider'::user_role
FROM user_profiles
WHERE email = 'hann000345@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

INSERT INTO providers (
  user_id,
  business_name,
  contact_person,
  business_address,
  service_type,
  status,
  approved_at
)
SELECT
  id,
  'Charie Ledesma Printing Services',
  'Charie Ledesma',
  'PUP Taguig area',
  'printing',
  'active'::provider_status,
  now()
FROM user_profiles
WHERE email = 'hann000345@gmail.com'
ON CONFLICT (user_id) DO UPDATE
SET business_name = EXCLUDED.business_name,
    contact_person = EXCLUDED.contact_person,
    business_address = EXCLUDED.business_address,
    service_type = EXCLUDED.service_type,
    status = 'active'::provider_status,
    approved_at = COALESCE(providers.approved_at, EXCLUDED.approved_at),
    updated_at = now();
