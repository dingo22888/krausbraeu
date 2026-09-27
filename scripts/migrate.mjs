import { neon } from '@neondatabase/serverless';
import { readFile } from 'node:fs/promises';
const url=process.env.NEON_BEER_DATABASE_URL||process.env.NEON_BEER_POSTGRES_URL;
if(!url){if(process.env.VERCEL)throw new Error('NEON_BEER_DATABASE_URL fehlt. Neon mit dieser Deployment-Umgebung verbinden.'); console.log('Lokaler Build ohne Datenbank: Migration übersprungen.');process.exit(0);}
const sql=neon(url);
const migration=await readFile(new URL('../migrations/001_initial.sql',import.meta.url),'utf8');
const statements=migration.split(';').map(x=>x.trim()).filter(Boolean);
await sql.transaction([sql`SELECT pg_advisory_xact_lock(312026)`,sql`CREATE TABLE IF NOT EXISTS beer_schema_migrations (version integer PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())`,...statements.map(s=>sql.query(s)),sql`INSERT INTO beer_schema_migrations(version) VALUES(1) ON CONFLICT DO NOTHING`]);
const exclusionMigration=await readFile(new URL('../migrations/002_import_exclusions.sql',import.meta.url),'utf8');
await sql.transaction([sql`SELECT pg_advisory_xact_lock(312026)`,...exclusionMigration.split(';').map(s=>s.trim()).filter(Boolean).map(s=>sql.query(s)),sql`INSERT INTO beer_schema_migrations(version) VALUES(2) ON CONFLICT DO NOTHING`]);
const seed=JSON.parse(await readFile(new URL('../lib/initial-brew.json',import.meta.url),'utf8'));
await sql`INSERT INTO beer_entries(source_id,brew,public_number,published,display_name,description,image_url) SELECT ${seed.sourceId},${JSON.stringify(seed)}::jsonb,31,true,'Gurgelrutscher','Ein obergäriges Helles aus der KrausBräu-Küche. Pale-Ale-Malz, Weizenmalz, Carapils und ein kleiner Anteil Haferflocken treffen auf Hallertauer Magnum und Nottingham-Hefe.','/gurgelrutscher.webp' WHERE NOT EXISTS (SELECT 1 FROM beer_import_exclusions WHERE source_id=${seed.sourceId}) ON CONFLICT(source_id) DO NOTHING`;
console.log('KrausBräu-Datenbank bereit. Bestehende Inhalte wurden beibehalten.');
// One-time editorial enrichment. Never publish or recreate records here.
// User-authored fields and existing artwork take precedence.
const editorial=JSON.parse(await readFile(new URL('../content/beer-editorial.json',import.meta.url),'utf8'));
await sql.transaction([
 sql`SELECT pg_advisory_xact_lock(312026)`,
 ...editorial.map(item=>sql`UPDATE beer_entries SET
  description=CASE WHEN btrim(description)='' THEN ${item.description} ELSE description END,
  accent=CASE WHEN accent='#e9b44c' THEN ${item.accent} ELSE accent END,
  image_url=CASE WHEN image_url='' THEN ${item.artwork?`/artworks/${item.artwork}.webp`:''} ELSE image_url END,
  updated_at=now()
  WHERE source_id=${item.sourceId} AND NOT EXISTS (SELECT 1 FROM beer_schema_migrations WHERE version=3)`),
 sql`INSERT INTO beer_schema_migrations(version) VALUES(3) ON CONFLICT DO NOTHING`
]);
console.log('Redaktionelle Ergänzungen geprüft. Veröffentlichungsstatus unverändert.');
