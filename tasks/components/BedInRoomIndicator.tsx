import clsx from 'clsx'
import { useTranslation, type PropsForTranslation } from '@helpwave/hightide'

type BedInRoomIndicatorTranslation = {
  bed: string,
  in: string,
}

const defaultBedInRoomIndicatorTranslation = {
  de: {
    bed: 'Bett',
    in: 'in'
  },
  en: {
    bed: 'Bed',
    in: 'in'
  }
}

export type BedInRoomIndicatorProps = {
  bedsInRoom: number,
  /*
    usual numbering of an array starting with 0
   */
  bedPosition: number,
  /*
   Omitting the room name will hide the label above the indicator
   */
  roomName?: string,
}

/**
 * A component for showing the position of a bed within a room
 *
 * Currently, assumes linear ordering
 */
export const BedInRoomIndicator =
  ({
    overwriteTranslation,
    bedsInRoom,
    roomName,
    bedPosition
  }: PropsForTranslation<BedInRoomIndicatorTranslation, BedInRoomIndicatorProps>) => {
    const translation = useTranslation(defaultBedInRoomIndicatorTranslation, overwriteTranslation)

    return (
      <div>
        {roomName !== undefined && (
          <span className="mb-1">
            {`${translation.bed} ${bedPosition + 1} ${translation.in} ${roomName}`}
          </span>
        )}
        <div className="row gap-3">
          {Array.from(Array(bedsInRoom).keys()).map((_, index) => (
            <div key={bedPosition + index}
                 className={clsx(`bg-${bedPosition === index ? 'primary' : 'gray-300'} rounded-sm h-8 w-5`)}
            />
          ))}
        </div>
      </div>
    )
  }
