export type ClassValue = string | undefined | Record<string, boolean>;

export function classCombiner(...args: ClassValue[]): string {
  return args
    .flatMap(arg => {
      if (typeof arg === 'string') {
        return arg.trim()
      }
      if (typeof arg === 'object' && arg !== null) {
        return Object.entries(arg)
          .filter(([_, value]) => value)
          .map(([key]) => key)
      }
      return []
    })
    .filter(Boolean)
    .join(' ')
}
