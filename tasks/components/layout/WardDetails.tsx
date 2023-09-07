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
import {
  emptyWard,
  useWardCreateMutation,
  useWardDeleteMutation,
  useWardUpdateMutation,
  useWardDetailsQuery
} from '../../mutations/ward_mutations'
import { OrganizationOverviewContext } from '../../pages/organizations/[id]'
import { LoadingAndErrorComponent } from '@helpwave/common/components/LoadingAndErrorComponent'
import { useRouter } from 'next/router'

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
  roomsNotOnCreate: string
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
    roomsNotOnCreate: 'Räume können erst hinzugefügt werden, wenn die Station erstellt wurde'
  }
}

export type WardDetailProps = {
  ward?: WardDetailDTO,
  width?: number
}

/**
 * The right side of the organizations/[id].tsx page showing the ward. This screen also affords to edit
 * the Ward
 */
export const WardDetail = ({
  language,
  ward,
  width
}: PropsWithLanguage<WardDetailTranslation, WardDetailProps>) => {
  const translation = useTranslation(language, defaultWardDetailTranslations)

  const context = useContext(OrganizationOverviewContext)
  const router = useRouter()
  const { id } = router.query
  const organizationId = id as string
  const { data, isError, isLoading } = useWardDetailsQuery(context.state.wardId, organizationId)

  const [isEditing, setIsEditing] = useState(false)
  const isCreatingNewWard = context.state.wardId === ''
  const [isShowingConfirmDialog, setIsShowingConfirmDialog] = useState(false)

  const [filledRequired, setFilledRequired] = useState(!isCreatingNewWard)
  const [newWard, setNewWard] = useState<WardDetailDTO>(emptyWard)

  useEffect(() => {
    if (data && !isCreatingNewWard && !isEditing) {
      setNewWard(data)
    }
  }, [data, isCreatingNewWard, isEditing])

  const createWardMutation = useWardCreateMutation(organizationId, (ward) => context.updateContext({ ...context.state, wardId: ward.id }))
  const updateWardMutation = useWardUpdateMutation(organizationId, (ward) => {
    setNewWard({ ...newWard, name: ward.name })
    setIsEditing(false)
  })
  const deleteWardMutation = useWardDeleteMutation(organizationId, () => context.updateContext({ ...context.state, wardId: '' }))

  // the value of how much space a TaskTemplateCard and the surrounding gap requires, given in px
  const minimumWidthOfCards = 200
  const columns = width === undefined ? 3 : Math.max(Math.floor(width / minimumWidthOfCards), 1)

  return (
    <div className={tw('flex flex-col py-4 px-6')}>
      <LoadingAndErrorComponent
        isLoading={!isCreatingNewWard && ((isLoading && !ward) || !newWard.id)}
        hasError={isError && !isCreatingNewWard && !ward}
        loadingProps={{ classname: tw('!h-full') }}
        errorProps={{ classname: tw('!h-full') }}
      >
        <ConfirmDialog
          id="WardDetail-DeleteDialog"
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
          title={isCreatingNewWard ? translation.createWard : translation.updateWard}
          subtitle={isCreatingNewWard ? translation.createWardSubtitle : translation.updateWardSubtitle}
        />
        <div className={tw('max-w-[400px]')}>
          <WardForm
            key={newWard.id}
            ward={newWard}
            onChange={(wardInfo, isValid) => {
              setIsEditing(true)
              setNewWard({ ...newWard, ...wardInfo })
              setFilledRequired(isValid)
            }}
            isShowingErrorsDirectly={!isCreatingNewWard}
          />
        </div>
        {isCreatingNewWard ?
          <Span>{translation.roomsNotOnCreate}</Span>
          : (
          <div className={tw('max-w-[600px] mt-6')}>
            <RoomList/>
          </div>
            )}
        <div className={tw('flex flex-row justify-end mt-6')}>
          <Button
            onClick={() => isCreatingNewWard ? createWardMutation.mutate(newWard) : updateWardMutation.mutate(newWard)}
            disabled={!filledRequired}>
            {isCreatingNewWard ? translation.create : translation.update}
          </Button>
        </div>
        {newWard.id !== '' &&
          (
            <div className={tw('mt-6')}>
              <TaskTemplateWardPreview wardId={newWard.id} columns={columns}/>
            </div>
          )
        }
        <div className={tx('flex flex-col justify-start mt-6', { hidden: isCreatingNewWard })}>
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
      </LoadingAndErrorComponent>
    </div>
  )
}
