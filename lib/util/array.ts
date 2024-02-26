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

/** Finds the closest match
 * @param list: The list of all possible matches
 * @param firstCloser: Return whether a is closer than b
 */
export const closestMatch = <T, >(list: T[], firstCloser: (item1: T, item2: T) => boolean) => {
  return list.reduce((item1, item2) => {
    return firstCloser(item1, item2) ? item1 : item2
  })
}
