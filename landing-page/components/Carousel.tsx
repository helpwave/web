import { tw, css } from '@helpwave/common/twind'

type CarouselProps = {
  items: {
    link: string,
    label: string
  }[],
  activeLink?: string,
  hidden?: boolean
}

// TODO: generalize these variables and put them into the twind config
const globalStyles = css`
:root {
  --background-color: hsl(0, 0%, 15%);
  --background-bar-color: hsl(0, 0%, 17%);
  --background-hover-color: rgba(229, 229, 229, 0.12);
  --background-active-color: rgba(229, 229, 229, 0.10);

  --duration: 300ms;
  --short-duration: 150ms;
}

.toc {
  @apply fixed opacity-0 text-sm leading-7 pointer-events-none;
  top: 30vh;
  left: 0;
  z-index: 100;
  transition: opacity var(--short-duration) ease-in-out;
  min-width: 192px;
}

.toc:not(.toc--visible) * {
  pointer-events: none!important;
}

.toc--visible {
  @apply opacity-100 pointer-events-auto;
}

.toc-background {
  @apply absolute top-0 right-0 left-0 bottom-0 rounded-tr-xl rounded-br-xl;
  background: var(--background-color);
  box-shadow: 0 15px 25px #0000001a, 0 10px 60px #0000001a;
}

.toc-hitbox {
  @apply absolute top-0 left-0 bottom-0 pointer-events-auto;
  width: 46px;
  z-index: 5;
}

.toc-bar {
  @apply absolute left-4 top-6 bottom-6 w-3.5 pointer-events-auto;
  border-radius: 7px;
  background: var(--background-bar-color);
  transition: opacity var(--short-duration) ease-in-out;
}

.toc-items {
  @apply relative pt-5 pl-5 pb-5 pr-8 pointer-events-none;
}

.toc-item {
  @apply block relative text-white/60 outline-none no-underline;
  padding-left: 18px;
  transition: color var(--short-duration) ease-in-out;
}

.toc-item--selected {
  @apply font-medium text-white/90;
}

.toc-item::before {
  @apply absolute left-0 top-1/2 w-1.5 h-1.5 bg-white/10 rounded pointer-events-none;
  content: "";
  margin-top: -3px;
  transition: background-color var(--short-duration) ease-in-out;
}

.toc-item--selected::before {
  @apply bg-hw-primary-700;
}

.toc-item::after {
  @apply absolute top-0 bottom-0 left-[-8px] right-[-8px] rounded opacity-0 pointer-events-none;
  content: "";
  background: var(--background-hover-color);
  transition: opacity var(--short-duration) ease-in-out;
}

.toc-item:hover::after {
  opacity: 1;
}

.toc-item:active::after {
  opacity: 1;
  background: var(--background-active-color);
}

.toc .toc-background, .toc .toc-item-label {
  opacity: 0;
  transition: opacity var(--duration) ease-in-out;
}

.toc:hover .toc-background, .toc:hover .toc-item-label {
  opacity: 1;
}

.toc:hover .toc-items {
  pointer-events: auto;
}

.toc--hover .toc-hitbox {
  pointer-events: none;
}
`

const cx = (maybeClassNames: Record<string, boolean>) =>
  Object.entries(maybeClassNames)
    .filter(([, bool]) => bool)
    .map(([className]) => className)
    .join(' ')

export const Carousel = ({ items, activeLink, hidden = false } : CarouselProps) => {
  return (
    <div className={tw(globalStyles)}>
      <div className={cx({ 'toc': true, 'toc--visible': !hidden })}>
        <div className="toc-bar" />
        <div className="toc-background" />
        <div className="toc-hitbox" />
        <div className="toc-items">
          {items.map(({ link, label }) => (
            <a key={link} href={link} className={cx({
              'toc-item no-link-style': true,
              'toc-item--selected': activeLink === link,
            })}>
              <span className="toc-item-label">{label}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
