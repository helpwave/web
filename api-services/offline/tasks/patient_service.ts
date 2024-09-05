import type { Metadata } from 'grpc-web'
import { PatientServicePromiseClient } from '@helpwave/proto-ts/services/tasks_svc/v1/patient_svc_grpc_web_pb'
import type {
  AssignBedRequest,
  CreatePatientRequest,
  DischargePatientRequest,
  GetPatientAssignmentByWardRequest,
  GetPatientByBedRequest,
  GetPatientDetailsRequest,
  GetPatientListRequest,
  GetPatientRequest,
  GetPatientsByWardRequest,
  GetRecentPatientsRequest,
  ReadmitPatientRequest,
  UnassignBedRequest,
  UpdatePatientRequest
} from '@helpwave/proto-ts/services/tasks_svc/v1/patient_svc_pb'
import {
  AssignBedResponse,
  CreatePatientResponse,
  DischargePatientResponse,
  GetPatientAssignmentByWardResponse,
  GetPatientByBedResponse,
  GetPatientDetailsResponse,
  GetPatientListResponse,
  GetPatientResponse,
  GetPatientsByWardResponse,
  GetRecentPatientsResponse,
  ReadmitPatientResponse,
  UnassignBedResponse,
  UpdatePatientResponse
} from '@helpwave/proto-ts/services/tasks_svc/v1/patient_svc_pb'
import type { PatientValueStore } from '../value_store'
import { OfflineValueStore } from '../value_store'
import type { RoomWithWardId } from '../../types/tasks/room'
import { GRPCConverter } from '../../util/util'
import { SubTaskOfflineService, TaskOfflineService } from './task_service'
import { BedOfflineService } from './bed_service'
import { RoomOfflineService } from './room_service'

export const PatientOfflineService = {
  find: (id: string): PatientValueStore | undefined => {
    const valueStore: OfflineValueStore = OfflineValueStore.getInstance()
    // TODO check organization
    return valueStore.patients.find(value => value.id === id)
  },
  findPatients: (): PatientValueStore[] => {
    const valueStore: OfflineValueStore = OfflineValueStore.getInstance()
    return valueStore.patients
  },
  findByBed: (bedId: string): PatientValueStore | undefined => {
    const valueStore: OfflineValueStore = OfflineValueStore.getInstance()
    // TODO check organization
    return valueStore.patients.find(value => value.bedId === bedId)
  },
  addPatient: (patient: PatientValueStore) => {
    const valueStore: OfflineValueStore = OfflineValueStore.getInstance()
    valueStore.patients.push(patient)
  },
  updatePatient: (patient: PatientValueStore) => {
    const valueStore: OfflineValueStore = OfflineValueStore.getInstance()
    let found = false

    // TODO check organization
    valueStore.patients = valueStore.patients.map(value => {
      if (value.id === patient.id) {
        found = true
        return {
          ...value,
          name: patient.name,
          notes: patient.notes,
        }
      }
      return value
    })

    if (!found) {
      throw Error(`UpdatePatient: Could not find patient with id ${patient.id}`)
    }
  },
  changeAdmittance: (patientId: string, isDischarged: boolean) => {
    const valueStore: OfflineValueStore = OfflineValueStore.getInstance()
    let found = false

    // TODO check organization
    valueStore.patients = valueStore.patients.map(value => {
      if (value.id === patientId) {
        found = true
        return {
          ...value,
          isDischarged,
          bedId: isDischarged ? undefined : value.bedId,
        }
      }
      return value
    })

    if (!found) {
      throw Error(`ChangeAdmittance: Could not find patient with id ${patientId}`)
    }
  },
  assignBed: (patientId: string, bedId: string) => {
    const valueStore: OfflineValueStore = OfflineValueStore.getInstance()
    let found = false

    // TODO check bed
    // TODO check organization
    valueStore.patients = valueStore.patients.map(value => {
      if (value.id === patientId) {
        found = true
        return {
          ...value,
          bedId,
        }
      }
      return value
    })

    if (!found) {
      throw Error(`ChangeAdmittance: Could not find patient with id ${patientId}`)
    }

    // unassign bed from all other patients
    valueStore.patients = valueStore.patients.map(value => {
      if (value.bedId === bedId && value.id !== patientId) {
        return {
          ...value,
          bedId: undefined,
        }
      }
      return value
    })
  },
  unassignBed: (patientId: string) => {
    const valueStore: OfflineValueStore = OfflineValueStore.getInstance()
    const index = valueStore.patients.findIndex(value => value.id === patientId)

    if (index === -1) {
      throw Error(`ChangeAdmittance: Could not find patient with id ${patientId}`)
    }
    valueStore.patients[index] = {
      ...valueStore.patients[index]!,
      bedId: undefined
    }
  },
  deletePatient: (id: string) => {
    const valueStore: OfflineValueStore = OfflineValueStore.getInstance()
    valueStore.patients = valueStore.patients.filter(value => value.id !== id)
    const tasks = TaskOfflineService.findTasks(id)
    tasks.forEach(task => TaskOfflineService.delete(task.id))
  }
}

