import React, { forwardRef } from 'react'
import type { ImgHTMLAttributes } from 'react'

export default forwardRef<HTMLImageElement, ImgHTMLAttributes<HTMLImageElement>>(function UkmLogo(props, ref) {
  return (
    <img width={273} height={300} style={{ objectFit: 'contain' }} src="./MSHack.png" {...props} ref={ref} />
  )
})
