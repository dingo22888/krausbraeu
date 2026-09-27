import { DatabaseSync } from 'node:sqlite';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import type { Brew } from './types.ts';
type Row=Record<string,unknown>;
const num=(value: unknown): number|null=>typeof value==='number' && Number.isFinite(value)?value:null;
const str=(value:unknown)=>typeof value==='string'?value.slice(0,500):'';
export async function parseSqlite(buffer: Buffer): Promise<Brew[]> {
 if(buffer.length>3*1024*1024 || buffer.subarray(0,16).toString()!=='SQLite format 3\0') throw new Error('Bitte eine gültige SQLite-Datei bis 3 MB auswählen.');
 const dir=await mkdtemp(join(tmpdir(),'krausbraeu-')); let db: DatabaseSync|undefined;
 try { const file=join(dir,'input.sqlite'); await writeFile(file,buffer,{mode:0o600}); db=new DatabaseSync(file,{readOnly:true,allowExtension:false}); db.exec('PRAGMA trusted_schema=OFF; PRAGMA query_only=ON;');
 const required=['Sud','Malzschuettung','Hopfengaben','Hefegaben','Hauptgaerverlauf']; const tables=db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all().map(r=>r.name); if(!required.every(t=>tables.includes(t))) throw new Error('Diese Datei hat nicht die erwartete Brauhelfer-Struktur.');
 const suds=db.prepare('SELECT * FROM Sud LIMIT 1001').all() as Row[]; if(suds.length>1000) throw new Error('Maximal 1000 Sude pro Import.');
 const malts=db.prepare('SELECT Name, erg_Menge, Prozent FROM Malzschuettung WHERE SudID=? LIMIT 200'); const hops=db.prepare('SELECT Name, erg_Menge FROM Hopfengaben WHERE SudID=? LIMIT 200'); const yeast=db.prepare('SELECT Name FROM Hefegaben WHERE SudID=? LIMIT 100'); const fermentation=db.prepare('SELECT Zeitstempel, Restextrakt, Temp FROM Hauptgaerverlauf WHERE SudID=? ORDER BY Zeitstempel LIMIT 500');
 return suds.map(s=> { const id=num(s.ID); if(id===null || !Number.isSafeInteger(id) || id<=0) throw new Error('Ungültige Sud-ID.'); const bottledDate=str(s.Abfuelldatum)||null; return {sourceId:id,number:num(s.Sudnummer)||0,name:str(s.Sudname),style:str(s.Kategorie),date:str(s.Braudatum)||null,bottledDate,status:num(s.Status)||0,originalGravity:num(s.SWAnstellen),plannedGravity:num(s.SW),ibu:num(s.IBU),ebc:num(s.erg_Farbe),volume:num(s.Menge),abv:bottledDate?num(s.erg_Alkohol):null,malts:malts.all(id).map(m=>({name:str(m.Name),amount:num(m.erg_Menge)||0,share:num(m.Prozent)||0})),hops:hops.all(id).map(h=>({name:str(h.Name),amount:num(h.erg_Menge)||0})),yeast:yeast.all(id).map(y=>str(y.Name)),fermentation:fermentation.all(id).map(f=>({date:str(f.Zeitstempel),extract:num(f.Restextrakt)||0,temperature:num(f.Temp)||0}))}; });
 } finally { db?.close(); await rm(dir,{recursive:true,force:true}); }
}
