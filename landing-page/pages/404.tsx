import { Helpwave } from '@helpwave/common/icons/Helpwave'
import { tw } from '@helpwave/common/twind'
import type { NextPage } from 'next'
import Link from 'next/link'
import Footer from '../components/Footer'
import Header from '../components/Header'

const NotFound: NextPage = () => {
  return (
    <div className={tw('w-screen h-screen bg-white relative z-0 overflow-x-hidden')}>
      <Header />
      <div className={tw('desktop:w-5/12 h-full desktop:mx-auto tablet:mx-16 phone:mx-8 relative z-[1]')}>
        <div className={tw('absolute w-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center')}>
          <Helpwave className={tw('w-full left-1/2')} size={256} animate="bounce" />
          <h1 className={tw('text-9xl font-space mb-8')}>404 Not Found</h1>
          <p className={tw('text-4xl font-inter')}>This is definitely not the site you&#39;re looking for...</p>
          <p className={tw('text-4xl font-inter')}>Let me take you to the <Link className={tw('underline text-cyan-900')} href="/">home page</Link>.</p>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default NotFound
