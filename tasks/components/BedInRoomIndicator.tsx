import { tw } from '@helpwave/common/twind'
import { useTranslation, type PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import { Span } from '@helpwave/common/components/Span'

type BedInRoomIndicatorTranslation = {
  bed: string,
  in: string
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
  roomName?: string
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
          <Span className={tw('mb-1')}>
            {`${translation.bed} ${bedPosition + 1} ${translation.in} ${roomName}`}
          </Span>
        )}
        <div className={tw(`flex flex-row gap-3`)}>
          {Array.from(Array(bedsInRoom).keys()).map((_, index) => (
            <div key={bedPosition + index}
                 className={tw(`bg-${bedPosition === index ? 'hw-primary-400' : 'gray-300'} rounded-sm h-8 w-5`)}
            />
          ))}
        </div>
      </div>
    )
  }
