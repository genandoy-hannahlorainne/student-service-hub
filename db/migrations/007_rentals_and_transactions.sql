-- Student rental posts and service transactions.
-- These tables intentionally start empty; the client must never display seeded demo records.

CREATE TYPE rental_post_type AS ENUM ('available', 'looking_for');
CREATE TYPE rental_post_status AS ENUM ('draft', 'pending', 'approved', 'rejected');

CREATE TABLE rental_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  post_type rental_post_type NOT NULL,
  category TEXT NOT NULL,
  location TEXT NOT NULL,
  rental_rate TEXT NOT NULL,
  availability TEXT NOT NULL,
  status rental_post_status NOT NULL DEFAULT 'pending',
  rejection_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE service_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  service_type TEXT NOT NULL,
  reference_code TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL,
  amount NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (amount >= 0),
  payment_method TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_rental_posts_status ON rental_posts(status);
CREATE INDEX idx_rental_posts_user_id ON rental_posts(user_id);
CREATE INDEX idx_service_transactions_user_id ON service_transactions(user_id);
