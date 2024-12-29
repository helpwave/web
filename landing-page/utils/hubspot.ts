export type FormField<T = string|number> = {
  objectTypeId: string,
  name: string,
  value: T,
}

export const submitHubSpotForm = (portalId: string, formId: string, formFields: FormField[]) => {
  return fetch(`https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      submittedAt: Date.now(),
      fields: formFields,

      // TODO: context attribute?
      legalConsentOptions: { // TODO: 🤡
        consent: {
          consentToProcess: true,
          text: 'I agree to allow Example Company to store and process my personal data.',
          communications: [
            {
              value: true,
              subscriptionTypeId: 999,
              text: 'I agree to receive marketing communications from Example Company.'
            }
          ]
        }
      }
    })
  })
}
