import type { NextPage } from 'next'
import type { TableState } from '@helpwave/common/components/Table'
import {
  defaultTableStatePagination,
  defaultTableStateSelection, removeFromTableSelection,
  Table
} from '@helpwave/common/components/Table'
import { useState } from 'react'
import { Span } from '@helpwave/common/components/Span'
import { Input } from '@helpwave/common/components/user_input/Input'
import { Button } from '@helpwave/common/components/Button'

type DataType = {
  id: string,
  name: string,
  age: number
}

const exampleData: DataType[] = [
  { id: 'data1', name: 'Name 1', age: 23 },
  { id: 'data2', name: 'Name 2', age: 21 },
  { id: 'data3', name: 'Name 3', age: 32 },
  { id: 'data4', name: 'Name 4', age: 42 },
  { id: 'data5', name: 'Name 5', age: 17 },
  { id: 'data6', name: 'Name 6', age: 26 },
  { id: 'data7', name: 'Name 7', age: 19 },
  { id: 'data8', name: 'Name 8', age: 31 }
]

const TablePage: NextPage = () => {
  const [data, setData] = useState<DataType[]>(exampleData)
  const [tableState, setTableState] = useState<TableState>({
    pagination: defaultTableStatePagination,
    selection: defaultTableStateSelection
  })
  const idMapping = (data: DataType) => data.id

  return (
    <Table
      tableState={tableState}
      updateTableState={newTableState => setTableState(newTableState)}
      data={data}
      identifierMapping={idMapping}
      rowMappingToCells={dataObject => [
        <Span key="id" type="title">{dataObject.id}</Span>,
        <Input key="name" value={dataObject.name} onChange={text => setData(data.map(value => value.id === dataObject.id ? { ...dataObject, name: text } : value))} />,
        <Input key="age" type="number" value={dataObject.age.toString()} onChange={text => setData(data.map(value => value.id === dataObject.id ? { ...dataObject, age: parseInt(text) } : value))} />,
        <Button
          key="delete"
          onClick={() => {
            const newData = data.filter(value => value.id !== dataObject.id)
            setData(newData)
            setTableState(removeFromTableSelection(tableState, dataObject, data.length, idMapping))
          }}
          variant="textButton"
          color="negative"
        >Delete</Button>
      ]}
      header={[
        <Span key="headerID" type="tableHeader">ID</Span>,
        <Span key="name" type="tableHeader">Name</Span>,
        <Span key="age" type="tableHeader">age</Span>,
        <></>
      ]}
    />
  )
}

export default TablePage
