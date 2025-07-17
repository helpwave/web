import type { UseMutationOptions } from '@tanstack/react-query'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { PatientDTO } from '../../types/tasks/patient'
import { QueryKeys } from '../query_keys'
import type { BedWithPatientId } from '../../types/tasks/bed'
import { roomOverviewsQueryKey } from './room_mutations'
import { PatientService } from '../../service/tasks/PatientService'

export const usePatientDetailsQuery = (patientId?: string) => {
  return useQuery({
    queryKey: [QueryKeys.patients, patientId],
    enabled: !!patientId,
    queryFn: async () => {
      return await PatientService.getDetails(patientId!)
    },
  })
}

export const usePatientsByWardQuery = (wardId: string) => {
  return useQuery({
    queryKey: [QueryKeys.patients, 'details'],
    queryFn: async () => {
      return await PatientService.getPatientsByWard(wardId)
    }
  })
}

export const usePatientAssignmentByWardQuery = (wardId: string) => {
  return useQuery({
    queryKey: [QueryKeys.rooms, 'patientAssignments'],
    enabled: !!wardId,
    queryFn: async () => {
      return await PatientService.getPatientAssignmentByWard(wardId)
    }
  })
}

export const usePatientListQuery = (wardId?: string) => {
  return useQuery({
    queryKey: [QueryKeys.patients, 'patientList', wardId],
    queryFn: async () => {
      return await PatientService.getPatientList(wardId)
    }
  })
}

export const useRecentPatientsQuery = () => {
  return useQuery({
    queryKey: [QueryKeys.patients],
    queryFn: async () => {
      return await PatientService.getRecentPatients()
    }
  })
}

export const usePatientCreateMutation = (options?: UseMutationOptions<PatientDTO, unknown, PatientDTO>) => {
  const queryClient = useQueryClient()
  return useMutation({
    ...options,
    mutationFn: async (patient: PatientDTO) => {
      return await PatientService.create(patient)
    },
    onSuccess: (data, variables, context) => {
      if(options?.onSuccess) {
        options.onSuccess(data, variables, context)
      }
      queryClient.invalidateQueries([QueryKeys.rooms]).catch(reason => console.error(reason))
      queryClient.invalidateQueries([QueryKeys.patients]).catch(reason => console.error(reason))
    }
  })
}

export const usePatientUpdateMutation = (options?: UseMutationOptions<boolean, unknown, PatientDTO>) => {
  const queryClient = useQueryClient()
  return useMutation({
    ...options,
    mutationFn: async (patient: PatientDTO) => {
      return await PatientService.update(patient)
    },
    onSuccess: (data, variables, context) => {
      if(options?.onSuccess) {
        options.onSuccess(data, variables, context)
      }
      queryClient.invalidateQueries([QueryKeys.patients]).catch(reason => console.error(reason))
      queryClient.invalidateQueries([QueryKeys.rooms]).catch(reason => console.error(reason))
    }
  })
}

export const useAssignBedMutation = (options?: UseMutationOptions<boolean, unknown, BedWithPatientId, unknown>) => {
  const queryClient = useQueryClient()
  return useMutation({
    ...options,
    mutationFn: async (bed: BedWithPatientId) => {
      return await PatientService.assignToBed(bed)
    },
    onSuccess: (data, variables, context) => {
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context)
      }
      queryClient.invalidateQueries([QueryKeys.rooms]).catch(console.error)
      queryClient.invalidateQueries([QueryKeys.patients]).catch(console.error)
    }
  })
}

export const useUnassignMutation = (options?: UseMutationOptions<boolean, unknown, string, unknown>) => {
  const queryClient = useQueryClient()
  return useMutation({
    ...options,
    mutationFn: async (patientId: string) => {
      return await PatientService.unassignFromBed(patientId)
    },
    onSuccess: (data, variables, context) => {
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context)
      }
      queryClient.invalidateQueries([QueryKeys.rooms, roomOverviewsQueryKey]).catch(console.error)
      queryClient.invalidateQueries([QueryKeys.patients]).catch(console.error)
    }
  })
}

export const usePatientDischargeMutation = (options?: UseMutationOptions<boolean, unknown, string, unknown>) => {
  const queryClient = useQueryClient()
  return useMutation({
    ...options,
    mutationFn: async (patientId: string) => {
      return await PatientService.discharge(patientId)
    },
    onSuccess: (data, variables, context) => {
      if(options?.onSuccess){
        options.onSuccess(data, variables, context)
      }
      queryClient.invalidateQueries([QueryKeys.rooms, roomOverviewsQueryKey]).catch(reason => console.error(reason))
      queryClient.invalidateQueries([QueryKeys.patients]).catch(reason => console.error(reason))
    }
  })
}

export const useReadmitPatientMutation = (options?: UseMutationOptions<boolean, unknown, string, unknown>) => {
  const queryClient = useQueryClient()
  return useMutation({
    ...options,
    mutationFn: async (patientId: string) => {
      return await PatientService.reAdmit(patientId)
    },
    onSuccess: (data, variables, context) => {
      if(options?.onSuccess){
        options.onSuccess(data, variables, context)
      }
      queryClient.invalidateQueries([QueryKeys.rooms, roomOverviewsQueryKey]).catch(console.error)
      queryClient.invalidateQueries([QueryKeys.patients]).catch(console.error)
    }
  })
}
