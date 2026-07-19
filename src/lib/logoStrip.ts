export function duplicateForLoop<T>(items: T[]): T[] {
  return [...items, ...items]
}
