import React, { forwardRef } from 'react'
import type { SVGProps } from 'react'

export default forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>(function HelpwaveRect(props, ref) {
  return (
    <svg width="888" height="482" viewBox="0 0 865 482" fill="none" strokeLinecap="round" strokeWidth="48" ref={ref} {...props}>
      <path d="M132 349.235C132 229.259 220.164 132 328.92 132" stroke="currentColor" />
      <path d="M525.84 350.104C417.084 350.104 328.92 252.844 328.92 132.869" stroke="currentColor" />
      <path d="M450.223 324.035C450.223 238.133 513.348 168.495 591.217 168.495" stroke="currentColor" />
      <path d="M733.001 325.773C654.696 325.773 591.218 256.136 591.218 170.233" stroke="currentColor" />
    </svg>
  )
})
