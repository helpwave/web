export const MultiSearchWithMapping = <T>(search: string, objects: T[], mapping: (value:T) => string[]) => {
  return objects.filter(object => {
    const mappedSearchKeywords = mapping(object).map(value => value.toLowerCase().trim())
    return !!mappedSearchKeywords.find(value => value.includes(search.toLowerCase().trim()))
  })
}

export const SimpleSearchWithMapping = <T>(search: string, values: T[], mapping: (value:T) => string) => {
  return MultiSearchWithMapping(search, values, value => [mapping(value)])
}

export const SimpleSearch = (search: string, values: string[]) => {
  return SimpleSearchWithMapping(search, values, value => value)
}
