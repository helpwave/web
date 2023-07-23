import { Role } from '../components/OrganizationMemberList'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const queryKey = 'organizations'

type WardDTO = {
  name: string
}

export type OrgMember = {
  email: string,
  name: string,
  avatarURL: string,
  role: Role
}

export type OrganizationDTO = {
  id: string,
  shortName: string,
  longName: string,
  email: string,
  isVerified: boolean,
  wards: WardDTO[],
  members: OrgMember[]
}

// TODO remove once backend is implemented
export let organizations: OrganizationDTO[] = [
  {
    id: 'e25256a4-830d-4af3-baa2-81ad8dc50e04',
    shortName: 'UKA',
    longName: 'Uniklinik Aachen',
    email: 'uka@helpwave.de',
    isVerified: false,
    wards: [],
    members: [
      {
        name: 'User1',
        avatarURL: 'https://source.boringavatars.com/',
        email: 'user1@helpwave.de',
        role: Role.admin
      }, {
        name: 'User2',
        avatarURL: 'https://source.boringavatars.com/',
        email: 'user2@helpwave.de',
        role: Role.user
      },
      {
        name: 'User3',
        avatarURL: 'https://source.boringavatars.com/',
        email: 'user3@helpwave.de',
        role: Role.user
      },
      {
        name: 'User4',
        avatarURL: 'https://source.boringavatars.com/',
        email: 'user4@helpwave.de',
        role: Role.user
      }
    ]
  },
  {
    id: 'e25256a4-830d-4af3-baa2-81ad8dc50e04',
    shortName: 'UKM',
    longName: 'Uniklinik Münster',
    email: 'ukm@helpwave.de',
    isVerified: false,
    wards: [],
    members: [
      {
        name: 'User1',
        avatarURL: 'https://source.boringavatars.com/',
        email: 'user1@helpwave.de',
        role: Role.admin
      },
      {
        name: 'User1',
        avatarURL: 'https://source.boringavatars.com/',
        email: 'user1@helpwave.de',
        role: Role.admin
      },
      {
        name: 'User1',
        avatarURL: 'https://source.boringavatars.com/',
        email: 'user1@helpwave.de',
        role: Role.admin
      },
      {
        name: 'User1',
        avatarURL: 'https://source.boringavatars.com/',
        email: 'user1@helpwave.de',
        role: Role.admin
      },
      {
        name: 'User1',
        avatarURL: 'https://source.boringavatars.com/',
        email: 'user1@helpwave.de',
        role: Role.admin
      },
      {
        name: 'User1',
        avatarURL: 'https://source.boringavatars.com/',
        email: 'user1@helpwave.de',
        role: Role.admin
      },
      {
        name: 'User2',
        avatarURL: 'https://source.boringavatars.com/',
        email: 'user2@helpwave.de',
        role: Role.user
      },
      {
        name: 'User3',
        avatarURL: 'https://source.boringavatars.com/',
        email: 'user3@helpwave.de',
        role: Role.user
      },
      {
        name: 'User4',
        avatarURL: 'https://source.boringavatars.com/',
        email: 'user4@helpwave.de',
        role: Role.user
      }
    ]
  },
  {
    id: 'f6e0f961-6a2e-4ddd-bac3-7c29485b75d5',
    shortName: 'UKGM',
    longName: 'Uniklinikum Giessen und Marburg',
    email: 'ukgm@helpwave.de',
    isVerified: false,
    wards: [],
    members: [
      {
        name: 'User2',
        avatarURL: 'https://source.boringavatars.com/',
        email: 'user2@helpwave.de',
        role: Role.user
      },
      {
        name: 'User3',
        avatarURL: 'https://source.boringavatars.com/',
        email: 'user3@helpwave.de',
        role: Role.user
      },
      {
        name: 'User4',
        avatarURL: 'https://source.boringavatars.com/',
        email: 'user4@helpwave.de',
        role: Role.user
      }
    ]
  },

]

export const useOrganizationQuery = () => {
  return useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      // TODO fetch user organizations
      return organizations
    },
  })
}

export const useUpdateMutation = (setSelectedOrganization: (organization: OrganizationDTO | undefined) => void) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (organization: OrganizationDTO) => {
      // TODO create request for organization
      organizations = [...organizations.filter(value => value.id !== organization.id), organization]
      organizations.sort((a, b) => a.longName.localeCompare(b.longName))
      setSelectedOrganization(organization)
    },
    onMutate: async (organization) => {
      await queryClient.cancelQueries({ queryKey: [queryKey] })
      const previousOrganizations = queryClient.getQueryData<OrganizationDTO[]>([queryKey])
      queryClient.setQueryData<OrganizationDTO[]>(
        [queryKey],
        (old) => [...(old === undefined ? [] : old.filter(value => value.id !== organization.id)), organization])
      organizations.sort((a, b) => a.longName.localeCompare(b.longName))
      return { previousOrganizations }
    },
    onError: (_, newTodo, context) => {
      queryClient.setQueryData([queryKey], context === undefined ? [] : context.previousOrganizations)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] }).then()
    }
  })
}

export const useCreateMutation = (setSelectedOrganization: (organization: OrganizationDTO | undefined) => void) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (organization) => {
      organization.id = Math.random().toString()
      // TODO create request for organization
      const newOrganization = { ...organization, id: Math.random().toString() }
      organizations = [...organizations, newOrganization]
      organizations.sort((a, b) => a.longName.localeCompare(b.longName))
      setSelectedOrganization(newOrganization)
    },
    onMutate: async(organization: OrganizationDTO) => {
      await queryClient.cancelQueries({ queryKey: [queryKey] })
      const previousOrganizations = queryClient.getQueryData<OrganizationDTO[]>([queryKey])
      queryClient.setQueryData<OrganizationDTO[]>([queryKey], (old) => [...(old === undefined ? [] : old), organization])
      organizations.sort((a, b) => a.longName.localeCompare(b.longName))
      return { previousOrganizations }
    },
    onError: (_, newTodo, context) => {
      queryClient.setQueryData([queryKey], context === undefined ? [] : context.previousOrganizations)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] }).then()
    },
  })
}

export const useDeleteMutation = (setSelectedOrganization: (organization: OrganizationDTO | undefined) => void) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (organization) => {
      // TODO create request for organization
      organizations = [...organizations.filter(value => value.id !== organization.id)]
      setSelectedOrganization(undefined)
    },
    onMutate: async(organization: OrganizationDTO) => {
      await queryClient.cancelQueries({ queryKey: [queryKey] })
      const previousOrganizations = queryClient.getQueryData<OrganizationDTO[]>([queryKey])
      queryClient.setQueryData<OrganizationDTO[]>(
        [queryKey],
        (old) => [...(old === undefined ? [] : old.filter(value => value.id !== organization.id))])
      return { previousOrganizations }
    },
    onError: (_, newTodo, context) => {
      queryClient.setQueryData([queryKey], context === undefined ? [] : context.previousOrganizations)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] }).then()
    },
  })
}
