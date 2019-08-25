export function pluralize(n: number, [zero, one, more]: [string, string, string]) {
  return `${n} ${[zero, one, more][Math.min(n, 2)]}`;
}
