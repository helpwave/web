
export const Body = () => {
  return (
    <div id="carouselExampleCrossfade" className="carousel slide carousel-fade relative" data-bs-ride="carousel">
      <div className="carousel-inner relative w-full overflow-hidden">
        <div className="carousel-item active float-left w-full">
          <div className="flex h-96" data-carousel-item="active">
            <span className="m-auto text-white w-1/2">
              <h4 className="font-medium leading-tight text-4xl mt-0 mb-2">
                Helpwave
              </h4>
              At helpwave, we don't see information technology as an old marriage that has fallen asleep, but as a newly & rekindled hot affair.
            </span>
          </div>
        </div>
      </div>
      <div className="carousel-indicators relative" data-carousel="static">
        <div className="absolute z-30 flex space-x-3 -translate-x-1/2 bottom-5 left-1/2">
          <button type="button" className="bg-white w-3 h-3 rounded-full" aria-current="true" aria-label="Slide 1" data-carousel-slide-to="0"></button>
          <button type="button" className="bg-secondary w-3 h-3 rounded-full" aria-current="false" aria-label="Slide 2" data-carousel-slide-to="1"></button>
          <button type="button" className="bg-secondary w-3 h-3 rounded-full" aria-current="false" aria-label="Slide 3" data-carousel-slide-to="2"></button>
          <button type="button" className="bg-secondary w-3 h-3 rounded-full" aria-current="false" aria-label="Slide 4" data-carousel-slide-to="3"></button>
          <button type="button" className="bg-secondary w-3 h-3 rounded-full" aria-current="false" aria-label="Slide 5" data-carousel-slide-to="4"></button>
        </div>
      </div>
    </div>
  )
}
