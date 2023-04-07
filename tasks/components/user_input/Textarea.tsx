import { tw } from '@helpwave/common/twind'

type TextareaProps = {
  headline : string,
  placeholder : string,
  message : string,
  id : string
}
export const Textarea = ({ placeholder, headline, message, id } : TextareaProps) => {
  return (
    <div className={tw('mb-4 relative')}>
      <textarea defaultValue={message} className={tw('h-32 resize-none rounded-md shadow appearance-none border rounded w-full py-8 px-3  border-gray-300 text-gray-700 leading-tight focus:outline-none')} id={id} placeholder={placeholder}>

      </textarea>
      <label className={tw('absolute top-0 left-0 py-2 px-3 text-gray-700 font-bold')} htmlFor={id}>
        {headline}
      </label>
    </div>
  )
}
