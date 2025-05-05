import clsx from 'clsx'
import type {PropsForTranslation} from '@helpwave/common/hooks/useTranslation'
import {useTranslation} from '@helpwave/common/hooks/useTranslation'
import type {Languages} from '@helpwave/common/hooks/useLanguage'
import Image from 'next/image'
import {MarkdownInterpreter} from '@helpwave/common/components/MarkdownInterpreter'
import {SectionBase} from '@/components/sections/SectionBase'
import {Check} from "lucide-react";

type ConnectOrganizationFeatureSectionTranslation = {
  title: string,
  description: string,
  feature1: string,
  feature2: string,
  feature3: string,
  feature4: string,
  feature5: string,
  feature6: string,
}

const defaultConnectOrganizationFeatureSectionTranslation: Record<Languages, ConnectOrganizationFeatureSectionTranslation> = {
  en: {
    title: 'Connect your organization in one tool',
    description: 'Use \\b{helpwave tasks} to experience a user-centered management tool, designed to simplify workflows and ensure high quality patient care.',
    feature1: 'Patient lists',
    feature2: 'Care unit overview',
    feature3: 'Tasks',
    feature4: 'Task templates',
    feature5: 'Patient properties',
    feature6: 'Ward properties',
  },
  de: {
    title: 'Verbinden Sie Ihre Organisation mit einem einzigen Tool',
    description: 'Nutzen Sie \\b{helpwave tasks}, um ein benutzerzentriertes Management-Tool zu erleben, welches Arbeitsabläufe vereinfacht und eine qualitativ hochwertige Patientenversorgung gewährleistet.',
    feature1: 'Patienten-Listen',
    feature2: 'Stationsübersicht',
    feature3: 'Tasks',
    feature4: 'Task Vorlagen',
    feature5: 'Patienten-Properties',
    feature6: 'Stations-Properties',
  }
}

export const ConnectOrganizationFeatureSection = ({overwriteTranslation}: PropsForTranslation<ConnectOrganizationFeatureSectionTranslation>) => {
  const translation = useTranslation(defaultConnectOrganizationFeatureSectionTranslation, overwriteTranslation)
  const imageUrl = 'https://cdn.helpwave.de/products/tasks_ward_overview.png'

  const features = [translation.feature1, translation.feature2, translation.feature3,
    translation.feature4, translation.feature5, translation.feature6]
  const featureStyle = 'font-semibold'

  return (
    <SectionBase
      className={'max-tablet:flex max-tablet:flex-wrap-reverse max-tablet:justify-end tablet:row tablet:justify-between  w-full !max-w-full gap-8 items-center'}
      backgroundColor="gray"
      outerClassName={'!pr-0'}
    >
      <div className={'col items-center max-tablet:items-start flex-1 max-tablet:pr-6'}>
        <div className={'col gap-y-2 max-w-[500px] max-tablet:max-w-full'}>
          <h1 className={'textstyle-title-2xl'}>{translation.title}</h1>
          <span className={'font-space font-semibold'}><MarkdownInterpreter text={translation.description}/></span>
          <div className={'grid grid-cols-2 gap-x-6 gap-y-4 overflow-x-auto mt-2'}>
            {features.map((feature, index) => (
              <div key={index}  className={"row items-center"}>
                <div className={clsx('col justify-center items-center bg-primary text-white rounded-full min-w-[24px] min-h-[24px]')}>
                  <Check size={18} strokeWidth={2.5}/>
                </div>
                <span className={featureStyle}>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div
        // TODO fix image size and add dashed lines
        className={'relative right-0 rounded-l-3xl w-2/5 tablet:min-w-[360px] max-tablet:w-4/5 z-10'}>
        <Image
          src={imageUrl}
          alt=""
          width={0}
          height={0}
          className={'w-full object-cover'}
        />
      </div>
    </SectionBase>
  )
}
