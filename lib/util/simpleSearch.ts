/**
 * Finds all values matching the search value by first mapping the values to a string array and then checking each entry for matches
 */
export const MultiSearchWithMapping = <T>(search: string, objects: T[], mapping: (value:T) => string[]) => {
  return objects.filter(object => {
    const mappedSearchKeywords = mapping(object).map(value => value.toLowerCase().trim())
    return !!mappedSearchKeywords.find(value => value.includes(search.toLowerCase().trim()))
  })
}

/**
 * Finds all values matching the search value by first mapping the values to a string
 */
export const SimpleSearchWithMapping = <T>(search: string, values: T[], mapping: (value:T) => string) => {
  return MultiSearchWithMapping(search, values, value => [mapping(value)])
}

/**
 * Finds all values matching the search value
 */
export const SimpleSearch = (search: string, values: string[]) => {
  return SimpleSearchWithMapping(search, values, value => value)
}
