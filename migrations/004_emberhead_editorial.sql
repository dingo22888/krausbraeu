-- One-time, user-requested editorial content for the existing EMBERHEAD entry.
-- Match both recipe number and name; do not import, publish or renumber anything.
DO $migration$
DECLARE target_id integer;
BEGIN
 IF NOT EXISTS (SELECT 1 FROM beer_schema_migrations WHERE version=4) THEN
  IF (SELECT count(*) FROM beer_entries WHERE brew->>'number'='32'
      AND (upper(btrim(brew->>'name'))='EMBERHEAD' OR upper(btrim(display_name))='EMBERHEAD')) <> 1 THEN
   RAISE EXCEPTION 'Expected exactly one imported EMBERHEAD recipe with sud number 32';
  END IF;
  SELECT id INTO target_id FROM beer_entries WHERE brew->>'number'='32'
   AND (upper(btrim(brew->>'name'))='EMBERHEAD' OR upper(btrim(display_name))='EMBERHEAD');
  UPDATE beer_entries SET
   description='EMBERHEAD ist als dunkles, kerniges Rauch-Ale mit Brown-Ale-Charakter geplant. Buchenrauch soll sich mit Brotkruste, dunklem Karamell und feinen Schokoladen- und Röstnoten verbinden. Ein trockener, klar bitterer Abgang soll die kräftige Malzbasis ausbalancieren – dunkel und robust, mit Lust auf den nächsten Schluck.',
   accent='#E58A45',
   image_url='/artworks/emberhead.webp',
   updated_at=now()
  WHERE id=target_id;
  INSERT INTO beer_schema_migrations(version) VALUES(4);
 END IF;
END $migration$;
