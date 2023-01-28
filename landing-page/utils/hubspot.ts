const HUBSPOT_PORTAL_ID = '26536657'
const HUBSPOT_FORM_ID = 'e5271b1a-1ab8-472b-aae1-d4e3ab52fab7'

export const hubspotSubmitForm = ({ firstName, lastName, email, message }: { firstName: string, lastName: string, email: string, message: string }) =>
  fetch(`https://api.hsforms.com/submissions/v3/integration/submit/${HUBSPOT_PORTAL_ID}/${HUBSPOT_FORM_ID}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      submittedAt: Date.now(),
      fields: [
        { objectTypeId: '0-1', name: 'firstname', value: firstName },
        { objectTypeId: '0-1', name: 'lastname', value: lastName },
        { objectTypeId: '0-1', name: 'email', value: email },
        { objectTypeId: '0-1', name: 'message', value: message }
      ],
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
  }).then(res => res.json())
