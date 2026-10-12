DO $migration$
BEGIN
 IF NOT EXISTS(SELECT 1 FROM beer_schema_migrations WHERE version=6) THEN
  UPDATE beer_entries SET
   images=jsonb_build_array(
    jsonb_build_object('id','gurgelrutscher-label-v2','url','/artworks/gurgelrutscher-label-v2.webp','caption','Gurgelrutscher · Obergäriges Helles – Etikett'),
    jsonb_build_object('id','gurgelrutscher-raw-v2','url','/artworks/gurgelrutscher-raw-v2.webp','caption','Gurgelrutscher · Goldener Strom – Artwork')
   ) || COALESCE((SELECT jsonb_agg(item ORDER BY position) FROM jsonb_array_elements(COALESCE(images,'[]'::jsonb)) WITH ORDINALITY AS existing(item,position) WHERE item->>'url' NOT IN ('/gurgelrutscher.webp','/artworks/gurgelrutscher-label-v2.webp','/artworks/gurgelrutscher-raw-v2.webp')),'[]'::jsonb),
   image_url='/artworks/gurgelrutscher-label-v2.webp',updated_at=now()
  WHERE source_id=37 AND brew->>'number'='31' AND lower(btrim(brew->>'name'))='gurgelrutscher';
  INSERT INTO beer_schema_migrations(version) VALUES(6);
 END IF;
END $migration$;
