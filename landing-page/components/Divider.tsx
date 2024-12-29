import { tx } from '@helpwave/common/twind'

export type DividerProps = {
  rotate?: number,
}

export const Divider = ({ rotate = 0 }: DividerProps) => (<div className={tx(`w-full border border-dashed border-spacing-20 rotate-[${rotate}deg]`)} />)

export default Divider
