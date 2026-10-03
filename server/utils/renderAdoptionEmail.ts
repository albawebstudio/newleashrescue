import type { AdoptionApplicationData } from '../../shared/adoption-form'
import { getAdoptionSteps, isFieldVisible } from '../../shared/adoption-form'

export const adoptionEmailHeader = {
  dog: { background: '#fb5607', accent: '#ffeee6' },
  cat: { background: '#8338ec', accent: '#f3e8ff' },
} as const

const escapeHtml = (value: unknown) => String(value ?? '')
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;')

const formatValue = (value: string | boolean) => {
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  if (!value) return 'Not provided'
  return escapeHtml(value.replaceAll('-', ' ')).replaceAll('\n', '<br>')
}

const row = (label: string, value: string | boolean) => `
  <tr>
    <td style="width:38%;padding:11px 12px;border-bottom:1px solid #e5e7eb;color:#4b5563;font-size:13px;font-weight:700;vertical-align:top;">${escapeHtml(label)}</td>
    <td style="padding:11px 12px;border-bottom:1px solid #e5e7eb;color:#111827;font-size:14px;line-height:1.5;vertical-align:top;">${formatValue(value)}</td>
  </tr>`

export function renderAdoptionEmail(data: AdoptionApplicationData): string {
  const applicationSections = getAdoptionSteps(data.type).slice(0, -1).map(step => {
    const rows = step.fields
      .filter(field => isFieldVisible(field, data))
      .map(field => row(field.label, data[field.name]))
      .join('')

    return `
      <tr><td style="padding:0 24px 22px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #e5e7eb;border-radius:12px;border-collapse:separate;overflow:hidden;">
          <tr><td style="padding:14px 16px;background:#f9fafb;color:#111827;font-size:18px;font-weight:700;">${escapeHtml(step.title)}</td></tr>
          <tr><td><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">${rows}</table></td></tr>
        </table>
      </td></tr>`
  }).join('')

  const header = adoptionEmailHeader[data.type]
  const householdRows = data.householdMembers.length
    ? data.householdMembers.map((member, index) => row(`Person ${index + 1}`, `${member.fullName} | ${member.birthDate} | ${member.relationship}`)).join('')
    : row('Other household members', 'None listed')
  const residentPetRows = data.hasResidentPets === 'yes'
    ? data.residentPets.map((pet, index) => row(`Pet ${index + 1}`, `${pet.speciesBreed} | Age ${pet.age} | ${pet.gender}`)).join('')
    : row('Resident pets', 'None')

  return `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>New ${escapeHtml(data.type)} adoption application</title></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;color:#111827;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(data.fullName)} applied to adopt ${escapeHtml(data.animalName)}.</div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f3f4f6;border-collapse:collapse;">
    <tr><td align="center" style="padding:28px 12px;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:680px;background:#ffffff;border-collapse:separate;border-spacing:0;border-radius:16px;overflow:hidden;">
        <tr><td style="padding:28px 24px;background:${header.background};color:#ffffff;">
          <div style="font-size:12px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;">New Leash Rescue</div>
          <h1 style="margin:8px 0 4px;font-size:28px;line-height:1.25;">New ${escapeHtml(data.type)} adoption application</h1>
          <p style="margin:0;color:${header.accent};font-size:15px;">${escapeHtml(data.fullName)} is interested in ${escapeHtml(data.animalName)}</p>
        </td></tr>
        <tr><td style="padding:22px 24px 18px;color:#4b5563;font-size:14px;line-height:1.5;">
          Submitted ${escapeHtml(new Date(data.applicationDate || Date.now()).toLocaleString('en-US', { timeZone: 'America/Chicago', dateStyle: 'long', timeStyle: 'short' }))} Central Time
        </td></tr>
        ${applicationSections}
        <tr><td style="padding:0 24px 22px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #e5e7eb;border-radius:12px;border-collapse:separate;overflow:hidden;">
            <tr><td style="padding:14px 16px;background:#f9fafb;color:#111827;font-size:18px;font-weight:700;">Household details</td></tr>
            <tr><td><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">${householdRows}${residentPetRows}</table></td></tr>
          </table>
        </td></tr>
        <tr><td style="padding:4px 24px 28px;color:#6b7280;font-size:12px;line-height:1.5;">This application was submitted through newleashrescue.org. Reply directly to contact ${escapeHtml(data.fullName)} at ${escapeHtml(data.email)}.</td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}
