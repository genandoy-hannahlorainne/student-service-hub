-- Draft partner catalog records. These are intentionally not provider
-- accounts until matching Netlify Identity users are created and approved.
CREATE TABLE service_provider_drafts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name   TEXT NOT NULL,
  service_type    TEXT NOT NULL CHECK (service_type IN ('printing', 'supplies')),
  contact_person  TEXT,
  business_address TEXT,
  contact_channel TEXT,
  notes           TEXT NOT NULL,
  status          TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'ready_to_link')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO service_provider_drafts (business_name, service_type, contact_person, business_address, contact_channel, notes)
VALUES
  ('Charie Ledesma Printing Services', 'printing', 'Charie Ledesma', 'PUP Taguig area', 'https://www.facebook.com/charie.ledesma', 'Draft only. Link to a Netlify Identity provider account after the shop owner registers.'),
  ('PUP Taguig Print Corner', 'printing', 'Draft contact', 'PUP Taguig campus area', NULL, 'Draft only. Provider Identity account still needs to be created.'),
  ('Campus Essentials Supply Shop', 'supplies', 'Draft contact', 'PUP Taguig campus area', NULL, 'Draft only. Provider Identity account still needs to be created.'),
  ('Taguig Student Supplies Hub', 'supplies', 'Draft contact', 'Western Bicutan, Taguig', NULL, 'Draft only. Provider Identity account still needs to be created.');

INSERT INTO supply_shops (business_name, location, gcash_number, transaction_fee, accredited, is_draft, status)
VALUES
  ('Campus Essentials Supply Shop', 'PUP Taguig campus area', '09170000001', 5.00, TRUE, TRUE, 'active'),
  ('Taguig Student Supplies Hub', 'Western Bicutan, Taguig', '09170000002', 7.50, TRUE, TRUE, 'active');

INSERT INTO supply_products (name, category, unit_price, stock_quantity, options, image_path)
VALUES
  ('Bond Paper', 'bond_paper', 1.50, 1000, '{"sizes":["Short","A4","Long"]}', 'school-supplies/bond-paper.jpg'),
  ('Index Card', 'index_card', 1.00, 1000, '{"colors":["White","Blue","Yellow","Pink"]}', 'school-supplies/index-card.jpg'),
  ('Yellow Pad', 'other', 25.00, 100, '{}', 'school-supplies/yellow-pad.jpg'),
  ('Plastic Envelope', 'other', 18.00, 100, '{}', 'school-supplies/plastic-envelope.jpg'),
  ('Pencil', 'other', 8.00, 200, '{}', 'school-supplies/pencil.jpg'),
  ('Folder', 'other', 12.00, 100, '{}', 'school-supplies/folder.jpg'),
  ('Brown Envelope', 'other', 10.00, 100, '{}', 'school-supplies/brown-envelope.jpg'),
  ('Blue Ballpen', 'other', 8.00, 200, '{}', 'school-supplies/ballpen.png');