export class PatientOfflineServicePromiseClient extends PatientServicePromiseClient {
  async getPatient(request: GetPatientRequest, _?: Metadata): Promise<GetPatientResponse> {
    const patient = PatientOfflineService.find(request.getId())
    if (!patient) {
      throw Error(`GetPatient: Could not find patient with id ${request.getId()}`)
    }

    return new GetPatientResponse()
      .setId(patient.id)
      .setHumanReadableIdentifier(patient.name)
      .setNotes(patient.notes)
      .setBed() // TODO set these if present
      .setRoom()
  }

  async getPatientDetails(request: GetPatientDetailsRequest, _?: Metadata): Promise<GetPatientDetailsResponse> {
    const patient = PatientOfflineService.find(request.getId())
    if (!patient) {
      throw Error(`GetPatientDetails: Could not find patient with id ${request.getId()}`)
    }

    const bed = patient.bedId ? BedOfflineService.find(patient.bedId) : undefined
    let room: RoomWithWardId | undefined
    if (bed) {
      room = RoomOfflineService.findRoom(bed.roomId)
    }
    const tasks = TaskOfflineService.findTasks(patient.id).map(task => {
      const subTasks = SubTaskOfflineService.findSubTasks(task.id).map(subTask =>
        new GetPatientDetailsResponse.Task.SubTask()
          .setId(subTask.id)
          .setName(subTask.name)
          .setDone(subTask.isDone)
      )
      const res = new GetPatientDetailsResponse.Task()
        .setId(task.id)
        .setName(task.name)
        .setDescription(task.notes)
        .setPatientId(task.patientId)
        .setPublic(task.isPublicVisible)
        .setStatus(GRPCConverter.taskStatusToGrpc(task.status))
        .setSubtasksList(subTasks)
      if (task.assignee) {
        res.setAssignedUserId(task.assignee)
      }
      return res
    })

    return new GetPatientDetailsResponse()
      .setId(patient.id)
      .setHumanReadableIdentifier(patient.name)
      .setNotes(patient.notes)
      .setIsDischarged(patient.isDischarged)
      .setBed(bed
        ? new GetPatientDetailsResponse.Bed()
          .setId(bed.id)
          .setName(bed.name)
        : undefined)
      .setRoom(room ? new GetPatientDetailsResponse.Room()
        .setId(room.id)
        .setName(room.name)
        .setWardId(room.wardId)
        : undefined)
      .setTasksList(tasks)
  }

  async getPatientByBed(request: GetPatientByBedRequest, _?: Metadata): Promise<GetPatientByBedResponse> {
    const bedId = request.getBedId()
    const patient = PatientOfflineService.findByBed(bedId)
    if (!patient) {
      throw Error(`GetPatientByBed: Could not find patient by bed id ${bedId}`)
    }

    return new GetPatientByBedResponse()
      .setId(patient.id)
      .setBedId(bedId)
      .setNotes(patient.notes)
      .setHumanReadableIdentifier(patient.name)
  }

