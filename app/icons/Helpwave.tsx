import React, { forwardRef } from 'react'
import type { SVGProps } from 'react'

export default forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>(function Helpwave(props, ref) {
  return (
    <svg width="888" height="888" viewBox="0 0 888 888" fill="none" strokeLinecap="round" strokeWidth="48" ref={ref} {...props}>
      <path d="M144 543.235C144 423.259 232.164 326 340.92 326" stroke="currentColor" />
      <path d="M537.84 544.104C429.084 544.104 340.92 446.844 340.92 326.869" stroke="currentColor" />
      <path d="M462.223 518.035C462.223 432.133 525.348 362.495 603.217 362.495" stroke="currentColor" />
      <path d="M745.001 519.773C666.696 519.773 603.218 450.136 603.218 364.233" stroke="currentColor" />
    </svg>
  )
})
