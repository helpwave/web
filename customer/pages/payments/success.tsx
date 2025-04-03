export default function CheckoutReturn() {
  /* TODO get session id from url when backend provides it check status
  const sessionId = searchParams.session_id

  if (!sessionId) {
    return <p>Invalid session ID.</p>
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    const customer = session.customer as string

    if (session?.status === 'open') {
      return <p>Payment did not work.</p>
    }

    if (session?.status === 'complete') {
      return (
        <h3>
          We appreciate your business! Your Stripe customer ID is: {customer}.
        </h3>
      )
    }
  } catch (error) {
    console.error('Error fetching session:', error)
    return <p>Something went wrong. Please try again.</p>
  }

  return null
   */
  return <p>Payment processed.</p>
}
