import { tw, tx } from '@helpwave/common/twind'
import Image from 'next/image'

const images = {
  'REACH': 'https://cdn.helpwave.de/partners/reach.svg',
  'digitalHub Münsterland': 'https://cdn.helpwave.de/partners/digitalhub_muensterland.png',
  'helpwave': 'https://cdn.helpwave.de/logo/logo.png',
}

const PartnerSection = () => {
  const size = 128

  return (
    <div className={tw('flex gap-16 py-16 select-none')}>
      {Object.entries(images).map(([title, src]) => (
        <Image key={title} alt={title} src={src} style={{ objectFit: 'contain' }} width={size} height={size} className={tx(`w-[${size}px] grayscale`)}/>
      ))}
    </div>
  )
}

export default PartnerSection
