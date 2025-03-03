
export const invertRGB = (hex: string) => {
  const rgb = hex.slice(1, 7)
  const alpha = hex.slice(7)

  // Convert RGB to inverted hex
  const invertedRgb = rgb
    .match(/.{2}/g) // Split into ["FF", "FF", "FF"]
    ?.map((hex) => (255 - parseInt(hex, 16)).toString(16).padStart(2, "0")) // Invert each color
    .join("") || rgb; // Join back to string

  return `#${invertedRgb}${alpha}`;
}
