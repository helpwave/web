import type { HTMLAttributes, ReactNode } from 'react'
import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'
import { Github, Globe, Linkedin, Mail } from 'lucide-react'
import { Helpwave } from './icons/Helpwave'
import { Chip } from './ChipList'

type SocialType = 'mail' | 'github' | 'linkedin' | 'website' | 'medium'

export type SocialIconProps = {
  type: SocialType,
  url: string,
  size?: number,
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
      // TODO find an alternative icon
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
    <Link href={url} target="_blank">
      <Chip color="dark" className="!p-2">
        {icon}
      </Chip>
    </Link>
  )
}

export type ProfileProps = HTMLAttributes<HTMLDivElement> & {
  name: string,
  imageUrl: string,
  badge?: ReactNode,
  prefix?: string,
  suffix?: string,
  roleBadge?: string,
  role?: string,
  /**
   * The list of tags for the
   */
  tags?: string[],
  info?: string,
  socials?: SocialIconProps[],
  imageClassName?: string,
}


// TODO add colors for dark-mode
/**
 * A Component for showing a Profile
 */
export const Profile = ({
  name,
  imageUrl,
  badge,
  prefix,
  suffix,
  roleBadge,
  role,
  tags,
  info,
  socials,
  className,
  imageClassName,
  ...divProps
}: ProfileProps) => {
  return (
    <div
      {...divProps}
      className={clsx(`col items-center text-center rounded-3xl p-3 pb-4 bg-white text-gray-900 w-min shadow-around-lg`, className)}
    >
      <div className="relative mb-6">
        <div className={clsx('relative rounded-xl row items-center justify-center overflow-hidden', imageClassName)}>
          <Image src={imageUrl} alt="" className={clsx('z-[2] object-cover', imageClassName)} width={0} height={0} style={{ width: 'auto', height: 'auto' }}/>
        </div>
        <div className="absolute top-[6px] left-[6px] z-[3]">{badge}</div>
        {roleBadge && (
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-2/3 z-[4] rounded-md">
            <Chip color="dark" className="font-bold px-3">{roleBadge}</Chip>
          </div>
        )}
      </div>
      {prefix && <span className="font-semibold">{prefix}</span>}
      <h2 id={name} className="textstyle-title-md">{name}</h2>
      {suffix && <span className="text-sm mb-1">{suffix}</span>}
      {role && <span className="font-space font-bold text-sm">{role}</span>}
      {tags && (
        <div className="flex flex-wrap mx-4 mt-2 gap-x-2 justify-center">
          {tags.map((tag, index) => <span key={index} className="textstyle-description text-sm">{`#${tag}`}</span>)}
        </div>
      )}
      {info && <span className="mt-2 text-sm">{info}</span>}
      {socials && (
        <div className="flex flex-wrap grow items-end justify-center gap-x-4 gap-y-2 mt-4">
          {socials.map((socialIconProps, index) => (
            <SocialIcon key={index} {...socialIconProps} size={socialIconProps.size ?? 20}/>
          ))}
        </div>
      )}
    </div>
  )
}
