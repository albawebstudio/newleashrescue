import type { FosterApplicationData } from '../../shared/foster-form'
import { formatFosterDisplayValue, getFosterSteps, isFieldVisible as isFosterFieldVisible } from '../../shared/foster-form'
import type { VolunteerApplicationData } from '../../shared/volunteer-form'
import { formatVolunteerDisplayValue, getVolunteerSteps, isFieldVisible as isVolunteerFieldVisible } from '../../shared/volunteer-form'

export const programEmailHeader = {
  foster: { background: '#ff006e', accent: '#ffcce2' },
  volunteer: { background: '#3a86ff', accent: '#cce0ff' },
} as const

const escapeHtml = (value: unknown) => String(value ?? '')
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;')

const row = (label: string, value: string) => `
  <tr>
    <td style="width:38%;padding:11px 12px;border-bottom:1px solid #e5e7eb;color:#4b5563;font-size:13px;font-weight:700;vertical-align:top;">${escapeHtml(label)}</td>
    <td style="padding:11px 12px;border-bottom:1px solid #e5e7eb;color:#111827;font-size:14px;line-height:1.5;vertical-align:top;">${value}</td>
  </tr>`

const formatCell = (value: string) => escapeHtml(value).replaceAll('\n', '<br>')

function renderSections(
  title: string,
  subtitle: string,
  header: { background: string, accent: string },
  sections: string,
  extraSections: string,
  applicantEmail: string,
  applicantName: string,
) {
  return `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(title)}</title></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;color:#111827;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f3f4f6;border-collapse:collapse;">
    <tr><td align="center" style="padding:28px 12px;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:680px;background:#ffffff;border-collapse:separate;border-spacing:0;border-radius:16px;overflow:hidden;">
        <tr><td style="padding:28px 24px;background:${header.background};color:#ffffff;">
          <div style="font-size:12px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;">New Leash Rescue</div>
          <h1 style="margin:8px 0 4px;font-size:28px;line-height:1.25;">${escapeHtml(title)}</h1>
          <p style="margin:0;color:${header.accent};font-size:15px;">${escapeHtml(subtitle)}</p>
        </td></tr>
        ${sections}
        ${extraSections}
        <tr><td style="padding:4px 24px 28px;color:#6b7280;font-size:12px;line-height:1.5;">This application was submitted through newleashrescue.org. Reply directly to contact ${escapeHtml(applicantName)} at ${escapeHtml(applicantEmail)}.</td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

export function renderFosterEmail(data: FosterApplicationData): string {
  const submittedAt = new Date(data.applicationDate || Date.now()).toLocaleString('en-US', {
    timeZone: 'America/Chicago',
    dateStyle: 'long',
    timeStyle: 'short',
  })

  const applicationSections = getFosterSteps().slice(0, -1).map(step => {
    const rows = step.fields
      .filter(field => isFosterFieldVisible(field, data))
      .map(field => {
        const value = field.type === 'multiselect' ? data.fosterInterests : data[field.name]
        return row(field.label, formatCell(formatFosterDisplayValue(field, value as string | boolean | string[])))
      })
      .join('')

    return `
      <tr><td style="padding:0 24px 22px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #e5e7eb;border-radius:12px;border-collapse:separate;overflow:hidden;">
          <tr><td style="padding:14px 16px;background:#f9fafb;color:#111827;font-size:18px;font-weight:700;">${escapeHtml(step.title)}</td></tr>
          <tr><td><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">${rows}</table></td></tr>
        </table>
      </td></tr>`
  }).join('')

  const householdRows = [
    ...data.householdMembers.map((member, index) => row(`Adult ${index + 1}`, `${member.fullName} | ${member.birthDate}`)),
    ...(data.hasChildren === 'yes'
      ? data.householdChildren.map((child, index) => row(`Child ${index + 1}`, `${child.name} | Age ${child.age}`))
      : [row('Children', 'None listed')]),
    ...(data.hasOwnPets === 'yes'
      ? data.residentPets.map((pet, index) => row(`Pet ${index + 1}`, `${pet.speciesBreed} | Age ${pet.age} | Size ${pet.size}`))
      : [row('Resident pets', 'None')]),
  ].join('')

  const extraSections = `
    <tr><td style="padding:0 24px 22px;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #e5e7eb;border-radius:12px;border-collapse:separate;overflow:hidden;">
        <tr><td style="padding:14px 16px;background:#f9fafb;color:#111827;font-size:18px;font-weight:700;">Household details</td></tr>
        <tr><td><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">${householdRows}</table></td></tr>
      </table>
    </td></tr>`

  const header = programEmailHeader.foster
  const sections = `
    <tr><td style="padding:22px 24px 18px;color:#4b5563;font-size:14px;line-height:1.5;">
      Submitted ${escapeHtml(submittedAt)} Central Time
    </td></tr>
    ${applicationSections}`

  return renderSections(
    'New foster home application',
    `${data.fullName} applied to foster with New Leash Rescue`,
    header,
    sections,
    extraSections,
    data.email,
    data.fullName,
  )
}

export function renderVolunteerEmail(data: VolunteerApplicationData): string {
  const submittedAt = new Date(data.applicationDate || Date.now()).toLocaleString('en-US', {
    timeZone: 'America/Chicago',
    dateStyle: 'long',
    timeStyle: 'short',
  })

  const applicationSections = getVolunteerSteps().slice(0, -1).map(step => {
    const rows = step.fields
      .filter(field => isVolunteerFieldVisible(field, data))
      .map(field => {
        const value = field.type === 'multiselect' ? data.volunteerInterests : data[field.name]
        return row(field.label, formatCell(formatVolunteerDisplayValue(field, value as string | boolean | string[])))
      })
      .join('')

    return `
      <tr><td style="padding:0 24px 22px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #e5e7eb;border-radius:12px;border-collapse:separate;overflow:hidden;">
          <tr><td style="padding:14px 16px;background:#f9fafb;color:#111827;font-size:18px;font-weight:700;">${escapeHtml(step.title)}</td></tr>
          <tr><td><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">${rows}</table></td></tr>
        </table>
      </td></tr>`
  }).join('')

  const header = programEmailHeader.volunteer
  const sections = `
    <tr><td style="padding:22px 24px 18px;color:#4b5563;font-size:14px;line-height:1.5;">
      Submitted ${escapeHtml(submittedAt)} Central Time
    </td></tr>
    ${applicationSections}`

  return renderSections(
    'New volunteer application',
    `${data.fullName} applied to volunteer with New Leash Rescue`,
    header,
    sections,
    '',
    data.email,
    data.fullName,
  )
}
