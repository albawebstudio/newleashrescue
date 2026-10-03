import { Resend } from 'resend'
import { validateAdoptionApplication } from '#shared/adoption-form'
import { renderAdoptionEmail } from '../utils/renderAdoptionEmail'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const body = await readBody(event)

  if (body?.website) return { success: true }

  const startedAt = Date.parse(body?.startedAt ?? '')
  if (!Number.isFinite(startedAt) || Date.now() - startedAt < 2_000) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid submission timing.' })
  }

  const result = validateAdoptionApplication(body)
  if (!result.data) {
    throw createError({
      statusCode: 422,
      statusMessage: 'Please correct the highlighted application fields.',
      data: { errors: result.errors },
    })
  }

  if (!config.resendApiKey) {
    console.error('Adoption application email was not sent: RESEND_API_KEY is not configured.')
    throw createError({ statusCode: 503, statusMessage: 'Application delivery is temporarily unavailable.' })
  }

  const application = result.data
  application.applicationDate = new Date().toISOString()
  const resend = new Resend(config.resendApiKey)
  const applicantEmail = application.email.trim()
  const rescueInbox = String(config.adoptionToEmail)
  const payload = {
    from: `${config.contactName} <${config.contactEmail}>`,
    to: [rescueInbox],
    cc: applicantEmail && applicantEmail.toLowerCase() !== rescueInbox.toLowerCase() ? [applicantEmail] : undefined,
    replyTo: applicantEmail,
    subject: `New ${application.type} adoption application: ${application.animalName} — ${application.fullName}`,
    html: renderAdoptionEmail(application),
  }
  const response = await resend.emails.send(payload)

  if (response.error) {
    console.log('Resend payload', payload)
    console.error('Resend adoption email error:', response.error)
    throw createError({ statusCode: 502, statusMessage: 'The application could not be delivered.' })
  }

  return { success: true, id: response.data?.id }
})
