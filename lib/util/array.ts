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

/**
 * returns the item in middle of a list and its neighbours before and after
 * e.g. [1,2,3,4,5,6] for item = 1 would return [5,6,1,2,3]
 */
export const getNeighbours = <T, >(list: T[], item: T, neighbourDistance: number = 2) => {
  const index = list.indexOf(item)
  const totalItems = neighbourDistance * 2 + 1
  if (list.length < totalItems) {
    console.warn('List is to short')
    return list
  }

  if (index === -1) {
    console.error('item not found in list')
    return list.splice(0, totalItems)
  }

  let start = index - neighbourDistance
  if (start < 0) {
    start += list.length
  }
  const end = (index + neighbourDistance + 1) % list.length

  const result:T[] = []
  let ignoreOnce = list.length === totalItems
  for (let i = start; i !== end || ignoreOnce; i = (i + 1) % list.length) {
    result.push(list[i]!)
    if (end === i && ignoreOnce) {
      ignoreOnce = false
    }
  }
  return result
}
