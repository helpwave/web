import { tw, tx } from '@helpwave/common/twind'
import Image from 'next/image'

const images = {
  'REACH': 'https://cdn.helpwave.de/partners/reach.svg',
  'Digital Hub münsterland': 'https://cdn.helpwave.de/partners/digitalhub_muensterland.png',
  'Münsterhack': 'https://cdn.helpwave.de/partners/mshack_2023.png',
}

const PartnerSection = () => {
  const size = 128

  return (
    <div className={tw('flex gap-16 my-16 select-none overflow-x-auto justify-between items-center')}>
      {Object.entries(images).map(([title, src]) => (
        <Image key={title} alt={title} src={src} style={{ objectFit: 'contain' }} width={size} height={size} className={tx(`w-[${size}px] grayscale`)} />
      ))}
    </div>
  )
}

export default PartnerSection
