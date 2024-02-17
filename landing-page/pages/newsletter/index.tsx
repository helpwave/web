import { tw } from '@helpwave/common/twind'
import type { NextPage } from 'next'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import type { NewsLetterFormType } from '@/components/NewsLetterForm'
import { NewsLetterForm } from '@/components/NewsLetterForm'
import { submitHubSpotForm } from '@/utils/hubspot'

const submitNewsLetterForm = (form: NewsLetterFormType) => submitHubSpotForm(
  '26536657',
  'ad9d98c2-9a40-4610-9a44-6b1f68de55fa', [
    {
      objectTypeId: '0-1',
      name: 'email',
      value: form.email
    },
    {
      objectTypeId: '0-1',
      name: 'firstname',
      value: form.firstname
    },
    {
      objectTypeId: '0-1',
      name: 'lastname',
      value: form.lastname
    },
    {
      objectTypeId: '0-2',
      name: 'name',
      value: form.company
    },
    {
      objectTypeId: '0-2',
      name: 'industry',
      value: form.industry ?? ''
    }
  ]
)

const NewsLetter: NextPage = () => {
  return (
    <div className={tw('w-screen h-screen bg-white parent relative z-0 overflow-x-hidden')}>
      <Header/>
      <div className={tw('desktop:w-5/12 desktop:mx-auto mobile:mx-8 relative z-[1]')}>
        <div className={tw('pt-32 pb-32 flex flex-col items-center')}>
          <div className={tw('h-[300px] w-[500px]')}>
            <NewsLetterForm
              onSubmit={async (form) => {
                await submitNewsLetterForm(form)
                  .then(console.log)
                  .catch(console.error)
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
