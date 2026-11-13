-- School supplies catalog and accredited shop data.
CREATE TYPE supply_shop_status AS ENUM ('active', 'suspended');
CREATE TYPE supply_product_status AS ENUM ('active', 'inactive');

CREATE TABLE supply_shops (
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

CREATE TABLE supply_products (
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

CREATE INDEX idx_supply_shops_public ON supply_shops (status, accredited);
CREATE INDEX idx_supply_products_public ON supply_products (status, category);
