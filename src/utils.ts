export function pluralize(n: number, [one, multiple]: [string, string]) {
  return `${n} ${n === 1 ? one : multiple}`;
}
