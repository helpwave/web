import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { handleCodeExchange } from '../../utils/oauth'
import type { OpenIDTokenEndpointResponse } from 'oauth4webapi'
import { PatientServicePromiseClient } from '@helpwave/proto-ts/proto/services/task_svc/v1/patient_svc_grpc_web_pb'
import { CreatePatientRequest, GetPatientRequest } from '@helpwave/proto-ts/proto/services/task_svc/v1/patient_svc_pb'

const AuthCallback: NextPage = () => {
  const [token, setToken] = useState<string>()

  useEffect(() => {
    if (token) return
    handleCodeExchange().then(setToken)
  }, [])

  const doReq = async () => {
    if (!token) return

    const createPatientRequest = new CreatePatientRequest()
    createPatientRequest.setHumanReadableIdentifier('Patient A')

    const patientService = new PatientServicePromiseClient('https://staging-api.helpwave.de/task-svc')
    const createPatientResponse = await patientService.createPatient(createPatientRequest, { authorization: `bearer ${token}` })

    console.log('patient created', createPatientResponse.getId())
  }

  return (
    <>
      { token && <p onClick={doReq}>{token}</p> }
    </>
  )
}

export default AuthCallback
