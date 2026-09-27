CREATE TABLE IF NOT EXISTS beer_import_exclusions (
 source_id integer PRIMARY KEY,
 created_at timestamptz NOT NULL DEFAULT now()
);
REVOKE ALL ON beer_import_exclusions FROM PUBLIC;
