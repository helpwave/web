import type { ReactNode } from 'react'
import { tw } from '@twind/core'
import Image from 'next/image'
import Link from 'next/link'
import { Github, Globe, Linkedin, Mail } from 'lucide-react'
import { Helpwave } from '../icons/Helpwave'
import { Span } from './Span'
import { Chip } from './ChipList'

type SocialType = 'mail' | 'github' | 'linkedIn' | 'web'

export type SocialIconProps = {
  type: SocialType,
  url: string,
  size?: number
}

/**
 * A Component for showing a lin
 */
const SocialIcon = ({ type, url, size = 24 }: SocialIconProps) => {
  let icon: ReactNode
  switch (type) {
    case 'mail':
      icon = <Mail size={size}/>
      break
    case 'linkedIn':
      icon = <Linkedin size={size}/>
      break
    case 'github':
      // TODO find an alternative icon
      icon = <Github size={size}/>
      break
    case 'web':
      icon = <Globe size={size}/>
      break
    default:
      icon = <Helpwave size={24}/>
  }
  return (
    <Link href={url}>
      <Chip color="black" className="!p-2">
        {icon}
      </Chip>
    </Link>
  )
}

type Size = {
  width: number,
  height: number
}

export type ProfileProps = {
  name: string,
  url: string,
  badge?: ReactNode,
  role?: string,
  subtitle?: string,
  /**
   * The list of tags for the
   */
  tags?: string[],
  info?: string,
  socials?: SocialIconProps[],
  /**
   * Defaults to 100px X 100px
   */
  imageSize?: Partial<Size>
}

/**
 * A Component for showing a Profile
 */
export const Profile = ({
  name,
  url,
  badge,
  role,
  subtitle,
  tags,
  info,
  socials,
  imageSize
}: ProfileProps) => {
  const usedImageSize: Size = { width: imageSize?.width ?? 200, height: imageSize?.height ?? 200 }
  const minSize = Math.min(usedImageSize.width, usedImageSize.height)

  return (
    <div className={tw(`flex flex-col items-center text-center rounded-3xl p-3 pb-4 bg-white w-[${usedImageSize?.width + 24}px]`)}>
      <div className={tw('relative')} style={{ ...usedImageSize }}>
        <div className={tw('absolute rounded-xl flex flex-row items-center justify-center overflow-hidden')} style={{ ...usedImageSize }}>
          <Helpwave size={minSize} className={tw('z-[1]')}/>
          <Image src={url} alt="" className={tw('z-[2]')} {...usedImageSize}/>
        </div>
        <div className={tw('absolute top-[6px] left-[6px] z-[3]')}>{badge}</div>
        {role && (
          <div className={tw('absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-2/3 z-[4]')}>
            <Chip color="black" className={tw('font-bold px-3')}>{role}</Chip>
          </div>
        )}
      </div>
      <h2 id={name} className={tw('mt-6')}><Span type="title">{name}</Span></h2>
      {subtitle && <Span className={tw('font-space font-bold text-sm')}>{subtitle}</Span>}
      {tags && (
        <div className={tw('flex flex-wrap mx-4 mt-2 gap-x-2 justify-center')}>
          {tags.map((tag, index) => <Span key={index} type="description" className={tw('text-sm')}>{`#${tag}`}</Span>)}
        </div>
      )}
      {info && <Span className={tw('mt-2 text-sm')}>{info}</Span>}
      {socials && (
        <div className={tw('flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4')}>
          {socials.map((socialIconProps, index) => (
            <SocialIcon key={index}{...socialIconProps}/>
          ))}
        </div>
      )}
    </div>
  )
}
