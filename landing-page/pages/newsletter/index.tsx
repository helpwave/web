import { tw } from '@helpwave/common/twind'
import type { NextPage } from 'next'
import { RadialRings } from '@helpwave/common/components/Ring'
import { useEffect, useState } from 'react'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import { NewsLetterForm } from '@/components/NewsLetterForm'

const NewsLetter: NextPage = () => {
  const [windowWidth, setWindowWidth] = useState(0)

  useEffect(() => setWindowWidth(window.innerWidth), [])

  useEffect(() => {
    const updateWindowWidth = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener('resize', updateWindowWidth)

    return () => {
      window.removeEventListener('resize', updateWindowWidth)
    }
  }, [])

  const sizeCircle1 = windowWidth * 0.466
  const sizeCircle2 = windowWidth * 0.933
  const sizeCircle3 = windowWidth * 1.4
  const waveWidth = (sizeCircle2 - sizeCircle1) / 20

  return (
    <div className={tw('w-screen h-screen bg-white parent relative z-0 overflow-x-hidden')}>
      <Header/>
      <div className={tw('h-screen z-[1]')}>
        <div className={tw('relative h-full overflow-hidden')}>
          <div className={tw(`absolute left-0 top-1/2 z-[-1] -translate-x-1/2 -translate-y-1/2`)}>
            {windowWidth !== 0 && (
              <RadialRings
                sizeCircle1={sizeCircle1}
                sizeCircle2={sizeCircle2}
                sizeCircle3={sizeCircle3}
                waveWidth={waveWidth}
              />
            )}
          </div>
          <div className={tw('absolute right-1/4 top-1/2 -translate-y-1/2 translate-x-1/2 w-[500px]')}>
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
