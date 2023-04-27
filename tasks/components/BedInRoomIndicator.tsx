import { tw } from '@helpwave/common/twind/index'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'

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
    language,
    bedsInRoom,
    roomName,
    bedPosition
  }: PropsWithLanguage<BedInRoomIndicatorTranslation, BedInRoomIndicatorProps>) => {
    const translation = useTranslation(language, defaultBedInRoomIndicatorTranslation)

    return (
      <div>
        {roomName !== undefined && <span className={tw('mb-1')}>{`${translation.bed} ${bedPosition + 1} ${translation.in} ${roomName}`}</span>}
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
