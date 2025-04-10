-- Custom SQL migration file, put your code below! --
INSERT OR IGNORE INTO meal_types (name) VALUES
  ('breakfast'),
  ('lunch'),
  ('dinner'),
  ('snack'),
  ('dessert');
