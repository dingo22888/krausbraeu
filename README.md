# KrausBräu

Mobile Bieretiketten mit Next.js, Neon und SQLite-Import aus dem Kleinen Brauhelfer.

## Betrieb

- Node.js 24, `npm ci`, `npm run dev`.
- `npm run build` führt additive Datenbankmigrationen aus und baut die Website. In Vercel muss die Neon-Variable `NEON_BEER_DATABASE_URL` (alternativ `NEON_BEER_POSTGRES_URL`) für die betreffende Umgebung verfügbar sein.
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

Nutzerlogo: Element 1.png, bereits mit „Gebraut in Struthütten“. Initiales Biermotiv: KI-generierte Illustration, keine Aufnahme des tatsächlichen Bieres. Der Gurgelrutscher basiert auf dem Rezept von horstibus (Maische, Malz und mehr, 05.02.2013); Beschreibung und Braudaten sind für diesen Sud aufbereitet.

## Importauswahl und Löschen

Die Importvorschau bietet eine Checkbox pro Sud sowie Alle auswählen/abwählen. Nicht gebraute Entwürfe werden standardmäßig nicht ausgewählt. Abgewählte interne Sud-IDs werden dauerhaft in beer_import_exclusions gespeichert und können später wieder ausgewählt werden. Abwählen löscht bestehende Sude nicht.

Im Etikett-Editor kann ein Sud nach Eingabe von LÖSCHEN endgültig aus der Website entfernt werden. Er bleibt bei Folgeimports abgewählt. Die originale SQLite und hochgeladene Bilddateien werden nicht gelöscht.

## Mehrfach-Veröffentlichung & Cover-Serie

In `/admin` Sude auswählen (alle, nur private oder einzeln) und gemeinsam veröffentlichen bzw. auf privat setzen. Die Aktion prüft Adminrechte und führt eine atomare Datenbankänderung aus. Neue öffentliche Nummern stammen aus der Sudnummer; bestehende bleiben unverändert. Fehlende oder doppelte Nummern verhindern die gesamte Veröffentlichung.

`content/beer-editorial.json` enthält 31 redaktionelle Kurztexte, Farben und die Zuordnung der Cover-Serie. Die einmalige Datenmigration (Version 3 in `scripts/migrate.mjs`) ergänzt ausschließlich bestehende Sude, lässt Veröffentlichungen unverändert und bewahrt vorhandene Texte/Bilder sowie vom Standard abweichende Farben. Kevin ist nicht enthalten. Keine Verkostungsnotizen werden erfunden. Die zwölf neuen Cover werden von zusammengehörigen Rezepten gemeinsam genutzt; Gurgelrutscher behält sein bestehendes Motiv. Bildgenerierung mit dem eingebauten ImageGen; Motive unter `content/artwork-prompts.json`, optimierte WebP-Dateien unter `public/artworks/`.

Die Akzentfarbe der dargestellten Bierseite gilt serverseitig auch für Header, Footer, Fokus- und Hoverzustände. Das Schwarz-Weiß-Logo bleibt unverändert.

Die Sudnavigation unter den Kopfdaten verlinkt ausschließlich veröffentlichte Nachbarn nach öffentlicher Sudnummer, auch bei Lücken. Die SVG-Bierfarbe nutzt eine kontinuierlich interpolierte illustrative EBC-Palette (keine kalibrierte Farbmessung). Unbekannte Werte zeigen einen ungefüllten Krug. Akzentfarbe und Bierfarbe sind unabhängig.

## Vorgerenderte Seiten

Startseite und alle beim Build veröffentlichten Sudseiten werden auf Vercel vorgerendert (ISR ohne Zeitablauf). Neue öffentliche Nummern werden beim ersten Aufruf erzeugt und ebenfalls gecacht. Speichern, Import, Löschen und Mehrfach-Veröffentlichung invalidieren nach erfolgreicher Datenbankänderung die Übersicht, die betroffenen Sudnummern und ihre veröffentlichten Nachbarn. Die nächste Anfrage erzeugt die aktualisierte Seite; weitere Aufrufe nutzen wieder den Cache. Adminseiten bleiben dynamisch und authentifiziert.

Direkte SQL-Änderungen außerhalb dieser Adminaktionen lösen keine Revalidierung aus; danach ist ein neuer Build nötig. Lokale Builds ohne Neon-Verbindung überspringen die Sud-Vorberechnung und rendern die Startseite erst zur Laufzeit; auf Vercel ist die Datenbank beim Build verpflichtend.

## Etiketten-Mockups und Galerie

Die Detailseite zeigt Artwork, Flasche und Kiste in einer Scroll-Snap-Galerie. Der Server rendert das erste Artwork sowie die Szenen ohne zusätzliche Datenbankabfragen vor. Nach der Hydrierung kommen Pfeile, Punkte und Tastaturbedienung hinzu. Kein Autoplay; reduzierte Bewegung wird berücksichtigt. Die bestehende ISR-Revalidierung umfasst die Galerie automatisch.

`BeerMoodScene` nimmt `{ beer: { name, number, artwork, accent }, type: 'bottle' | 'crate' }` entgegen und zeichnet ein SVG-Mockup. `BeerMood` ist die serverseitige Variante mit `sudId` (= interne `beer_entries.id`, nicht `source_id` oder öffentliche Sudnummer) und `type`; sie lädt ausschließlich veröffentlichte Einträge. Private Vorschauen nutzen die bereits authentifiziert geladenen Daten über `BeerLabel`.

Die Szenen sind stilisierte Etikettenentwürfe, keine Fotos tatsächlich produzierter Flaschen oder Kisten. Neue Motive und Farben werden automatisch übernommen; für weitere Mood-Typen kann der Renderer erweitert werden.
