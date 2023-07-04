import { tw, tx } from '@helpwave/common/twind'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { useContext, useEffect, useState } from 'react'
import { ColumnTitle } from '../ColumnTitle'
import { Button } from '@helpwave/common/components/Button'
import { ConfirmDialog } from '@helpwave/common/components/modals/ConfirmDialog'
import { RoomList } from '../RoomList'
import { WardForm } from '../WardForm'
import { Span } from '@helpwave/common/components/Span'
import { TaskTemplateWardPreview } from '../TaskTemplateWardPreview'
import type { WardDetailDTO } from '../../mutations/ward_mutations'
import { useRoomCreateMutation, useRoomDeleteMutation, useRoomUpdateMutation } from '../../mutations/room_mutations'
import {
  emptyWard, emptyWardOverview,
  useWardCreateMutation,
  useWardDeleteMutation,
  useWardUpdateMutation,
  useWardDetailsQuery
} from '../../mutations/ward_mutations'
import { OrganizationOverviewContext } from '../../pages/organizations/[uuid]'

type WardDetailTranslation = {
  updateWard: string,
  updateWardSubtitle: string,
  createWard: string,
  createWardSubtitle: string,
  dangerZone: string,
  dangerZoneText: string,
  deleteConfirmText: string,
  deleteWard: string,
  create: string,
  update: string
}

const defaultWardDetailTranslations: Record<Languages, WardDetailTranslation> = {
  en: {
    updateWard: 'Update Ward',
    updateWardSubtitle: 'Here you can update details about the ward such as rooms',
    createWard: 'Create Ward',
    createWardSubtitle: 'Here you set the details of the new ward',
    dangerZone: 'Danger Zone',
    dangerZoneText: 'Deleting the ward is a permanent action and cannot be undone. Be careful!',
    deleteConfirmText: 'Do you really want to delete this ward?',
    deleteWard: 'Delete ward',
    create: 'Create',
    update: 'Update'
  },
  de: {
    updateWard: 'Station ändern',
    updateWardSubtitle: 'Hier kannst du die Details der Station ändern.',
    createWard: 'Station erstellen',
    createWardSubtitle: 'Hier setzt du die Details der Station.',
    dangerZone: 'Gefahren Zone',
    dangerZoneText: 'Das Löschen einer Station is permanent und kann nicht rückgängig gemacht werden. Vorsicht!',
    deleteConfirmText: 'Wollen Sie wirklich diese Station löschen?',
    deleteWard: 'Station Löschen',
    create: 'Erstellen',
    update: 'Ändern'
  }
}

export type WardDetailProps = {
  ward?: WardDetailDTO,
  width?: number
}

/**
 * The right side of the organizations/[uuid].tsx page showing the ward. This screen also affords to edit
 * the Ward
 */
export const WardDetail = ({
  language,
  ward,
  width
}: PropsWithLanguage<WardDetailTranslation, WardDetailProps>) => {
  const context = useContext(OrganizationOverviewContext)
  const { data, isError, isLoading } = useWardDetailsQuery(context.state.wardID)
  ward ??= data
  const translation = useTranslation(language, defaultWardDetailTranslations)
  const isCreatingNewOrganization = !ward?.id

  const [isShowingConfirmDialog, setIsShowingConfirmDialog] = useState(false)

  const [filledRequired, setFilledRequired] = useState(!isCreatingNewOrganization)
  const [newWard, setNewWard] = useState<WardDetailDTO>(emptyWard)
  useEffect(() => data ? setNewWard(data) : undefined, [data])

  const createWardMutation = useWardCreateMutation((ward) => context.updateContext({ ...context.state, wardID: ward.id }))
  const updateWardMutation = useWardUpdateMutation((ward) => {
    context.updateContext({ ...context.state, wardID: ward.id })
    setNewWard({ ...newWard, name: ward.name })
  })
  const deleteWardMutation = useWardDeleteMutation(() => context.updateContext({ ...context.state, wardID: undefined }))

  // the value of how much space a TaskTemplateCard and the surrounding gap requires, given in px
  const minimumWidthOfCards = 200
  const columns = width === undefined ? 3 : Math.max(Math.floor(width / minimumWidthOfCards), 1)

  // TODO add view for loading
  if (isLoading && ward) {
    return <div>Loading Widget</div>
  }

  // TODO add view for error or error handling
  if (isError && ward) {
    return <div>Error Message</div>
  }

  return (
    <div className={tw('flex flex-col py-4 px-6')}>
      <ConfirmDialog
        title={translation.deleteConfirmText}
        description={translation.dangerZoneText}
        isOpen={isShowingConfirmDialog}
        onCancel={() => setIsShowingConfirmDialog(false)}
        onBackgroundClick={() => setIsShowingConfirmDialog(false)}
        onConfirm={() => {
          setIsShowingConfirmDialog(false)
          deleteWardMutation.mutate(newWard.id)
        }}
        confirmType="negative"
      />
      <ColumnTitle
        title={isCreatingNewOrganization ? translation.createWard : translation.updateWard}
        subtitle={isCreatingNewOrganization ? translation.createWardSubtitle : translation.updateWardSubtitle}
      />
      <div className={tw('max-w-[400px]')}>
        <WardForm
          ward={newWard}
          usedWardNames={newWard.rooms.map(ward => ward.name)}
          onChange={(wardInfo, isValid) => {
            setNewWard({ ...newWard, ...wardInfo })
            setFilledRequired(isValid)
          }}
          isShowingErrorsDirectly={!isCreatingNewOrganization}
        />
      </div>
      <div className={tw('max-w-[600px] mt-6')}>
        <RoomList/>
      </div>
      <div className={tw('flex flex-row justify-end mt-6')}>
        <Button
          onClick={() => isCreatingNewOrganization ? createWardMutation.mutate(newWard) : updateWardMutation.mutate(newWard)}
          disabled={!filledRequired}>
          {isCreatingNewOrganization ? translation.create : translation.update}
        </Button>
      </div>
      {newWard.id !== '' &&
        (
          <div className={tw('mt-6')}>
            <TaskTemplateWardPreview wardID={newWard.id} columns={columns}/>
          </div>
        )
      }
      <div className={tx('flex flex-col justify-start mt-6', { hidden: isCreatingNewOrganization })}>
        <Span type="subsectionTitle">{translation.dangerZone}</Span>
        <Span type="description">{translation.dangerZoneText}</Span>
        <Button
          onClick={() => setIsShowingConfirmDialog(true)}
          className={tw('px-0 font-bold text-left')}
          color="negative"
          variant="textButton"
        >
          {translation.deleteWard}
        </Button>
      </div>
    </div>
  )
}
