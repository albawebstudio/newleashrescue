/** Parses Nuxt public runtime config values for on/off feature flags. */
export function parseApplicationDownloadsEnabled(value: unknown): boolean {
  return value === true || value === 'true'
}
