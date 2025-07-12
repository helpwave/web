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
  getPatientDetails: async function(patientId: string): Promise<PatientDetailsDTO> {
    const req = new GetPatientDetailsRequest()
    req.setId(patientId)

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
          isDone: subtask.getDone()
        }))
      }))
    }
  },
  getPatientsByWard: async function(wardId: string): Promise<PatientWithBedIdDTO[]> {
    const req = new GetPatientsByWardRequest()
    req.setWardId(wardId)
    const res = await APIServices.patient.getPatientsByWard(req, getAuthenticatedGrpcMetadata())

    return res.getPatientsList().map((patient) => ({
      id: patient.getId(),
      name: patient.getHumanReadableIdentifier(),
      note: patient.getNotes(),
      bedId: patient.getBedId(),
    }))
  },
  getPatientAssignmentByWard:  async function(wardId: string): Promise<RoomWithMinimalBedAndPatient[]> {
    const req = new GetPatientAssignmentByWardRequest()
    req.setWardId(wardId)
    const res = await APIServices.patient.getPatientAssignmentByWard(req, getAuthenticatedGrpcMetadata())

    return  res.getRoomsList().map((room) => ({
      id: room.getId(),
      name: room.getName(),
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
  getPatientList: async function(wardId?: string): Promise<PatientListDTO> {
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
  getRecentPatients: async function(): Promise<RecentPatientDTO[]> {
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
  create: async function(patient: PatientDTO): Promise<PatientDTO> {
    const req = new CreatePatientRequest()
    req.setNotes(patient.note)
    req.setHumanReadableIdentifier(patient.name)
    const res = await APIServices.patient.createPatient(req, getAuthenticatedGrpcMetadata())

    const id = res.getId()

    if (!id) {
      throw new Error('create room failed')
    }

    return { ...patient, id }
  },
  update: async function(patient: PatientDTO): Promise<PatientDTO> {
    const req = new UpdatePatientRequest()
    req.setId(patient.id)
    req.setNotes(patient.note)
    req.setHumanReadableIdentifier(patient.name)

    const res = await APIServices.patient.updatePatient(req, getAuthenticatedGrpcMetadata())

    if (!res.toObject()) {
      throw new Error('error in PatientUpdate')
    }

    return patient
  },
  delete: async function(patientId: string): Promise<boolean> {
    const req = new DeletePatientRequest()
    req.setId(patientId)

    const res = await APIServices.patient.deletePatient(req, getAuthenticatedGrpcMetadata())

    return !!res.toObject()
  },
  assignToBed: async function(bedWithPatientId: BedWithPatientId): Promise<BedWithPatientId> {
    const req = new AssignBedRequest()
    req.setId(bedWithPatientId.patientId)
    req.setBedId(bedWithPatientId.id)

    const res = await APIServices.patient.assignBed(req, getAuthenticatedGrpcMetadata())

    if (!res.toObject()) {
      throw new Error('assign bed request failed')
    }

    return bedWithPatientId
  },
  unassignFromBed: async function(patientId: string): Promise<boolean> {
    const req = new UnassignBedRequest()
    req.setId(patientId)

    const res = await APIServices.patient.unassignBed(req, getAuthenticatedGrpcMetadata())

    return !!res.toObject()
  },
  discharge: async function(patientId: string): Promise<boolean> {
    const req = new DischargePatientRequest()
    req.setId(patientId)

    const res = await APIServices.patient.dischargePatient(req, getAuthenticatedGrpcMetadata())

    return !!res.toObject()
  },
  reAdmit: async function(patientId: string): Promise<boolean> {
    const req = new ReadmitPatientRequest()
    req.setPatientId(patientId)

    const res = await APIServices.patient.readmitPatient(req, getAuthenticatedGrpcMetadata())

    return !!res.toObject()
  }
}
