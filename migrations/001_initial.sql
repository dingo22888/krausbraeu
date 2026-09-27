CREATE TABLE IF NOT EXISTS beer_entries (
 id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
 source_id integer NOT NULL UNIQUE,
 brew jsonb NOT NULL,
 public_number integer UNIQUE CHECK (public_number > 0),
 published boolean NOT NULL DEFAULT false,
 display_name text NOT NULL DEFAULT '',
 description text NOT NULL DEFAULT '',
 tasting_notes text NOT NULL DEFAULT '',
 accent text NOT NULL DEFAULT '#e9b44c',
 image_url text NOT NULL DEFAULT '',
 updated_at timestamptz NOT NULL DEFAULT now(),
 CHECK (NOT published OR public_number IS NOT NULL)
);
CREATE TABLE IF NOT EXISTS beer_import_batches (
 id uuid PRIMARY KEY,
 payload jsonb NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now()
);
-- No browser access: database credentials are exclusively server-side.
REVOKE ALL ON beer_entries, beer_import_batches FROM PUBLIC;
