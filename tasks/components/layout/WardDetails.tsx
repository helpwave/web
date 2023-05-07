import { tw, tx } from '@helpwave/common/twind'
import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsWithLanguage } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { useState } from 'react'
import { ColumnTitle } from '../ColumnTitle'
import { Button } from '@helpwave/common/components/Button'
import { ConfirmDialog } from '@helpwave/common/components/modals/ConfirmDialog'
import { RoomList } from '../RoomList'
import { WardForm } from '../WardForm'
import { Span } from '@helpwave/common/components/Span'
import { TaskTemplateWardPreview } from '../TaskTemplateWardPreview'
import { useTaskTemplateQuery } from '../../mutations/personal_task_template_mutations'

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

type Room = {
  bedCount: number,
  name: string
}

type WardDTO = {
  id: string,
  name: string,
  rooms: Room[],
  unscheduled: number,
  inProgress: number,
  done: number
}

export type WardDetailProps = {
  ward: WardDTO,
  onCreate: (ward: WardDTO) => void,
  onUpdate: (ward: WardDTO) => void,
  onDelete: (ward: WardDTO) => void
}

/**
 * The right side of the organizations/[uuid].tsx page showing the ward. This screen also affords to edit
 * the Ward
 */
export const WardDetail = ({
  language,
  ward,
  onCreate,
  onUpdate,
  onDelete,
}: PropsWithLanguage<WardDetailTranslation, WardDetailProps>) => {
  const translation = useTranslation(language, defaultWardDetailTranslations)
  const isCreatingNewOrganization = ward.id === ''

  const [isShowingConfirmDialog, setIsShowingConfirmDialog] = useState(false)

  const [filledRequired, setFilledRequired] = useState(!isCreatingNewOrganization)
  const [newWard, setNewWard] = useState<WardDTO>(ward)

  const { data, isLoading, isError } = useTaskTemplateQuery('wardTaskTemplates')

  return (
    <div className={tw('flex flex-col py-4 px-6 w-5/6')}>
      <ConfirmDialog
        title={translation.deleteConfirmText}
        description={translation.dangerZoneText}
        isOpen={isShowingConfirmDialog}
        onCancel={() => setIsShowingConfirmDialog(false)}
        onBackgroundClick={() => setIsShowingConfirmDialog(false)}
        onConfirm={() => {
          setIsShowingConfirmDialog(false)
          onDelete(newWard)
        }}
        confirmType="negative"
      />
      <ColumnTitle
        title={isCreatingNewOrganization ? translation.createWard : translation.updateWard}
        subtitle={isCreatingNewOrganization ? translation.createWardSubtitle : translation.updateWardSubtitle}
      />
      <WardForm
        ward={newWard}
        usedWardNames={newWard.rooms.map(ward => ward.name)}
        onChange={(wardInfo, isValid) => {
          setNewWard({ ...newWard, ...wardInfo })
          setFilledRequired(isValid)
        }}
        isShowingErrorsDirectly={!isCreatingNewOrganization}
      />
      <div className={tw('mt-6')}>
        <RoomList
          rooms={newWard.rooms}
          onChange={(rooms) => setNewWard({ ...newWard, rooms })}
        />
      </div>
      <div className={tw('flex flex-row justify-end mt-6')}>
        <Button
          className={tw('w-1/2')}
          onClick={() => isCreatingNewOrganization ? onCreate(newWard) : onUpdate(newWard)}
          disabled={!filledRequired}>
          {isCreatingNewOrganization ? translation.create : translation.update}
        </Button>
      </div>
      { newWard.id !== '' &&
        (
          <div className={tw('mt-6')}>
            {/* TODO show something here */}
            {(isLoading || isError) && ''}
            {data && <TaskTemplateWardPreview taskTemplates={data} wardID={newWard.id} />}
          </div>
        )
      }
      <div className={tx('flex flex-col justify-start mt-6', { hidden: isCreatingNewOrganization })}>
        <Span type="subsectionTitle">{translation.dangerZone}</Span>
        <Span type="description">{translation.dangerZoneText}</Span>
        <div>
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
    </div>
  )
}
