import Header from './Header'
import Helpwave from './icons/Helpwave'

const StartSection = () => {
  return (
    <div className="w-screen h-screen bg-primary text-white">
      <div className="py-8 px-16">
        <Header />
      </div>
      <div className="relative top-[30vh] m-auto w-[580px]">
        <div className="flex justify-between">
          <div className="font-space text-7xl font-bold">helpwave</div>
          <Helpwave className="align-center" height="52" width="64" />
        </div>

        <div className="font-sans text-2xl font-medium mt-4">
          {"At helpwave, we don't see information technology"}<br />
          {'as an old marriage that has fallen asleep, but as'}<br />
          {'a newly & rekindled hot affair'}
        </div>
      </div>
    </div>
  )
}

export default StartSection
