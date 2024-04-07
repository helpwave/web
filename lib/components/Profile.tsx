import type { HTMLAttributes, ReactNode } from 'react'
import { tw, tx } from '@twind/core'
import Image from 'next/image'
import Link from 'next/link'
import { Github, Globe, Linkedin, Mail } from 'lucide-react'
import { Helpwave } from '../icons/Helpwave'
import { Span } from './Span'
import { Chip } from './ChipList'

type SocialType = 'mail' | 'github' | 'linkedin' | 'website' | 'medium'

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
    case 'linkedin':
      icon = <Linkedin size={size}/>
      break
    case 'github':
      // TODO find an alternative icon
      icon = <Github size={size}/>
      break
    case 'website':
      icon = <Globe size={size}/>
      break
    case 'medium':
      icon = <Globe size={size}/> // TODO find an appropriate medium svg
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

export type ProfileProps = HTMLAttributes<HTMLDivElement> & {
  name: string,
  imageUrl: string,
  badge?: ReactNode,
  title?: string,
  roleBadge?: string,
  role?: string,
  /**
   * The list of tags for the
   */
  tags?: string[],
  info?: string,
  socials?: SocialIconProps[],
  /**
   * Defaults to 200px X 200px
   */
  imageSize?: Partial<Size>
}

/**
 * A Component for showing a Profile
 */
export const Profile = ({
  name,
  imageUrl,
  badge,
  title,
  roleBadge,
  role,
  tags,
  info,
  socials,
  imageSize,
  className,
  ...divProps
}: ProfileProps) => {
  const usedImageSize: Size = { width: imageSize?.width ?? 200, height: imageSize?.height ?? 200 }

  return (
    <div
      {...divProps}
      className={tx(`flex flex-col items-center text-center rounded-3xl p-3 pb-4 bg-white w-[${usedImageSize?.width + 24}px]`, className)}
    >
      <div className={tw('relative mb-6')} style={{ ...usedImageSize }}>
        <div className={tw('absolute rounded-xl flex flex-row items-center justify-center overflow-hidden')}
             style={{ ...usedImageSize }}>
          <Image src={imageUrl} alt="" className={tw('z-[2]')} {...usedImageSize}/>
        </div>
        <div className={tw('absolute top-[6px] left-[6px] z-[3]')}>{badge}</div>
        {roleBadge && (
          <div className={tw('absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-2/3 z-[4]')}>
            <Chip color="black" className={tw('font-bold px-3')}>{roleBadge}</Chip>
          </div>
        )}
      </div>
      {title && <Span className={tw('font-semibold')}>{title}</Span>}
      <h2 id={name}><Span type="title">{name}</Span></h2>
      {role && <Span className={tw('font-space font-bold text-sm')}>{role}</Span>}
      {tags && (
        <div className={tw('flex flex-wrap mx-4 mt-2 gap-x-2 justify-center')}>
          {tags.map((tag, index) => <Span key={index} type="description" className={tw('text-sm')}>{`#${tag}`}</Span>)}
        </div>
      )}
      {info && <Span className={tw('mt-2 text-sm')}>{info}</Span>}
      {socials && (
        <div className={tw('flex flex-wrap flex-grow items-end justify-center gap-x-4 gap-y-2 mt-4')}>
          {socials.map((socialIconProps, index) => (
            <SocialIcon key={index} {...socialIconProps} size={socialIconProps.size ?? 20}/>
          ))}
        </div>
      )}
    </div>
  )
}
