import { Resend } from 'resend'
import { validateFosterApplication } from '#shared/foster-form'
import { renderFosterEmail } from '../utils/renderProgramEmail'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const body = await readBody(event)

  if (body?.website) return { success: true }

  const startedAt = Date.parse(body?.startedAt ?? '')
  if (!Number.isFinite(startedAt) || Date.now() - startedAt < 2_000) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid submission timing.' })
  }

  const result = validateFosterApplication(body)
  if (!result.data) {
    throw createError({
      statusCode: 422,
      statusMessage: 'Please correct the highlighted application fields.',
      data: { errors: result.errors },
    })
  }

  if (!config.resendApiKey) {
    console.error('Foster application email was not sent: RESEND_API_KEY is not configured.')
    throw createError({ statusCode: 503, statusMessage: 'Application delivery is temporarily unavailable.' })
  }

  const application = result.data
  application.applicationDate = new Date().toISOString()
  const resend = new Resend(config.resendApiKey)
  const applicantEmail = application.email.trim()
  const rescueInbox = String(config.fosterToEmail)
  const payload = {
    from: `${config.contactName} <${config.contactEmail}>`,
    to: [rescueInbox],
    cc: applicantEmail && applicantEmail.toLowerCase() !== rescueInbox.toLowerCase() ? [applicantEmail] : undefined,
    replyTo: applicantEmail,
    subject: `New foster application: ${application.fullName}`,
    html: renderFosterEmail(application),
  }
  const response = await resend.emails.send(payload)

  if (response.error) {
    console.error('Resend foster email error:', response.error)
    throw createError({ statusCode: 502, statusMessage: 'The application could not be delivered.' })
  }

  return { success: true, id: response.data?.id }
})