  async getPatientList(_: GetPatientListRequest, __?: Metadata): Promise<GetPatientListResponse> {
    // The request contains a wardId which we will ignore here
    const patients = PatientOfflineService.findPatients()
    const active = patients
      .filter(value => value.bedId && !value.isDischarged)
      .map(patient => {
        const bed = patient.bedId ? BedOfflineService.find(patient.bedId) : undefined
        let room: RoomWithWardId | undefined
        if (bed) {
          room = RoomOfflineService.findRoom(bed.roomId)
        }

        const tasks = TaskOfflineService.findTasks(patient.id).map(task => {
          const subTasks = SubTaskOfflineService.findSubTasks(task.id).map(subTask =>
            new GetPatientDetailsResponse.Task.SubTask()
              .setId(subTask.id)
              .setName(subTask.name)
              .setDone(subTask.isDone)
          )
          const res = new GetPatientDetailsResponse.Task()
            .setId(task.id)
            .setName(task.name)
            .setDescription(task.notes)
            .setPatientId(task.patientId)
            .setPublic(task.isPublicVisible)
            .setStatus(GRPCConverter.taskStatusToGrpc(task.status))
            .setSubtasksList(subTasks)
          if (task.assignee) {
            res.setAssignedUserId(task.assignee)
          }
          return res
        })

        return new GetPatientListResponse.Patient()
          .setId(patient.id)
          .setHumanReadableIdentifier(patient.name)
          .setNotes(patient.notes)
          .setBed(bed
            ? new GetPatientDetailsResponse.Bed()
              .setId(bed.id)
              .setName(bed.name)
            : undefined)
          .setRoom(room ? new GetPatientDetailsResponse.Room()
            .setId(room.id)
            .setName(room.name)
            .setWardId(room.wardId)
            : undefined)
          .setTasksList(tasks)
      }
      )
    const unassigned = patients
      .filter(value => !value.bedId && !value.isDischarged)
      .map(patient => {
        const tasks = TaskOfflineService.findTasks(patient.id).map(task => {
          const subTasks = SubTaskOfflineService.findSubTasks(task.id).map(subTask =>
            new GetPatientDetailsResponse.Task.SubTask()
              .setId(subTask.id)
              .setName(subTask.name)
              .setDone(subTask.isDone)
          )
          const res = new GetPatientDetailsResponse.Task()
            .setId(task.id)
            .setName(task.name)
            .setDescription(task.notes)
            .setPatientId(task.patientId)
            .setPublic(task.isPublicVisible)
            .setStatus(GRPCConverter.taskStatusToGrpc(task.status))
            .setSubtasksList(subTasks)
          if (task.assignee) {
            res.setAssignedUserId(task.assignee)
          }
          return res
        })

        return new GetPatientListResponse.Patient()
          .setId(patient.id)
          .setHumanReadableIdentifier(patient.name)
          .setNotes(patient.notes)
          .setTasksList(tasks)
      }
      )
    const discharged = patients
      .filter(value => value.isDischarged)
      .map(patient => {
        const tasks = TaskOfflineService.findTasks(patient.id).map(task => {
          const subTasks = SubTaskOfflineService.findSubTasks(task.id).map(subTask =>
            new GetPatientDetailsResponse.Task.SubTask()
              .setId(subTask.id)
              .setName(subTask.name)
              .setDone(subTask.isDone)
          )
          const res = new GetPatientDetailsResponse.Task()
            .setId(task.id)
            .setName(task.name)
            .setDescription(task.notes)
            .setPatientId(task.patientId)
            .setPublic(task.isPublicVisible)
            .setStatus(GRPCConverter.taskStatusToGrpc(task.status))
            .setSubtasksList(subTasks)
          if (task.assignee) {
            res.setAssignedUserId(task.assignee)
          }
          return res
        })
        return new GetPatientListResponse.Patient()
          .setId(patient.id)
          .setHumanReadableIdentifier(patient.name)
          .setNotes(patient.notes)
          .setTasksList(tasks)
      }
      )

    return new GetPatientListResponse()
      .setActiveList(active)
      .setUnassignedPatientsList(unassigned)
      .setDischargedPatientsList(discharged)
  }

