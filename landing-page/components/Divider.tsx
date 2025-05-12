export type DividerProps = {
  rotate?: number,
}

export const Divider = ({ rotate = 0 }: DividerProps) => (
  <div
    className="w-full border border-dashed border-spacing-20"
    style={{ transform: `rotate(${rotate}deg)` }}
  />
)

export default Divider
