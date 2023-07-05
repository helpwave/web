import { tw, tx } from '../twind'
import type { ReactElement } from 'react'
import { Checkbox } from './user_input/Checkbox'
import { Pagination } from './Pagination'

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

/**
 * data length before delete
 */
export const removeFromTableSelection = <T, >(tableState: TableState, dataObject: T, dataLength: number, identifierMapping: IdentifierMapping<T>) => {
  if (!tableState.selection) {
    return tableState
  }

  const currentSelection = tableState.selection.currentSelection.filter(value => value.localeCompare(identifierMapping(dataObject)) !== 0)

  dataLength -= 1
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

export type TableProps<T> = {
  data: T[],
  /**
   * When using selection or pagination
   */
  tableState: TableState,
  identifierMapping: IdentifierMapping<T>,
  updateTableState: (tableState: TableState) => void,
  /**
   * Only the cell itself no boilerplate <tr> or <th> required
   */
  header?: ReactElement[],
  /**
   * Only the cells of the row no boilerplate <tr> or <td> required
   */
  rowMappingToCells: (dataObject: T) => ReactElement[]
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
  tableState,
  updateTableState,
  identifierMapping,
  header,
  rowMappingToCells
}: TableProps<T>) => {
  let shownElements = data
  let currentPage = 0
  let pageCount = 1
  let entriesPerPage = 5
  if (tableState.pagination) {
    if (tableState.pagination.entriesPerPage < 1) {
      console.error('tableState.pagination.entriesPerPage must be >= 1', tableState.pagination.entriesPerPage)
    }
    entriesPerPage = Math.max(1, tableState.pagination.entriesPerPage)
    pageCount = Math.ceil(data.length / entriesPerPage)

    if (tableState.pagination.currentPage < 0 || tableState.pagination.currentPage >= pageCount) {
      console.error('tableState.pagination.currentPage < 0 || tableState.pagination.currentPage >= pageCount must be fullfilled',
        [`pageCount: ${pageCount}`, `tableState.pagination.currentPage: ${tableState.pagination.currentPage}`])
    } else {
      currentPage = tableState.pagination.currentPage
    }

    shownElements = data.slice(currentPage * entriesPerPage, Math.min(data.length, (currentPage + 1) * entriesPerPage))
  }

  const border = tw('border-b-2 border-gray-300')
  const headerPaddingHead = tw('pb-2')
  const headerPaddingBody = 'pt-2'
  const cellPadding = 'py-1 px-2'

  return (
    <div className={tw('flex flex-col gap-y-4 items-center')}>
      <table>
        <thead>
        <tr className={border}>
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