  async getRecentPatients(_: GetRecentPatientsRequest, __?: Metadata): Promise<GetRecentPatientsResponse> {
    const patients = PatientOfflineService.findPatients()

    const list = patients
      .filter(value => value.bedId && !value.isDischarged)
      .map(patient => {
        const bed = patient.bedId ? BedOfflineService.find(patient.bedId) : undefined
        let room: RoomWithWardId | undefined
        if (bed) {
          room = RoomOfflineService.findRoom(bed.roomId)
        }
        return new GetRecentPatientsResponse.PatientWithRoomAndBed()
          .setId(patient.id)
          .setHumanReadableIdentifier(patient.name)
          .setBed(bed
            ? new GetPatientDetailsResponse.Bed()
              .setId(bed.id)
              .setName(bed.name)
            : undefined)
          .setRoom(room ? new GetPatientDetailsResponse.Room()
            .setId(room.id)
            .setName(room.name)
            .setWardId(room.wardId)
            : undefined)
      })

    return new GetRecentPatientsResponse().setRecentPatientsList(list)
  }

  async getPatientAssignmentByWard(__: GetPatientAssignmentByWardRequest, _?: Metadata): Promise<GetPatientAssignmentByWardResponse> {
    // TODO fix PatientOfflineService
    return new GetPatientAssignmentByWardResponse()
  }

  async getPatientsByWard(__: GetPatientsByWardRequest, _?: Metadata): Promise<GetPatientsByWardResponse> {
    const patients = PatientOfflineService.findPatients().filter(value => !!value.bedId)

    const list = patients.map(patient => new GetPatientsByWardResponse.Patient()
      .setId(patient.id)
      .setNotes(patient.notes)
      .setHumanReadableIdentifier(patient.name)
      .setBedId(patient.bedId!)
    )

    return new GetPatientsByWardResponse()
      .setPatientsList(list)
  }

  async createPatient(request: CreatePatientRequest, _?: Metadata): Promise<CreatePatientResponse> {
    const newPatient: PatientValueStore = {
      id: Math.random().toString(),
      name: request.getHumanReadableIdentifier(),
      notes: request.getNotes(),
      isDischarged: false,
    }

    PatientOfflineService.addPatient(newPatient)

    return new CreatePatientResponse().setId(newPatient.id)
  }

  async updatePatient(request: UpdatePatientRequest, _?: Metadata): Promise<UpdatePatientResponse> {
    const patient: PatientValueStore = {
      id: request.getId(),
      name: request.getHumanReadableIdentifier(),
      notes: request.getNotes(),
      isDischarged: false // This value is not used in update
    }

    PatientOfflineService.updatePatient(patient)

    return new UpdatePatientResponse()
  }

  /* TODO reeanable once backend point exists
  async deletePatient(request: DeletePatientRequest, _?: Metadata): Promise<DeletePatientResponse> {
    PatientOfflineService.deletePatient(request.getId())
    return new DeletePatientResponse()
  } */

  async readmitPatient(request: ReadmitPatientRequest, _?: Metadata): Promise<ReadmitPatientResponse> {
    PatientOfflineService.changeAdmittance(request.getPatientId(), false)
    return new ReadmitPatientResponse()
  }

  async dischargePatient(request: DischargePatientRequest, _?: Metadata): Promise<DischargePatientResponse> {
    PatientOfflineService.changeAdmittance(request.getId(), true)
    return new DischargePatientResponse()
  }

  async assignBed(request: AssignBedRequest, _?: Metadata): Promise<AssignBedResponse> {
    PatientOfflineService.assignBed(request.getId(), request.getBedId())
    return new AssignBedResponse()
  }

  async unassignBed(request: UnassignBedRequest, _?: Metadata): Promise<UnassignBedResponse> {
    PatientOfflineService.unassignBed(request.getId())
    return new UnassignBedResponse()
  }
}
