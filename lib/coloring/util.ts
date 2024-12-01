import type { Coloring, ColoringStyle } from './types'

/**
 * A function to create a coloring for a Button, Label or other context that allows for
 */
export const getColoring = ({
  color,
  hover = false,
  style = 'background',
  mode = 'light',
}: Coloring): string => {
  const modeShifted = (value: number) => mode === 'light' ? value : 1000 - value

  const colorStyleMapping: Record<ColoringStyle, string> = {
    'background': `bg-${color}-${modeShifted(400)} text-${color}-${modeShifted(0)}`,
    'tonal': `bg-${color}-${modeShifted(400)}/30 text-${color}-${modeShifted(700)}`,
    'tonal-opaque': `bg-${color}-${modeShifted(150)} text-${color}-${modeShifted(700)}`,
    'text': `text-${color}-${modeShifted(400)}`,
    'text-border': `text-${color}-${modeShifted(400)} border border-2 border-${color}-${modeShifted(400)}`
  }
  const colorValue = colorStyleMapping[style]
  const hoverMapping: Record<ColoringStyle, string> = {
    'background': ` hover:bg-${color}-${modeShifted(500)}`,
    'tonal': `bg-${color}-${modeShifted(400)}/40 text-${color}-${modeShifted(800)}`,
    'tonal-opaque': `bg-${color}-${modeShifted(250)} text-${color}-${modeShifted(800)}`,
    'text': ` hover:text-${color}-${modeShifted(500)}`,
    'text-border': ` hover:text-${color}-${modeShifted(500)} hover:border-${color}-${modeShifted(500)}`
  }
  const hoverValue = hover ? hoverMapping[style] : ''
  return colorValue + hoverValue
}
