import type { PropsWithChildren, ReactNode } from 'react'

const GridBox = ({ children, heading }: PropsWithChildren<{ heading?: ReactNode }>) => (
  <div className="relative w-fit p-14">
    {heading && (
      <div className="absolute inset-x-14 inset-y-0 z-1">{heading}</div>
    )}
    <div className="absolute inset-x-0  inset-y-14 border-t-2 border-b-2 border-dashed border-[#8E75CE] z-0 pointer-events-none"></div>
    <div className="absolute inset-x-14 inset-y-0  border-l-2 border-r-2 border-dashed border-[#8E75CE] z-0 pointer-events-none"></div>
    <div className="relative border-2 rounded-[32px] border-[#4F3879] p-9 z-1">
      {children}
    </div>
  </div>
)

export default GridBox
