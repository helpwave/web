export type WardMinimalDTO = {
  id: string,
  name: string,
}

export type WardWithOrganizationIdDTO = WardMinimalDTO & {
  organizationId: string,
}

export type WardOverviewDTO = WardMinimalDTO & {
  bedCount: number,
  unscheduled: number,
  inProgress: number,
  done: number,
}

export const emptyWardOverview: WardOverviewDTO = {
  id: '',
  name: '',
  bedCount: 0,
  unscheduled: 0,
  inProgress: 0,
  done: 0
}

export type WardDetailDTO = WardMinimalDTO & {
  rooms: {
    id: string,
    name: string,
    beds: {
      id: string,
    }[],
  }[],
  task_templates: {
    id: string,
    name: string,
    subtasks: {
      id: string,
      name: string,
    }[],
  }[],
}

export const emptyWard: WardDetailDTO = {
  id: '',
  name: '',
  rooms: [],
  task_templates: []
}
