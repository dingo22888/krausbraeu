export function publicationIds(values: FormDataEntryValue[]): number[] {
 if (!values.length || values.length > 1000) throw new Error('Bitte Sude auswählen.');
 const ids = values.map(v => {
  if (typeof v !== 'string' || !/^[1-9]\d*$/.test(v)) throw new Error('Ungültige Auswahl.');
  const id = Number(v);
  if (!Number.isSafeInteger(id) || id > 2147483647) throw new Error('Ungültige Auswahl.');
  return id;
 });
 return [...new Set(ids)];
}
