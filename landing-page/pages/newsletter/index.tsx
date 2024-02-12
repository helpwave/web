import { tw } from '@helpwave/common/twind'
import type { NextPage } from 'next'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import { NewsLetterForm } from '@/components/NewsLetterForm'

const NewsLetter: NextPage = () => {
  return (
    <div className={tw('w-screen h-screen bg-white parent relative z-0 overflow-x-hidden')}>
      <Header/>
      <div className={tw('desktop:w-5/12 desktop:mx-auto mobile:mx-8 relative z-[1]')}>
        <div className={tw('pt-32 pb-32 flex flex-col items-center')}>
          <div className={tw('h-[300px] w-[500px]')}>
            <NewsLetterForm
              onSubmit={formState => {
                console.log(formState)
                // TODO make newsletter signup
              }}
            />
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  )
}

export default NewsLetter
