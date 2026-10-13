import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { parseSqlite } from '../lib/import-sqlite.ts';
test('Importer separates source IDs and duplicate sud numbers; hides unfinished ABV and private comments',async()=>{const dir=await mkdtemp(join(tmpdir(),'beer-test-'));try{const path=join(dir,'fixture.sqlite');const db=new DatabaseSync(path);db.exec(`CREATE TABLE Sud(ID INTEGER,Sudnummer INTEGER,Sudname TEXT,Status INTEGER,Braudatum TEXT,Abfuelldatum TEXT,erg_Alkohol REAL,Kommentar TEXT);CREATE TABLE Malzschuettung(SudID INTEGER,Name TEXT,erg_Menge REAL,Prozent REAL);CREATE TABLE Hopfengaben(SudID INTEGER,Name TEXT,erg_Menge REAL);CREATE TABLE Hefegaben(SudID INTEGER,Name TEXT);CREATE TABLE Hauptgaerverlauf(SudID INTEGER,Zeitstempel TEXT,Restextrakt REAL,Temp REAL);INSERT INTO Sud VALUES(37,31,'Gurgelrutscher',1,'2026-09-26',NULL,0.45,'PRIVATE NOTE');INSERT INTO Sud VALUES(38,31,'Entwurf',0,NULL,NULL,5,'PRIVATE NOTE');INSERT INTO Sud VALUES(39,32,'Fertig',2,'2026-08-01','2026-08-15',5.2,'PRIVATE NOTE');INSERT INTO Malzschuettung VALUES(37,'Pale Ale',4,100);`);db.close();const result=await parseSqlite(await readFile(path));assert.equal(result.length,3);assert.equal(result[0].sourceId,37);assert.equal(result[0].number,31);assert.equal(result[1].number,31);assert.equal(result[0].abv,null);assert.equal(result[2].abv,5.2);assert.equal(result[0].malts[0].name,'Pale Ale');assert.ok(!JSON.stringify(result).includes('PRIVATE NOTE'));}finally{await rm(dir,{recursive:true,force:true});}});
test('Importer rejects non SQLite and oversized files',async()=>{await assert.rejects(()=>parseSqlite(Buffer.from('not sqlite')));await assert.rejects(()=>parseSqlite(Buffer.alloc(11*1024*1024)));});

test('Recipe import preserves malt EBC, individual hop additions and yeast package counts',async()=>{
 const dir=await mkdtemp(join(tmpdir(),'beer-recipe-'));
 try {
  const path=join(dir,'fixture.sqlite');const db=new DatabaseSync(path);
  db.exec(`CREATE TABLE Sud(ID INTEGER,Sudnummer INTEGER,Sudname TEXT,Kochdauer REAL); INSERT INTO Sud VALUES(1,32,'Example',70);
  CREATE TABLE Malzschuettung(SudID INTEGER,Name TEXT,erg_Menge REAL,Prozent REAL,Farbe REAL); INSERT INTO Malzschuettung VALUES(1,'Dark malt',0.125,2.5,1200);
  CREATE TABLE Hopfengaben(SudID INTEGER,Name TEXT,erg_Menge REAL,Zeit REAL,Alpha REAL,Vorderwuerze INTEGER); INSERT INTO Hopfengaben VALUES(1,'Magnum',12.5,70,13,1),(1,'Tradition',10,10,5.2,0);
  CREATE TABLE Hefegaben(SudID INTEGER,Name TEXT,Menge REAL); INSERT INTO Hefegaben VALUES(1,'Yeast',1.5);
  CREATE TABLE Hauptgaerverlauf(SudID INTEGER,Zeitstempel TEXT,Restextrakt REAL,Temp REAL);`);
  db.close();const [brew]=await parseSqlite(await readFile(path));
  assert.equal(brew.boilMinutes,70);assert.equal(brew.malts[0].ebc,1200);assert.equal(brew.malts[0].amount,0.125);
  assert.deepEqual(brew.hops.map(h=>[h.minutes,h.alpha,h.firstWort]),[[70,13,true],[10,5.2,false]]);
  assert.deepEqual(brew.yeastDetails,[{name:'Yeast',amount:1.5}]);assert.deepEqual(brew.yeast,['Yeast']);
 } finally {await rm(dir,{recursive:true,force:true});}
});
