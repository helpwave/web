import { useState } from 'react'
import type { InputGroupProps } from '../InputGroup'
import { InputGroup } from '../InputGroup'
import { Select } from '../user-input/Select'
import { Input } from '../user-input/Input'
import { Textarea } from '../user-input/Textarea'

export type InputGroupExampleProps = Omit<InputGroupProps, 'inputs' | 'onChange'>

type InputType = {
  subject?: string,
  propertyName: string,
  description: string
}

/**
 * Example for an Input Group
 */
export const InputGroupExample = ({
  ...props
}: InputGroupExampleProps) => {
  const [state, setState] = useState<InputType>({
    propertyName: '',
    description: ''
  })

  return (
    <InputGroup
      {...props}
      inputs={[
        <Select
          key="item1"
          label="Subject Type"
          value={state.subject}
          options={[
            { value: 'organization', label: 'Organization' },
            { value: 'ward', label: 'Ward' },
            { value: 'bed', label: 'Bed' },
            { value: 'patient', label: 'Patient' },
          ]}
          onChange={subject => setState({ ...state, subject })}
          labelType="labelSmall"
        />,
        <Input
          key="item2"
          label="Property Name"
          value={state.propertyName}
          onChange={propertyName => setState({ ...state, propertyName })}
        />,
        <Textarea
          key="item3"
          label="Description"
          value={state.description}
          onChange={description => setState({ ...state, description })}
        />,
      ]}
      onChange={console.log}
    />
  )
}
