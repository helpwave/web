import { tw } from '@helpwave/common/twind'
import type { NextPage } from 'next'
import { RadialRings } from '@helpwave/common/components/Ring'
import { useEffect, useState } from 'react'
import { Span } from '@helpwave/common/components/Span'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import { NewsLetterForm } from '@/components/NewsLetterForm'

const NewsLetter: NextPage = () => {
  const [{ width, height }, setSize] = useState<{width: number, height: number}>({ width: 0, height: 0 })

  useEffect(() => {
    setSize({ width: window.innerWidth, height: window.innerHeight })
  }, [])

  useEffect(() => {
    const updateSize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight })
    }

    window.addEventListener('resize', updateSize)

    return () => {
      window.removeEventListener('resize', updateSize)
    }
  }, [])

  const sizeCircle1 = Math.max(width * 0.466, height * 0.35)
  const sizeCircle2 = Math.max(width * 0.933, height * 0.7)
  const sizeCircle3 = Math.max(width * 1.4, height * 1.05)
  const waveWidth = (sizeCircle2 - sizeCircle1) / 20

  return (
    <div className={tw('w-screen h-screen bg-white parent relative z-0 overflow-x-hidden')}>
      <Header/>
      <div className={tw('h-screen z-[1]')}>
        <div className={tw('relative h-full overflow-hidden')}>
          <div className={tw(`absolute left-0 top-1/2 z-[-1] -translate-x-1/2 -translate-y-1/2`)}>
            {width !== 0 && height !== 0 && (
              <>
                <RadialRings
                  sizeCircle1={sizeCircle1}
                  sizeCircle2={sizeCircle2}
                  sizeCircle3={sizeCircle3}
                  waveWidth={waveWidth}
                />
                <Span className={tw(`absolute z-[100] top-1/2 left-[${sizeCircle2}px] -translate-x-1/2 -translate-y-1/2 text-white mobile:hidden`)}>Goal 1</Span>
                <Span className={tw(`absolute z-[100] top-1/2 left-[${sizeCircle2 + (sizeCircle3 - sizeCircle2) / 2}px] -translate-x-1/2 -translate-y-1/2 text-white mobile:hidden`)}>Goal 2</Span>
              </>
            )}
          </div>
          <div className={tw('absolute desktop:right-1/4 mobile:right-1/2 top-1/2 -translate-y-1/2 translate-x-1/2 desktop:w-[500px] mobile:w-4/5 mobile:max-w-[340px]')}>
            <NewsLetterForm
              onSubmit={formState => {
                console.log(formState)
                // TODO make newsletter signup
              }}
            />
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  )
}

export default NewsLetter
