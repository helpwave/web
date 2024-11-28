import tinycolor from 'tinycolor2'
import type { ShadedColors } from './types'
import { shadingColorValues } from './types'

// Function to generate a full shading of several colors
export const generateShadingColors = (partialShading: Omit<Partial<ShadedColors>, '0' | '1000'>): ShadedColors => {
  const shading: ShadedColors = {
    0: '#FFFFFF',
    1000: '#000000'
  } as ShadedColors

  let index = 1
  while (index < shadingColorValues.length - 1) {
    const previous = shadingColorValues[index - 1]!
    const current = shadingColorValues[index]!

    if (partialShading[current] !== undefined) {
      shading[current] = partialShading[current]
      index++
      continue
    }

    let j: number = index + 1
    while (j < shadingColorValues.length) {
      if (partialShading[shadingColorValues[j]!] !== undefined) {
        break
      }
      j++
    }
    if (j === shadingColorValues.length) {
      j = shadingColorValues.length - 1
    }

    const nextFound = shadingColorValues[j]!
    const interval = nextFound - previous
    for (let k = index; k < j; k++) {
      const current = shadingColorValues[k]!
      const previousValue = partialShading[previous] ?? shading[previous]
      const nextValue = partialShading[nextFound] ?? shading[nextFound]
      shading[current] = tinycolor.mix(tinycolor(previousValue), tinycolor(nextValue), (current - previous) / interval * 100).toHexString()
    }
    index = j
  }

  return shading
}
