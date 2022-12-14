type CarouselProps = {
  items: {
    name: string,
    link: string
  }[]
}

export const Carousel = ({ items } : CarouselProps) => {
  return (
    <div className="rounded-lg w-[18px]">
      <div className="flex flex-col space-y-[26px]">
      {items.map(({ name, link }) => (
        <div key={link}>{name}</div>
      ))}
      </div>
    </div>
  )
}
