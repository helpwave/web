import { tw, tx } from '@helpwave/common/twind'
import Image from 'next/image'
import Link from 'next/link'

export type TeamMemberProps = {
  name: string,
  prefix: string | undefined,
  suffix: string | undefined,
  pictureURL: string | undefined,
  role: string,
  tags: string[],
  socials: { name: string, url: string }[] | undefined,
}

const TeamMember = ({
  name,
  prefix,
  suffix,
  pictureURL,
  role,
  tags,
  socials = [],
}: TeamMemberProps) => {
  const size = 256

  const backedPictureURL = pictureURL ?? 'https://cdn.helpwave.de/logo/logo.png'

  const hashTags = tags.map(tag => (
    <span key={tag} className={tw('transiation-all duration-100 cursor-pointer hover:cursor-pointer hover:text-hw-pool-orange')}>{'#' + tag.toLocaleLowerCase()}</span>
  ))

  const generatedSocials = socials.map(social => (
    <Link key={social.name} href={social.url} target="_blank">
      <span className={tw('transiation-all duration-100 cursor-pointer hover:cursor-pointer hover:text-hw-pool-orange')}>{social.name.toLowerCase()}</span>
  </Link>
  ))

  const shorthand = role.split(' ').at(0) === 'Chief' ? role.split(' ').map(word => word.at(0)).join('') : null

  return (
    <div className={tw('flex flex-col h-full mb-8 w-1/2 text-center p-8 min-w-[300px] items-center')}>
      <Image alt="Profilepicture" src={backedPictureURL} style={{ objectFit: 'contain' }} width={size} height={size} className={tx(`w-[${size}px] tansition-all duration-500 shadow-md hover:shadow-2xl rounded-full object-center m-auto mb-6`)}/>
      <h4 className={tw('font-space text-gray-600 text-lg h-[32px]')}>{prefix}</h4>
      <h2 className={tw('text-3xl font-inter')}>{name}</h2>
      <h4 className={tw('font-space text-gray-600 text-sm h-[32px]')}>{suffix}</h4>
      <h3 className={tw('mt-4 text-2xl font-space')}>{role} <span className={tw('text-md text-sm font-sans')}>{shorthand}</span></h3>
      <h4 className={tw('mt-2 text-lg font-space leading-none justify-center flex flex-wrap gap-2 text-gray-600 max-w-[300px]')}> {generatedSocials} {hashTags}</h4>
    </div>
  )
}

export default TeamMember
