import { useEffect, useState } from 'react'
import type { PropertyProps } from '../Properties'
import { Property } from '../Properties'

export type PropertiesExampleProps = {
  name: string,
  required: boolean,
  type: 'text' | 'date' | 'number' | 'select' | 'multi-select'
}

/**
 * Example for showing the PropertiesExample
 */
export const PropertiesExample = ({
  name,
  type,
  required
}: PropertiesExampleProps) => {
  const [property, setProperty] = useState<PropertyProps<string>>({
    name,
    required,
    property: {
      type: 'text',
      value: 'Text example',
      onChange: value => console.log(value)
    }
  })

  useEffect(() => setProperty({ ...property, name, required }), [name, required])

  useEffect(() => {
    if (type === property.property.type) {
      return
    }
    switch (type) {
      case 'text':
        setProperty({
          ...property,
          property: {
            type: 'text',
            value: 'Property Text',
            onChange: value => setProperty(prevState =>
              ({ ...prevState, property: { ...prevState.property, type: 'text', value } })
            )
          }
        }); break
      default:
        setProperty({
          ...property,
          property: {
            type: 'text',
            value: 'Property Text',
            onChange: value => console.log(value)
          }
        }); break
    }
  }, [property, type])

  return (
    <Property {...property}/>
  )
}
