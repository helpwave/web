import type {
  PatientDetailsDTO, PatientDTO,
  PatientListDTO,
  PatientMinimalDTO,
  PatientWithBedIdDTO,
  RecentPatientDTO
} from '../../types/tasks/patient'
import { GRPCConverter } from '../../util/util'
import { APIServices } from '../../services'
import { getAuthenticatedGrpcMetadata } from '../../authentication/grpc_metadata'
import {
  AssignBedRequest,
  CreatePatientRequest, DeletePatientRequest, DischargePatientRequest,
  GetPatientAssignmentByWardRequest,
  GetPatientDetailsRequest, GetPatientListRequest,
  GetPatientsByWardRequest, GetRecentPatientsRequest, ReadmitPatientRequest, UnassignBedRequest, UpdatePatientRequest
} from '@helpwave/proto-ts/services/tasks_svc/v1/patient_svc_pb'
import type { RoomWithMinimalBedAndPatient } from '../../types/tasks/room'
import type { BedWithPatientId } from '../../types/tasks/bed'

export const PatientService = {
  getDetails: async function (patientId: string): Promise<PatientDetailsDTO> {
    const req = new GetPatientDetailsRequest()
      .setId(patientId)

    const res = await APIServices.patient.getPatientDetails(req, getAuthenticatedGrpcMetadata())

    return {
      id: res.getId(),
      note: res.getNotes(),
      name: res.getHumanReadableIdentifier(),
      discharged: res.getIsDischarged(),
      tasks: res.getTasksList().map(task => ({
        id: task.getId(),
        name: task.getName(),
        status: GRPCConverter.taskStatusFromGRPC(task.getStatus()),
        notes: task.getDescription(),
        isPublicVisible: task.getPublic(),
        assignee: task.getAssignedUserId(),
        dueDate: new Date(), // TODO replace later
        subtasks: task.getSubtasksList().map(subtask => ({
          id: subtask.getId(),
          name: subtask.getName(),
          isDone: subtask.getDone(),
          taskId: task.getId(),
        })),
        patientId: res.getId(),
      }))
    }
  },
  getPatientsByWard: async function (wardId: string): Promise<PatientWithBedIdDTO[]> {
    const req = new GetPatientsByWardRequest()
      .setWardId(wardId)
    const res = await APIServices.patient.getPatientsByWard(req, getAuthenticatedGrpcMetadata())

    return res.getPatientsList().map((patient) => ({
      id: patient.getId(),
      name: patient.getHumanReadableIdentifier(),
      note: patient.getNotes(),
      bedId: patient.getBedId(),
    }))
  },
  getPatientAssignmentByWard: async function (wardId: string): Promise<RoomWithMinimalBedAndPatient[]> {
    const req = new GetPatientAssignmentByWardRequest()
    req.setWardId(wardId)
    const res = await APIServices.patient.getPatientAssignmentByWard(req, getAuthenticatedGrpcMetadata())

    return res.getRoomsList().map((room) => ({
      id: room.getId(),
      name: room.getName(),
      wardId,
      beds: room.getBedsList().map(bed => {
        let patient: PatientMinimalDTO | undefined
        const objectPatient = bed.getPatient()
        if (objectPatient) {
          patient = {
            id: objectPatient.getId(),
            name: objectPatient.getName()
          }
        }
        return {
          id: bed.getId(),
          name: bed.getName(),
          patient
        }
      })
    }))
  },
  getPatientList: async function (wardId?: string): Promise<PatientListDTO> {
    const req = new GetPatientListRequest()
    if (wardId) {
      req.setWardId(wardId)
    }
    const res = await APIServices.patient.getPatientList(req, getAuthenticatedGrpcMetadata())

    return {
      active: res.getActiveList().map(value => {
        const room = value.getRoom()
        const bed = value.getBed()

        if (!room) {
          console.error('no room for active patient in PatientList')
        }

        if (!bed) {
          console.error('no room for active patient in PatientList')
        }
        return ({
          id: value.getId(),
          name: value.getHumanReadableIdentifier(),
          bed: {
            id: bed?.getId() ?? '',
            name: bed?.getName() ?? ''
          },
          room: {
            id: room?.getId() ?? '',
            name: room?.getName() ?? '',
            wardId: room?.getWardId() ?? ''
          }
        })
      }),
      discharged: res.getDischargedPatientsList().map(value => ({
        id: value.getId(),
        name: value.getHumanReadableIdentifier(),
      })),
      unassigned: res.getUnassignedPatientsList().map(value => ({
        id: value.getId(),
        name: value.getHumanReadableIdentifier(),
      }))
    }
  },
  getRecentPatients: async function (): Promise<RecentPatientDTO[]> {
    const req = new GetRecentPatientsRequest()
    const res = await APIServices.patient.getRecentPatients(req, getAuthenticatedGrpcMetadata())

    const patients: RecentPatientDTO[] = []
    for (const patient of res.getRecentPatientsList()) {
      const room = patient.getRoom()
      const bed = patient.getBed()
      let wardId: string | undefined
      if (room) {
        wardId = room?.getWardId()
      }

      patients.push({
        id: patient.getId(),
        name: patient.getHumanReadableIdentifier(),
        wardId,
        bed: bed ? { id: bed.getId(), name: bed.getName() } : undefined,
        room: room ? { id: room.getId(), name: room.getId() } : undefined
      })
    }
    return patients
  },
  create: async function (patient: PatientDTO): Promise<PatientDTO> {
    const req = new CreatePatientRequest()
      .setNotes(patient.note)
      .setHumanReadableIdentifier(patient.name)
    const res = await APIServices.patient.createPatient(req, getAuthenticatedGrpcMetadata())
    return { ...patient, id: res.getId() }
  },
  update: async function (patient: PatientDTO): Promise<boolean> {
    const req = new UpdatePatientRequest()
      .setId(patient.id)
      .setNotes(patient.note)
      .setHumanReadableIdentifier(patient.name)

    await APIServices.patient.updatePatient(req, getAuthenticatedGrpcMetadata())
    return true
  },
  delete: async function (patientId: string): Promise<boolean> {
    const req = new DeletePatientRequest()
      .setId(patientId)

    await APIServices.patient.deletePatient(req, getAuthenticatedGrpcMetadata())
    return true
  },
  assignToBed: async function (bedWithPatientId: BedWithPatientId): Promise<boolean> {
    const req = new AssignBedRequest()
      .setId(bedWithPatientId.patientId)
      .setBedId(bedWithPatientId.id)

    await APIServices.patient.assignBed(req, getAuthenticatedGrpcMetadata())
    return true
  },
  unassignFromBed: async function (patientId: string): Promise<boolean> {
    const req = new UnassignBedRequest()
      .setId(patientId)

    await APIServices.patient.unassignBed(req, getAuthenticatedGrpcMetadata())
    return true
  },
  discharge: async function (patientId: string): Promise<boolean> {
    const req = new DischargePatientRequest()
      .setId(patientId)

    await APIServices.patient.dischargePatient(req, getAuthenticatedGrpcMetadata())
    return true
  },
  reAdmit: async function (patientId: string): Promise<boolean> {
    const req = new ReadmitPatientRequest()
      .setPatientId(patientId)

    await APIServices.patient.readmitPatient(req, getAuthenticatedGrpcMetadata())
    return true
  }
}
