/** Vietnamese mobile (03/05/07/08/09 + 8 digits) or landline (02x + 8
 * digits); accepts +84 / 84 prefixes and spaces, dots, dashes. Returns the
 * normalized 0-prefixed number, or null. */
export function normalizeVnPhone(raw: string): string | null {
  let v = raw.replace(/[\s.\-()]/g, "");
  if (v.startsWith("+84")) v = `0${v.slice(3)}`;
  else if (/^84\d{9,10}$/.test(v)) v = `0${v.slice(2)}`;
  return /^0[35789]\d{8}$/.test(v) || /^02\d{9}$/.test(v) ? v : null;
}
