-- Persist the provider-side details of submitted service orders.
ALTER TABLE service_transactions
  ADD COLUMN IF NOT EXISTS provider_id UUID REFERENCES providers(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS metadata JSONB NOT NULL DEFAULT '{}'::jsonb;

CREATE INDEX IF NOT EXISTS idx_service_transactions_provider_id
  ON service_transactions(provider_id);
