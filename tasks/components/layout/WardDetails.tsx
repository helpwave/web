import { useContext, useEffect, useState } from 'react'
import clsx from 'clsx'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import { useTranslation, type PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import { SolidButton, TextButton } from '@helpwave/common/components/Button'
import { ConfirmDialog } from '@helpwave/common/components/modals/ConfirmDialog'
import { LoadingAndErrorComponent } from '@helpwave/common/components/LoadingAndErrorComponent'
import {
  useWardCreateMutation,
  useWardDeleteMutation,
  useWardUpdateMutation,
  useWardDetailsQuery
} from '@helpwave/api-services/mutations/tasks/ward_mutations'
import type { WardDetailDTO } from '@helpwave/api-services/types/tasks/wards'
import { emptyWard } from '@helpwave/api-services/types/tasks/wards'
import { ColumnTitle } from '../ColumnTitle'
import { RoomList } from '../RoomList'
import { WardForm } from '../WardForm'
import { TaskTemplateWardPreview } from '../TaskTemplateWardPreview'
import { OrganizationOverviewContext } from '@/pages/organizations/[organizationId]'

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
  update: string,
  roomsNotOnCreate: string,
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
    update: 'Update',
    roomsNotOnCreate: 'Rooms can only be added once the ward is created'
  },
  de: {
    updateWard: 'Station ändern',
    updateWardSubtitle: 'Hier kannst du die Details der Station ändern.',
    createWard: 'Station erstellen',
    createWardSubtitle: 'Hier setzt du die Details der Station.',
    dangerZone: 'Risikobereich',
    dangerZoneText: 'Das Löschen einer Station ist permanent und kann nicht rückgängig gemacht werden. Vorsicht!',
    deleteConfirmText: 'Wollen Sie wirklich diese Station löschen?',
    deleteWard: 'Station löschen',
    create: 'Erstellen',
    update: 'Ändern',
    roomsNotOnCreate: 'Zimmer können erst hinzugefügt werden, wenn die Station erstellt wurde'
  }
}

export type WardDetailProps = {
  organizationId: string,
  ward?: WardDetailDTO,
  width?: number,
}

/**
 * The right side of the organizations/[organizationId].tsx page showing the ward. This screen also affords to edit
 * the Ward
 */
export const WardDetail = ({
  overwriteTranslation,
  organizationId,
  ward,
  width
}: PropsForTranslation<WardDetailTranslation, WardDetailProps>) => {
  const translation = useTranslation(defaultWardDetailTranslations, overwriteTranslation)

  const context = useContext(OrganizationOverviewContext)
  const { data, isError, isLoading } = useWardDetailsQuery(context.state.wardId, organizationId)

  const isCreatingNewWard = context.state.wardId === ''
  const [isShowingConfirmDialog, setIsShowingConfirmDialog] = useState(false)

  const [filledRequired, setFilledRequired] = useState(!isCreatingNewWard)
  const [newWard, setNewWard] = useState<WardDetailDTO>(emptyWard)

  useEffect(() => {
    if (data && !isCreatingNewWard) {
      setNewWard(data)
    }
  }, [data, isCreatingNewWard])

  const createWardMutation = useWardCreateMutation(organizationId, (ward) => context.updateContext({ ...context.state, wardId: ward.id }))
  const updateWardMutation = useWardUpdateMutation(organizationId, (ward) => {
    setNewWard({ ...newWard, name: ward.name })
  })
  const deleteWardMutation = useWardDeleteMutation(organizationId, () => context.updateContext({ ...context.state, wardId: '' }))

  // the value of how much space a TaskTemplateCard and the surrounding gap requires, given in px
  const minimumWidthOfCards = 200
  const columns = width === undefined ? 3 : Math.max(Math.floor(width / minimumWidthOfCards), 1)

  return (
    <div className={clsx('col py-4 px-6')}>
      <LoadingAndErrorComponent
        isLoading={!isCreatingNewWard && ((isLoading && !ward) || !newWard.id)}
        hasError={isError && !isCreatingNewWard && !ward}
        loadingProps={{ classname: clsx('!h-full') }}
        errorProps={{ classname: clsx('!h-full') }}
      >
        <ConfirmDialog
          id="WardDetail-DeleteDialog"
          titleText={translation.deleteConfirmText}
          descriptionText={translation.dangerZoneText}
          isOpen={isShowingConfirmDialog}
          onCancel={() => setIsShowingConfirmDialog(false)}
          onBackgroundClick={() => setIsShowingConfirmDialog(false)}
          onCloseClick={() => setIsShowingConfirmDialog(false)}
          onConfirm={() => {
            setIsShowingConfirmDialog(false)
            deleteWardMutation.mutate(newWard.id)
          }}
          confirmType="negative"
        />
        <ColumnTitle
          title={isCreatingNewWard ? translation.createWard : translation.updateWard}
          subtitle={isCreatingNewWard ? translation.createWardSubtitle : translation.updateWardSubtitle}
        />
        <div className={clsx('max-w-[400px]')}>
          <WardForm
            key={newWard.id}
            ward={newWard}
            onChange={(wardInfo, isValid) => {
              setNewWard({ ...newWard, ...wardInfo })
              setFilledRequired(isValid)
            }}
            isShowingErrorsDirectly={!isCreatingNewWard}
          />
        </div>
        {isCreatingNewWard ?
          <span>{translation.roomsNotOnCreate}</span>
          : (
          <div className={clsx('max-w-[600px] mt-6')}>
            <RoomList/>
          </div>
            )}
        <div className={clsx('row justify-end mt-6')}>
          <SolidButton
            onClick={() => isCreatingNewWard ? createWardMutation.mutate(newWard) : updateWardMutation.mutate(newWard)}
            disabled={!filledRequired}>
            {isCreatingNewWard ? translation.create : translation.update}
          </SolidButton>
        </div>
        {newWard.id !== '' &&
          (
            <div className={clsx('mt-6')}>
              <TaskTemplateWardPreview wardId={newWard.id} columns={columns}/>
            </div>
          )
        }
        <div className={clsx('col justify-start mt-6', { hidden: isCreatingNewWard })}>
          <span className={clsx('textstyle-title-normal')}>{translation.dangerZone}</span>
          <span className={clsx('textstyle-description')}>{translation.dangerZoneText}</span>
          <TextButton
            onClick={() => setIsShowingConfirmDialog(true)}
            className="px-0 font-bold justify-start"
            color="negative"
          >
            {translation.deleteWard}
          </TextButton>
        </div>
      </LoadingAndErrorComponent>
    </div>
  )
}
