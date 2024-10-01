/**
 * A simple function that implements the builder pattern
 * @param value The value to update which gets return with the same reference
 * @param update The updates to apply on the object
 */
export const builder = <T>(value: T, update: (value: T) => void): T => {
  update(value)
  return value
}
