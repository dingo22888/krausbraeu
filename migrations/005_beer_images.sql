DO $migration$
BEGIN
 ALTER TABLE beer_entries ADD COLUMN IF NOT EXISTS images jsonb;
 IF NOT EXISTS(SELECT 1 FROM beer_schema_migrations WHERE version=5) THEN
  UPDATE beer_entries SET images=CASE WHEN image_url='' THEN '[]'::jsonb ELSE jsonb_build_array(jsonb_build_object('id','original','url',image_url,'caption','')) END WHERE images IS NULL;
  UPDATE beer_entries SET images=images || jsonb_build_array(jsonb_build_object('id','emberhead-label','url','/artworks/emberhead-label.webp','caption','EMBERHEAD · Etikettentwurf – Smoked Dark Ale')),updated_at=now()
  WHERE brew->>'number'='32' AND (upper(btrim(brew->>'name'))='EMBERHEAD' OR upper(btrim(display_name))='EMBERHEAD');
  INSERT INTO beer_schema_migrations(version) VALUES(5);
 END IF;
END $migration$;
