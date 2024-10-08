/**
 *  Finds all values matching the search values by first mapping the values to a string array and then checking each entry for matches.
 *  Returns the list of all matches.
 *
 *  @param search The list of search strings e.g. `[name, type]`
 *
 *  @param objects The list of objects to be searched in
 *
 *  @param mapping The mapping of objects to the string properties they fulfil
 *
 *  @return The list of objects that match all search strings
 */
export const MultiSubjectSearchWithMapping = <T>(search: string[], objects: T[], mapping: (value:T) => (string| undefined)[]) => {
  return objects.filter(object => {
    const mappedSearchKeywords = mapping(object).map(value => value ? value.toLowerCase().trim() : undefined)
    return search.every(searchValue => !!mappedSearchKeywords.find(value => !!value && value.includes(searchValue.toLowerCase().trim())))
  })
}

/**
 *  Finds all values matching the search value by first mapping the values to a string array and then checking each entry for matches.
 *  Returns the list of all matches.
 *
 *  @param search The search string e.g `name`
 *
 *  @param objects The list of objects to be searched in
 *
 *  @param mapping The mapping of objects to the string properties they fulfil
 *
 *  @return The list of objects that match the search string
 */
export const MultiSearchWithMapping = <T>(search: string, objects: T[], mapping: (value:T) => string[]) => {
  return objects.filter(object => {
    const mappedSearchKeywords = mapping(object).map(value => value.toLowerCase().trim())
    return !!mappedSearchKeywords.find(value => value.includes(search.toLowerCase().trim()))
  })
}

/**
 *  Finds all values matching the search value by first mapping the values to a string and returns the list of all matches.
 *
 *  @param search The search string e.g `name`
 *
 *  @param objects The list of objects to be searched in
 *
 *  @param mapping The mapping of objects to a string that is compared to the search
 *
 *  @return The list of objects that match the search string
 */
export const SimpleSearchWithMapping = <T>(search: string, objects: T[], mapping: (value:T) => string) => {
  return MultiSearchWithMapping(search, objects, value => [mapping(value)])
}

/**
 *  Finds all values matching the search value and returns the list of all matches.
 *
 *  @param search The search string e.g `name`
 *
 *  @param objects The list of objects to be searched in
 *
 *  @return The list of objects that match the search string
 */
export const SimpleSearch = (search: string, objects: string[]) => {
  return SimpleSearchWithMapping(search, objects, value => value)
}
