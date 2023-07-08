import { tw, tx } from '../twind'
import type { ReactElement } from 'react'
import { Checkbox } from './user_input/Checkbox'
import { Pagination } from './Pagination'
import { noop } from './user_input/Input'

export type TableStatePagination = {
  currentPage: number,
  entriesPerPage: number
}
export const defaultTableStatePagination = {
  currentPage: 0,
  entriesPerPage: 5
}

export type TableStateSelection<T> = {
  currentSelection: T[],
  hasSelectedAll: boolean,
  hasSelectedSome: boolean,
  hasSelectedNone: boolean
}

export const defaultTableStateSelection = {
  currentSelection: [],
  hasSelectedAll: false,
  hasSelectedSome: false,
  hasSelectedNone: true
}

export type TableState = {
  pagination?: TableStatePagination,
  selection?: {
    /**
     * The mapped ids of the dataType
     */
    currentSelection: string[],
    hasSelectedAll: boolean,
    hasSelectedSome: boolean,
    hasSelectedNone: boolean
  }
}

type IdentifierMapping<T> = (dataObject: T) => string

export const isDataObjectSelected = <T, >(tableState: TableState, dataObject: T, identifierMapping: IdentifierMapping<T>) => {
  if (!tableState.selection) {
    return false
  }

  return !!tableState.selection.currentSelection.find(value => value.localeCompare(identifierMapping(dataObject)) === 0)
}

export const pageForItem = <T, >(data: T[], item: T, entriesPerPage: number, identifierMapping: IdentifierMapping<T>) => {
  const index = data.findIndex(value => identifierMapping(value) === identifierMapping(item))
  if (index) {
    return Math.floor(index / entriesPerPage)
  }
  console.error("item doesn't exist on data", item)
  return 0
}

export const addElementTableStateUpdate = <T, >(tableState: TableState, data: T[], dataObject: T, identifierMapping: IdentifierMapping<T>) => {
  return {
    ...tableState,
    pagination: tableState.pagination ? { ...tableState.pagination, currentPage: pageForItem(data, dataObject, tableState.pagination.entriesPerPage, identifierMapping) } : undefined,
    selection: tableState.selection ? { ...tableState.selection, hasSelectedAll: false, hasSelectedSome: tableState.selection.hasSelectedAll || tableState.selection.hasSelectedSome } : undefined
  }
}

/**
 * data length before delete
 */
export const removeFromTableSelection = <T, >(tableState: TableState, deletedObjects: T[], dataLength: number, identifierMapping: IdentifierMapping<T>): TableState => {
  if (!tableState.selection) {
    return tableState
  }

  const deletedObjectIds = deletedObjects.map(identifierMapping)
  const currentSelection = tableState.selection.currentSelection.filter((value) => !deletedObjectIds.includes(value))
  dataLength -= currentSelection.length

  return {
    ...tableState,
    selection: {
      currentSelection,
      hasSelectedAll: currentSelection.length === dataLength && dataLength !== 0,
      hasSelectedSome: currentSelection.length > 0 && currentSelection.length !== dataLength,
      hasSelectedNone: currentSelection.length === 0,
    },
    pagination: tableState.pagination ? {
      ...tableState.pagination,
      currentPage: Math.min(Math.max(Math.ceil(dataLength / tableState.pagination.entriesPerPage) - 1, 0), tableState.pagination.currentPage)
    } : undefined
  }
}

export const changeTableSelectionSingle = <T, >(tableState: TableState, dataObject: T, dataLength: number, identifierMapping: IdentifierMapping<T>) => {
  if (!tableState.selection) {
    return tableState
  }

  const hasSelectedObject = isDataObjectSelected(tableState, dataObject, identifierMapping)
  let currentSelection = [...tableState.selection.currentSelection, identifierMapping(dataObject)] // case !hasSelectedObject
  if (hasSelectedObject) {
    currentSelection = tableState.selection.currentSelection.filter(value => value.localeCompare(identifierMapping(dataObject)) !== 0)
  }

  return {
    ...tableState,
    selection: {
      currentSelection,
      hasSelectedAll: currentSelection.length === dataLength,
      hasSelectedSome: currentSelection.length > 0 && currentSelection.length !== dataLength,
      hasSelectedNone: currentSelection.length === 0,
    }
  }
}

const changeTableSelectionAll = <T, >(tableState: TableState, data: T[], identifierMapping: IdentifierMapping<T>) => {
  if (!tableState.selection) {
    return tableState
  }

  if (data.length === 0) {
    return {
      ...tableState,
      selection: {
        currentSelection: [],
        hasSelectedAll: false,
        hasSelectedSome: false,
        hasSelectedNone: true
      }
    }
  }

  const hasSelectedAll = !(tableState.selection.hasSelectedSome || tableState.selection.hasSelectedAll)
  return {
    ...tableState,
    selection: {
      currentSelection: hasSelectedAll ? data.map(identifierMapping) : [],
      hasSelectedAll,
      hasSelectedSome: false,
      hasSelectedNone: !hasSelectedAll
    }
  }
}

