export function tableRow(...cells: unknown[]): string[] {
  return cells.map((c) => (c == null || c === "" ? "—" : String(c)));
}
