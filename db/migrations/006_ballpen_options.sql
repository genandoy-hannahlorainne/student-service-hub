-- Add color choices to an existing seeded ballpen row.
UPDATE supply_products
SET options = '{"colors":["Blue","Black","Red"]}'::jsonb
WHERE lower(name) LIKE '%ballpen%';
