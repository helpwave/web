import { Helpwave } from '@helpwave/common/icons/Helpwave'
import { tw } from '@helpwave/common/twind'
import Navigation from './Navigation'

const Header = () => {
  return (
    <div>
      <div className={tw('max-w-screen fixed left-[40px] top-[40px] rounded-md')}>
        <Helpwave />
      </div>
      <Navigation />
    </div>
  )
}

export default Header
