import { useEffect, useState } from 'react'
import type { TableProps, TableSortingFunctionType, TableSortingType, TableState } from '../Table'
import {
  addElementToTable,
  defaultTableStatePagination,
  defaultTableStateSelection,
  removeFromTableSelection,
  Table
} from '../Table'
import { tw } from '../../twind'
import { Span } from '../Span'
import { Input } from '../user-input/Input'
import { Button } from '../Button'
import { SortButton } from '../SortButton'

export type DataType = {
  id: string,
  name: string,
  age: number
}

export const exampleData: DataType[] = [
  { id: 'data1', name: 'Name 1', age: 23 },
  { id: 'data2', name: 'Name 2', age: 21 },
  { id: 'data3', name: 'Name 3', age: 32 },
  { id: 'data4', name: 'Name 4', age: 42 },
  { id: 'data5', name: 'Name 5', age: 17 },
  { id: 'data6', name: 'Name 6', age: 26 },
  { id: 'data7', name: 'Name 7', age: 19 },
  { id: 'data8', name: 'Name 8', age: 31 }
]

type SortingKeys = 'id'|'name'|'age'

const TableExample = ({ data: initialData }: Pick<TableProps<DataType>, 'data'>) => {
  const [data, setData] = useState<DataType[]>(initialData)
  const [tableState, setTableState] = useState<TableState>({
    pagination: defaultTableStatePagination,
    selection: defaultTableStateSelection
  })

  useEffect(() => {
    setData(initialData)
  }, [initialData])

  const [sorting, setSorting] = useState<[SortingKeys, TableSortingType]>()
  const [sortingKey, ascending] = sorting ?? ['', 'ascending']
  const idMapping = (data: DataType) => data.id

  const sortingFunctions: Record<SortingKeys, Record<TableSortingType, TableSortingFunctionType<DataType>>> = {
    id: {
      ascending: (t1, t2) => t1.id.localeCompare(t2.id),
      descending: (t1, t2) => t1.id.localeCompare(t2.id) * -1,
    },
    name: {
      ascending: (t1, t2) => t1.name.localeCompare(t2.name),
      descending: (t1, t2) => t1.name.localeCompare(t2.name) * -1,
    },
    age: {
      ascending: (t1, t2) => t1.age - t2.age,
      descending: (t1, t2) => (t1.age - t2.age) * -1,
    }
  }

  return (
    <div className={tw('flex flex-col gap-y-12 items-center')}>
      <Table
        stateManagement={[tableState, (newTableState) => {
          setTableState(newTableState)
          setData(data)
        }]}
        data={data}
        identifierMapping={idMapping}
        rowMappingToCells={dataObject => [
          <Span key="id" type="title" className={tw('w-[100px] text-ellipsis overflow-hidden block')}>{dataObject.id}</Span>,
          <Input key="name" value={dataObject.name} onChange={text => {
            setData(data.map(value => value.id === dataObject.id ? { ...dataObject, name: text } : value))
            setSorting(undefined)
          }} />,
          <Input key="age" type="number" value={dataObject.age.toString()} onChange={text => {
            setData(data.map(value => value.id === dataObject.id ? { ...dataObject, age: parseInt(text) } : value))
            setSorting(undefined)
          }} />,
          <Button
            key="delete"
            onClick={() => {
              const newData = data.filter(value => value.id !== dataObject.id)
              setData(newData)
              setTableState(removeFromTableSelection(tableState, [dataObject], data.length, idMapping))
            }}
            variant="textButton"
            color="negative"
          >Delete</Button>
        ]}
        header={[
          <SortButton
            key="headerId"
            ascending={sortingKey === 'id' ? ascending : undefined}
            onClick={newTableSorting => {
              setSorting(['id', newTableSorting])
              setData(data.sort(sortingFunctions.id[newTableSorting]))
            }}
          >
            <Span type="tableHeader">Id</Span>
          </SortButton>,
          <SortButton
            key="name"
            ascending={sortingKey === 'name' ? ascending : undefined}
            onClick={newTableSorting => {
              setSorting(['name', newTableSorting])
              setData(data.sort(sortingFunctions.name[newTableSorting]))
            }}
          >
            <Span type="tableHeader">Name</Span>
          </SortButton>,
          <SortButton
            key="name"
            ascending={sortingKey === 'age' ? ascending : undefined}
            onClick={newTableSorting => {
              setSorting(['age', newTableSorting])
              setData(data.sort(sortingFunctions.age[newTableSorting]))
            }}
          >
            <Span key="age" type="tableHeader">age</Span>
          </SortButton>,
          <></>
        ]}
      />
      <div className={tw('flex flex-row gap-x-2')}>
        <Button
          className={tw('w-auto')}
          onClick={() => {
            const newData = {
              id: Math.random().toString(),
              name: 'Name ' + data.length,
              age: Math.ceil(Math.random() * 100)
            }
            const withNewData = [...data, newData]
            const sorted = sortingKey ? withNewData.sort(sortingFunctions[sortingKey][ascending]) : withNewData
            setData(sorted)
            setTableState(addElementToTable(tableState, sorted, newData, idMapping))
          }}
        >
          {'Add Data'}
        </Button>
        <Button
          color="negative"
          className={tw('w-auto')}
          onClick={() => {
            const selectedData = data.filter((d) => tableState.selection?.currentSelection.includes(idMapping(d)))
            const unselectedData = data.filter((d) => !tableState.selection?.currentSelection.includes(idMapping(d)))
            setData(unselectedData)
            setTableState(removeFromTableSelection(tableState, selectedData, data.length, idMapping))
          }}
        >
          {'Remove all selected'}
        </Button>
      </div>
    </div>
  )
}

export default TableExample