export type TableSortingType = 'ascending' | 'descending'
export type TableSortingFunctionType<T> = (t1:T, t2:T)=> number

export type TableProps<T> = {
  data: T[],
  /**
   * When using selection or pagination
   */
  stateManagement?: [TableState, (tableState: TableState) => void],
  identifierMapping: IdentifierMapping<T>,
  /**
   * Only the cell itself no boilerplate <tr> or <th> required
   */
  header?: ReactElement[],
  /**
   * Only the cells of the row no boilerplate <tr> or <td> required
   */
  rowMappingToCells: (dataObject: T) => ReactElement[],
  sorting?: [TableSortingFunctionType<T>, TableSortingType],
  /**
   * Always go to the page of this element
   */
  focusElement?: T
}

/*  Possible extension for better customization
    * Map each element to the displayed row
    * make sure to wrap it in the <tr> and <td> you require
    rowMappingToHTMLRow?: (dataObject: T) => ReactElement
 */

/**
 * A Basic stateless reusable table
 * The state must be handled and saved with the updateTableState method
 */
export const Table = <T, >({
  data,
  stateManagement = [{}, noop],
  identifierMapping,
  header,
  rowMappingToCells,
  sorting,
  focusElement
}: TableProps<T>) => {
  const sortedData = [...data]
  if (sorting) {
    const [sortingFunction, sortingType] = sorting
    sortedData.sort((a, b) => sortingFunction(a, b) * (sortingType === 'ascending' ? 1 : -1))
  }
  let currentPage = 0
  let pageCount = 1
  let entriesPerPage = 5
  const [tableState, updateTableState] = stateManagement

  if (tableState?.pagination) {
    if (tableState.pagination.entriesPerPage < 1) {
      console.error('tableState.pagination.entriesPerPage must be >= 1', tableState.pagination.entriesPerPage)
    }
    entriesPerPage = Math.max(1, tableState.pagination.entriesPerPage)
    pageCount = Math.ceil(sortedData.length / entriesPerPage)

    if (tableState.pagination.currentPage < 0 || tableState.pagination.currentPage >= pageCount) {
      console.error('tableState.pagination.currentPage < 0 || tableState.pagination.currentPage >= pageCount must be fullfilled',
        [`pageCount: ${pageCount}`, `tableState.pagination.currentPage: ${tableState.pagination.currentPage}`])
    } else {
      currentPage = tableState.pagination.currentPage
    }
  }

  if (focusElement) {
    currentPage = pageForItem(sortedData, focusElement, entriesPerPage, identifierMapping)
  }

  const shownElements = sortedData.slice(currentPage * entriesPerPage, Math.min(sortedData.length, (currentPage + 1) * entriesPerPage))

  const headerRow = tw('border-b-2 border-gray-300')
  const headerPaddingHead = tw('pb-2')
  const headerPaddingBody = 'pt-2'
  const cellPadding = 'py-1 px-2'

  return (
    <div className={tw('flex flex-col gap-y-4 items-center')}>
      <table>
        <thead>
        <tr className={headerRow}>
          {header && tableState.selection && (
            <th className={headerPaddingHead}>
              <Checkbox
                checked={tableState.selection.hasSelectedSome ? 'indeterminate' : tableState.selection.hasSelectedAll}
                onChange={() => updateTableState(changeTableSelectionAll(tableState, data, identifierMapping))}
              />
            </th>
          )}
          {header && header.map((value, index) =>
            <th key={`tableHeader${index}`} className={headerPaddingHead}>{value}</th>
          )}
        </tr>
        </thead>
        <tbody>
        {shownElements.map((value, rowIndex) => (
          <tr key={identifierMapping(value)} >
            {tableState.selection && (
              <td className={tx(cellPadding, { [headerPaddingBody]: rowIndex === 0 })}>
                <Checkbox
                  checked={isDataObjectSelected(tableState, value, identifierMapping)}
                  onChange={() => {
                    updateTableState(changeTableSelectionSingle(tableState, value, data.length, identifierMapping))
                  }}
                />
              </td>
            )}
            {rowMappingToCells(value).map((value1, index) => <td key={index} className={tx(cellPadding, { [headerPaddingBody]: rowIndex === 0 })}>{value1}</td>)}
          </tr>
        ))}
        </tbody>
      </table>
      {tableState.pagination &&
        <Pagination page={currentPage} numberOfPages={pageCount} onPageChanged={page => updateTableState({ ...tableState, pagination: { entriesPerPage, currentPage: page } })}/>
      }
    </div>
  )
}
