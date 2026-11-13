-- Idempotent repair migration for deployments where migration 003 was
-- copied but not applied, or stopped because the enum types already existed.
DO $$
BEGIN
  CREATE TYPE supply_shop_status AS ENUM ('active', 'suspended');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE TYPE supply_product_status AS ENUM ('active', 'inactive');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS supply_shops (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name   TEXT NOT NULL,
  location        TEXT NOT NULL,
  gcash_number    TEXT,
  transaction_fee NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (transaction_fee >= 0),
  accredited      BOOLEAN NOT NULL DEFAULT FALSE,
  is_draft        BOOLEAN NOT NULL DEFAULT FALSE,
  status          supply_shop_status NOT NULL DEFAULT 'active',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE supply_shops
  ADD COLUMN IF NOT EXISTS is_draft BOOLEAN NOT NULL DEFAULT FALSE;

CREATE TABLE IF NOT EXISTS supply_products (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  category        TEXT NOT NULL CHECK (category IN ('bond_paper', 'index_card', 'other')),
  unit_price      NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0),
  stock_quantity  INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  options         JSONB NOT NULL DEFAULT '{}'::jsonb,
  image_path      TEXT,
  status          supply_product_status NOT NULL DEFAULT 'active',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE supply_products
  ADD COLUMN IF NOT EXISTS image_path TEXT;

CREATE INDEX IF NOT EXISTS idx_supply_shops_public
  ON supply_shops (status, accredited);
CREATE INDEX IF NOT EXISTS idx_supply_products_public
  ON supply_products (status, category);

INSERT INTO supply_shops (business_name, location, gcash_number, transaction_fee, accredited, is_draft, status)
SELECT *
FROM (VALUES
  ('Campus Essentials Supply Shop', 'PUP Taguig campus area', '09170000001', 5.00, TRUE, TRUE, 'active'::supply_shop_status),
  ('Taguig Student Supplies Hub', 'Western Bicutan, Taguig', '09170000002', 7.50, TRUE, TRUE, 'active'::supply_shop_status)
) AS draft(business_name, location, gcash_number, transaction_fee, accredited, is_draft, status)
WHERE NOT EXISTS (SELECT 1 FROM supply_shops);

INSERT INTO supply_products (name, category, unit_price, stock_quantity, options, image_path)
SELECT *
FROM (VALUES
  ('Bond Paper', 'bond_paper', 1.50, 1000, '{"sizes":["Short","A4","Long"]}'::jsonb, 'school-supplies/bond-paper.jpg'),
  ('Index Card', 'index_card', 1.00, 1000, '{"colors":["White","Blue","Yellow","Pink"]}'::jsonb, 'school-supplies/index-card.jpg'),
  ('Yellow Pad', 'other', 25.00, 100, '{}'::jsonb, 'school-supplies/yellow-pad.jpg'),
  ('Plastic Envelope', 'other', 18.00, 100, '{}'::jsonb, 'school-supplies/plastic-envelope.jpg'),
  ('Pencil', 'other', 8.00, 200, '{}'::jsonb, 'school-supplies/pencil.jpg'),
  ('Folder', 'other', 12.00, 100, '{}'::jsonb, 'school-supplies/folder.jpg'),
  ('Brown Envelope', 'other', 10.00, 100, '{}'::jsonb, 'school-supplies/brown-envelope.jpg'),
  ('Blue Ballpen', 'other', 8.00, 200, '{"colors":["Blue","Black","Red"]}'::jsonb, 'school-supplies/ballpen.png')
) AS draft(name, category, unit_price, stock_quantity, options, image_path)
WHERE NOT EXISTS (SELECT 1 FROM supply_products);
