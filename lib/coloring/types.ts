export const shadingColorValues = [0, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800, 850, 900, 950, 1000] as const
export type ColorShadingValue = typeof shadingColorValues[number]
export type ShadedColors = Record<ColorShadingValue, string>

export type ColoringStyle = 'background' | 'tonal' | 'tonal-opaque' | 'text' | 'text-border'
export type ColorMode = 'light' | 'dark'

export type Coloring = {
  color: '',
  style?: ColoringStyle,
  mode?: ColorMode,
  hover?: boolean,
}
