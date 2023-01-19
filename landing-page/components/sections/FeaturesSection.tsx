import {forwardRef} from 'react'
import {Section} from '../Section'
import {tw} from "@twind/core";
import {Checkbox} from "../Checkbox";

const features = [
  {title: "Feature 1", detail: "Some descriptive text for this feature, it sure sounds very interesting"},
  {title: "Feature 2", detail: "Some descriptive text for this feature, it sure sounds very interesting"},
  {title: "Feature 3", detail: "Some descriptive text for this feature, it sure sounds very interesting"},
  {title: "Feature 4", detail: "Some descriptive text for this feature, it sure sounds very interesting"},
]

const Feature = ({title, detail}: { title: string, detail: string }) => (
  <div className={tw('flex flex-row items-start text-xl')}>
    <Checkbox checked={true} onChange={() => undefined} disabled id={"feature-" + title} label={""}/>
    <span className={tw('font-medium text-white text-xl')}>
      {title} <span className={tw(`font-normal text-gray-400`)}>{detail}</span>
    </span>
  </div>
)

const FeaturesSection = forwardRef<HTMLDivElement>(function FeaturesSection(_, ref) {
  return (
    <div className={tw("relative")} id="features">
      <Section ref={ref} id="features">
        <h1 className={tw('text-5xl font-space font-bold pb-4')}>Solve real world problems</h1>
        <div className={tw("w-5/12 flex flex-col my-24")}>
          {features.map((value, index) =>
            <div className={tw(`w-9/12 flex flex-col ${index % 2 == 0 ? "self-end mr-8" : "self-start ml-8"} my-8`)}>
              {Feature(value)}
            </div>)}
        </div>
      </Section>
      <div className={tw("w-6/12 h-full flex flex-col absolute right-0 top-0 rounded-3xl pb-16 pt-32")}
           style={{background: "radial-gradient(#6F387999 15%, #281c2000 60%)"}}>
        <div className={tw("w-full h-3/6 flex flex-row items-end justify-end mb-8")}>
          <div className={tw("w-3/5 h-4/5 relative rounded-3xl bg-gray-200")}/>
          <div className={tw("w-3/12 h-full rounded-l-3xl ml-8 mt-4 bg-gray-200")}/>
        </div>
        <div className={tw("w-full h-3/6 flex justify-end")}>
          <div className={tw("w-9/12 h-5/6 rounded-l-3xl bg-gray-200 ")}/>
        </div>
      </div>
    </div>
  )
})

export default FeaturesSection
