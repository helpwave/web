import { useContext, useEffect, useState } from 'react'
import clsx from 'clsx'
import type { Translation } from '@helpwave/hightide'
import { TextButton } from '@helpwave/hightide'
import { ConfirmDialog } from '@helpwave/hightide'
import {
  LoadingAndErrorComponent,
  type PropsForTranslation,
  SolidButton,
  useTranslation
} from '@helpwave/hightide'
import {
  useWardCreateMutation,
  useWardDeleteMutation,
  useWardDetailsQuery,
  useWardUpdateMutation
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

const defaultWardDetailTranslations: Translation<WardDetailTranslation> = {
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
  ward?: WardDetailDTO,
}

/**
 * The right side of the organizations/[organizationId].tsx page showing the ward. This screen also affords to edit
 * the Ward
 */
export const WardDetail = ({
                             overwriteTranslation,
                             ward,
                           }: PropsForTranslation<WardDetailTranslation, WardDetailProps>) => {
  const translation = useTranslation([defaultWardDetailTranslations], overwriteTranslation)

  const context = useContext(OrganizationOverviewContext)
  const { data, isError, isLoading } = useWardDetailsQuery(context.state.wardId)

  const isCreatingNewWard = context.state.wardId === ''
  const [isShowingConfirmDialog, setIsShowingConfirmDialog] = useState(false)

  const [filledRequired, setFilledRequired] = useState(!isCreatingNewWard)
  const [newWard, setNewWard] = useState<WardDetailDTO>(emptyWard)

  useEffect(() => {
    if (data && !isCreatingNewWard) {
      setNewWard(data)
    }
  }, [data, isCreatingNewWard])

  const createWardMutation = useWardCreateMutation({
    onSuccess: (ward) => context.updateContext({
      ...context.state,
      wardId: ward.id
    })
  })
  const updateWardMutation = useWardUpdateMutation()
  const deleteWardMutation = useWardDeleteMutation()

  return (
    <div className="col py-4 px-6">
      <LoadingAndErrorComponent
        isLoading={!isCreatingNewWard && ((isLoading && !ward) || !newWard.id)}
        hasError={isError && !isCreatingNewWard && !ward}
        className="h-full"
      >
        <ConfirmDialog
          isOpen={isShowingConfirmDialog}
          titleElement={translation('deleteConfirmText')}
          description={translation('dangerZoneText')}

          onCancel={() => setIsShowingConfirmDialog(false)}
          onConfirm={() => {
            setIsShowingConfirmDialog(false)
            deleteWardMutation.mutate(newWard.id)
          }}
          confirmType="negative"
          className="z-300"
        />
        <ColumnTitle
          title={isCreatingNewWard ? translation('createWard') : translation('updateWard')}
          description={isCreatingNewWard ? translation('createWardSubtitle') : translation('updateWardSubtitle')}
        />
        <div className="max-w-[300px]">
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
          <span className="mt-6">{translation('roomsNotOnCreate')}</span>
          : (
            <div className="mt-6">
              <RoomList/>
            </div>
          )}
        <div className="row justify-end mt-6">
          <SolidButton
            onClick={() => isCreatingNewWard ? createWardMutation.mutate(newWard) : updateWardMutation.mutate(newWard)}
            disabled={!filledRequired}>
            {isCreatingNewWard ? translation('create') : translation('update')}
          </SolidButton>
        </div>
        {newWard.id !== '' &&
          (
            <div className="mt-6">
              <TaskTemplateWardPreview wardId={newWard.id}/>
            </div>
          )
        }
        <div className={clsx('col justify-start mt-6', { hidden: isCreatingNewWard })}>
          <ColumnTitle
            title={translation('dangerZone')}
            description={translation('dangerZoneText')}
            type="subtitle"
          />
          <TextButton
            onClick={() => setIsShowingConfirmDialog(true)}
            color="negative"
            className="w-min"
          >
            {translation('deleteWard')}
          </TextButton>
        </div>
      </LoadingAndErrorComponent>
    </div>
  )
}
