# KrausBräu

Mobile Bieretiketten mit Next.js, Neon und SQLite-Import aus dem Kleinen Brauhelfer.

## Betrieb

- Node.js 24, `npm ci`, `npm run dev`.
- `npm run build` führt additive Datenbankmigrationen aus und baut die Website. In Vercel muss die Neon-Variable `DATABASE_URL` (alternativ `POSTGRES_URL`) für die betreffende Umgebung verfügbar sein.
- Die erste Migration legt die KrausBräu-Tabellen an; der Initialimport veröffentlicht ausschließlich Sud 31. Weitere Sude kommen über den geschützten Admin-Import.
- `npm test` prüft den SQLite-Parser. `npm run typecheck` prüft TypeScript.
- Für eine lokale Designvorschau ohne Datenbank: `LOCAL_PREVIEW=1 npm run dev`. Diese Option ist in Vercel und Produktionsbuilds deaktiviert.

## GitHub-Anmeldung einrichten

GitHub → Settings → Developer settings → OAuth Apps → New OAuth App:

- Application name: KrausBräu
- Homepage URL: https://beer.krausonline.de
- Authorization callback URL: https://beer.krausonline.de/api/auth/callback

In Vercel als serverseitige Umgebungsvariablen setzen:

- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`
- `AUTH_SECRET` (zufällig, mindestens 32 Zeichen; z. B. `openssl rand -hex 32`)
- `APP_URL=https://beer.krausonline.de`

Danach neu deployen. Ausschließlich GitHub-Nutzer-ID 5803616 (dingo22888) erhält Zugriff. Ohne Konfiguration bleibt der Adminbereich gesperrt. OAuth-Tokens werden nicht gespeichert. Sitzungen laufen nach acht Stunden ab.

## Bild-Uploads

Optional einen **öffentlichen** Vercel-Blob-Store mit dem Projekt verbinden (`BLOB_READ_WRITE_TOKEN`). Danach können im Adminbereich PNG/JPEG/WebP bis 3 MB hochgeladen werden. Der vorhandene Gurgelrutscher-Titel und das Nutzerlogo liegen als lokale Assets vor. Die Blob-Berechtigung wird ausschließlich nach Admin-Authentifizierung verwendet.

## Import und Datenmodell

Eine konsistente Kopie der SQLite hochladen (Brauhelfer vorher schließen oder dessen Backup verwenden). Maximal 3 MB und 1000 Sude. Vorschau vor Bestätigung; Vorschau läuft nach 24 Stunden ab. Abgelaufene Vorschauen werden beim nächsten Upload gelöscht. Der Server öffnet die SQLite read-only und entfernt die temporäre Datei anschließend.

Identität: `source_id` = interne Brauhelfer-Sud-ID. Sudnummern sind in Quelldateien nicht zwingend eindeutig. Eine öffentliche Nummer wird redaktionell vergeben, ist eindeutig und bleibt danach stabil. Der Import löscht keine bestehenden Sude. Bei Wechsel zu einer anderen Brauhelfer-Datenbank muss die ID-Zuordnung vorher geprüft werden.

Importiert werden nur ausgewählte Braudaten; keine privaten Kommentare, Preise oder Dateipfade. Der berechnete Alkoholgehalt wird erst bei vorhandenem Abfülldatum veröffentlicht. Geschmackstexte werden manuell gepflegt. Rezeptwerte (IBU, Farbe) sind entsprechend gekennzeichnet.

Schemaänderungen durch Migrationen, Datenänderungen durch Adminaktionen. Die Datenbank wird ausschließlich serverseitig angesprochen. Supabase/krs-game ist nicht beteiligt.

## Gestaltung und Herkunft

Nutzerlogo: Element 1.svg, bereits mit „Gebraut in Struthütten“. Initiales Biermotiv: KI-generierte Illustration, keine Aufnahme des tatsächlichen Bieres. Der Gurgelrutscher basiert auf dem Rezept von horstibus (Maische, Malz und mehr, 05.02.2013); Beschreibung und Braudaten sind für diesen Sud aufbereitet.
