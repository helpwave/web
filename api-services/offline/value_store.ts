import { range } from '@helpwave/common/util/array'
import type { Property } from '../types/properties/property'
import { emptyProperty } from '../types/properties/property'
import type { AttachedProperty } from '../types/properties/attached_property'
import type { OrganizationMinimalDTO } from '../types/users/organizations'
import type { WardWithOrganizationIdDTO } from '../types/tasks/wards'
import type { RoomWithWardId } from '../types/tasks/room'
import type { BedWithRoomId } from '../types/tasks/bed'
import type { SubTaskDTO, TaskDTO } from '../types/tasks/task'
import type { OrganizationMember } from '../types/users/organization_member'
import type { TaskTemplateDTO } from '../types/tasks/tasks_templates'

const initialProperties: Property[] = [
  {
    ...emptyProperty,
    id: 'property1',
    name: 'Birth Date',
    fieldType: 'date',
  },
  {
    ...emptyProperty,
    id: 'property2',
    name: 'Weight',
    fieldType: 'number',
  },
  {
    ...emptyProperty,
    id: 'property3',
    name: 'Gender',
    fieldType: 'singleSelect',
    selectData: {
      isAllowingFreetext: true,
      options: [
        {
          id: '1',
          name: 'male',
          isCustom: false
        },
        {
          id: '2',
          name: 'female',
          isCustom: false
        },
        {
          id: '3',
          name: 'divers',
          isCustom: false
        },
        {
          id: '4',
          name: 'other',
          isCustom: false
        },
      ],
    },
  },
  {
    ...emptyProperty,
    id: 'property4',
    name: 'Round Notes',
    fieldType: 'text',
  },
  {
    ...emptyProperty,
    id: 'property5',
    name: 'Admission Date',
    fieldType: 'date',
  },
  {
    ...emptyProperty,
    id: 'property6',
    name: 'Diagnosis',
    fieldType: 'multiSelect',
    selectData: {
      isAllowingFreetext: true,
      options: [
        {
          id: '1',
          name: 'Diabetes',
          isCustom: false
        },
        {
          id: '2',
          name: 'Depression',
          isCustom: false
        },
        {
          id: '3',
          name: 'Allergy',
          isCustom: false
        },
        {
          id: '4',
          name: 'Cancer',
          isCustom: false
        },
        {
          id: '5',
          name: 'Obesity',
          isCustom: false
        },
      ],
    },
  },
  {
    ...emptyProperty,
    id: 'property7',
    name: 'Additional Care',
    fieldType: 'checkbox',
  },
  {
    ...emptyProperty,
    id: 'property8',
    name: 'Advisor',
    fieldType: 'text',
    subjectType: 'task'
  },
  {
    ...emptyProperty,
    id: 'property9',
    name: 'Priority',
    fieldType: 'number',
    subjectType: 'task'
  },
]
const initialAttachedProperties: AttachedProperty[] = []
const initialOrganizations: OrganizationMinimalDTO[] = [
  {
    id: 'organization',
    email: 'test@helpwave.de',
    shortName: 'hw-test',
    longName: 'helpwave test organizations',
    avatarURL: 'https://helpwave.de/favicon.ico',
    isPersonal: true,
    isVerified: true,
  }
]
const initialMembers: UserValueStore[] = [
  { id: 'user1', name: 'You', nickName: 'You', email: 'test@helpwave.de', avatarURL: 'https://helpwave.de/favicon.ico' },
  { id: 'user2', name: 'Max', nickName: 'Max', email: 'test@helpwave.de', avatarURL: 'https://helpwave.de/favicon.ico' },
  { id: 'user3', name: 'John', nickName: 'Doe', email: 'test@helpwave.de', avatarURL: 'https://helpwave.de/favicon.ico' },
  { id: 'user4', name: 'Testine Test', nickName: 'Testine', email: 'test@helpwave.de', avatarURL: 'https://helpwave.de/favicon.ico' },
]
const initialWards: WardWithOrganizationIdDTO[] = [
  {
    id: 'ward1',
    organizationId: 'organization',
    name: 'Intensive Care'
  },
  {
    id: 'ward2',
    organizationId: 'organization',
    name: 'Radiology'
  }
]
const initialRooms: RoomWithWardId[] = [
  {
    id: 'room1',
    name: 'Room 1',
    wardId: 'ward1'
  },
  {
    id: 'room2',
    name: 'Room 2',
    wardId: 'ward1'
  },
  {
    id: 'room3',
    name: 'Room 3',
    wardId: 'ward1'
  },
  {
    id: 'room4',
    name: 'Room 4',
    wardId: 'ward1'
  },
  {
    id: 'room5',
    name: 'Room 1',
    wardId: 'ward2'
  },
  {
    id: 'room6',
    name: 'Room 2',
    wardId: 'ward2'
  },
  {
    id: 'room7',
    name: 'Room 3',
    wardId: 'ward2'
  },
]
const initialBeds: BedWithRoomId[] = initialRooms.map(room => range(0, 3)
  .map<BedWithRoomId>(index => ({
    id: `bed-${room.id}-${index}`,
    name: `Bed ${index + 1}`,
    roomId: room.id
  }))).flat()
