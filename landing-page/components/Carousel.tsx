import { tw } from '@twind/core'

type CarouselProps = {
  items: {
    name: string,
    link: string
  }[]
}

export const Carousel = ({ items } : CarouselProps) => {
  return (
    <div className={tw('rounded-lg w-[18px]')}>
      <div className={tw('flex flex-col space-y-[26px]')}>
      {items.map(({ name, link }) => (
        <div key={link}>{name}</div>
      ))}
      </div>
    </div>
  )
}
