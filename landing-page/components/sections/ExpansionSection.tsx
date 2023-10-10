import { tw } from '@helpwave/common/twind'

const ExpansionSection = () => {
  return (
    <div className={tw('pb-16')}>
        <h1 className={tw('w-full text-2xl text-end font-space')}>Germany&#39;s Healthcare System</h1>

        <div className={tw('mt-8 w-full flex justify-between items-center')}>
          <div className={tw('text-center')}>
            <span className={tw('text-4xl')}>1.800</span>
            <br />
            <h4>hospitals</h4>
          </div>

          <div className={tw('text-center')}>
            <span className={tw('text-4xl')}>1.000.000</span>
            <br />
            <h4>healthcare workers</h4>
          </div>

          <div className={tw('text-center')}>
            <span className={tw('text-4xl')}>12,10</span>
            <br />
            <h4>% of GDP</h4>
          </div>
        </div>
    </div>
  )
}

export default ExpansionSection