const initialPatients: PatientValueStore[] = initialBeds
  .map<PatientValueStore>((bed, index) => ({
    id: `patient${index}`,
    name: `Patient ${index + 1}`,
    bedId: index % 2 === 0 ? undefined : bed.id,
    notes: '',
    isDischarged: index % 4 === 0,
  }))
const initialTasks: TaskValueStore[] = initialPatients.map((patient) => range(0, 5).map<TaskValueStore>(index => ({
  id: `task${patient.id}${index}`,
  name: `Task ${index + 1}`,
  isPublicVisible: true,
  patientId: patient.id,
  creatorId: 'CreatorId',
  status: index === 4 ? 'done' : (index === 3 ? 'inProgress' : 'todo'),
  notes: '',
}))).flat()
const initialSubTasks: SubTaskValueStore[] = initialTasks.map(task => range(0, 2).map<SubTaskValueStore>(index => ({
  id: `subTask${task.id}${index}`,
  name: `SubTask ${index + 1}`,
  taskId: task.id,
  isDone: index === 0
}))).flat()

export type PatientValueStore = {
  id: string,
  name: string,
  notes: string,
  bedId?: string,
  isDischarged: boolean
}

export type TaskValueStore = Omit<TaskDTO, 'subtasks'> & {
  patientId: string,
  creatorId: string
}

export type SubTaskValueStore = SubTaskDTO & {
  taskId: string
}

export type TaskTemplateValueStore = Omit<TaskTemplateDTO, 'subtasks'> & {
  creatorId: string
}

export type TaskTemplateSubTaskValueStore = {
  id: string,
  taskTemplateId: string,
  name: string,
  creatorId: string
}

export type UserValueStore = Omit<OrganizationMember, 'role'> & {
  nickName: string
}

export class OfflineValueStore {
  private static instance: OfflineValueStore
  properties: Property[] = initialProperties
  attachedProperties: AttachedProperty[] = initialAttachedProperties
  organizations: OrganizationMinimalDTO[] = initialOrganizations
  users: UserValueStore[] = initialMembers
  wards: WardWithOrganizationIdDTO[] = initialWards
  rooms: RoomWithWardId[] = initialRooms
  beds: BedWithRoomId[] = initialBeds
  patients: PatientValueStore[] = initialPatients
  tasks: TaskValueStore[] = initialTasks
  subTasks: SubTaskValueStore[] = initialSubTasks
  taskTemplates: TaskTemplateValueStore[] = []
  taskTemplateSubTasks: TaskTemplateSubTaskValueStore[] = []

  // eslint-disable-next-line no-useless-constructor
  private constructor() {
  }

  public static getInstance(): OfflineValueStore {
    if (!OfflineValueStore.instance) {
      OfflineValueStore.instance = new OfflineValueStore()
    }
    return OfflineValueStore.instance
  }
}
