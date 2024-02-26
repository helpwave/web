export const equalSizeGroups = <T, >(array: T[], groupSize: number): T[][] => {
  if (groupSize <= 0) {
    console.warn(`group size should be greater than 0: groupSize = ${groupSize}`)
    return [[...array]]
  }

  const groups = []
  for (let i = 0; i < array.length; i += groupSize) {
    groups.push(array.slice(i, Math.min(i + groupSize, array.length)))
  }
  return groups
}

export const range = (start: number, end: number) => Array.from({ length: end - start + 1 }, (_, index) => index + start)
