import type { NextPage } from 'next'
import { RadialRings } from '@helpwave/hightide'
import { useEffect, useState } from 'react'
import type { Languages } from '@helpwave/hightide'
import { useTranslation } from '@helpwave/hightide'
import type { NewsLetterFormType } from '@/components/NewsLetterForm'
import { NewsLetterForm } from '@/components/NewsLetterForm'
import { submitHubSpotForm } from '@/utils/hubspot'
import { Page } from '@/components/Page'
import { SectionBase } from '@/components/sections/SectionBase'

const submitNewsLetterForm = (form: NewsLetterFormType) => submitHubSpotForm(
  '26536657',
  'ad9d98c2-9a40-4610-9a44-6b1f68de55fa', [
    {
      objectTypeId: '0-1',
      name: 'email',
      value: form.email
    },
    {
      objectTypeId: '0-1',
      name: 'firstname',
      value: form.firstname
    },
    {
      objectTypeId: '0-1',
      name: 'lastname',
      value: form.lastname
    },
    {
      objectTypeId: '0-2',
      name: 'name',
      value: form.company
    },
    {
      objectTypeId: '0-2',
      name: 'industry',
      value: form.industry ?? ''
    }
  ]
)

type NewsLetterTranslation = {
  title: string,
}

const defaultNewsLetterTranslation: Record<Languages, NewsLetterTranslation> = {
  en: {
    title: 'Join Newsletter',
  },
  de: {
    title: 'Newsletter anmelden',
  }
}

const NewsLetter: NextPage = () => {
  const translation = useTranslation(defaultNewsLetterTranslation)
  const [{ width, height }, setSize] = useState<{ width: number, height: number }>({ width: 0, height: 0 })

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
    <Page className="w-screen h-screen relative z-0" pageTitleAddition={translation.title}>
      <SectionBase className="h-screen z-[1] w-full !max-w-full" outerClassName="!p-0">
        <div className="relative h-full overflow-hidden">
          <div className="absolute left-0 top-1/2 z-[-1] -translate-x-1/2 -translate-y-1/2">
            {width !== 0 && height !== 0 && (
              <>
                <RadialRings
                  sizeCircle1={sizeCircle1}
                  sizeCircle2={sizeCircle2}
                  sizeCircle3={sizeCircle3}
                  waveWidth={waveWidth}
                />
                <div className="absolute z-[100] top-1/2 -translate-x-1/2 -translate-y-1/2 text-white max-tablet:hidden"
                  style={{ left: `${sizeCircle2}px` }}
                />
                <div className="absolute z-[100] top-1/2 -translate-x-1/2 -translate-y-1/2 text-white max-tablet:hidden"
                  style={{ left: `${sizeCircle2 + (sizeCircle3 - sizeCircle2) / 2}px` }}
                />
              </>
            )}
          </div>
          <div className="absolute top-1/2 -translate-y-1/2 desktop:right-[15%] tablet:right-[15%]  max-tablet:right-1/2 max-tablet:translate-x-1/2 desktop:w-[500px] max-tablet:w-4/5 max-tablet:max-w-[340px]">
            <NewsLetterForm
              onSubmit={async (form) => {
                await submitNewsLetterForm(form)
                  .then(console.log)
                  .catch(console.error)
              }}
            />
          </div>
        </div>
      </SectionBase>
    </Page>
  )
}

export default NewsLetter
