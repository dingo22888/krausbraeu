CREATE TABLE IF NOT EXISTS beer_blob_cleanup (
 url text PRIMARY KEY,
 beer_id integer NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now()
);
