import { parseApplicationDownloadsEnabled } from '#shared/feature-flags'

export function useApplicationDownloadsEnabled() {
  const { public: { applicationDownloadsEnabled } } = useRuntimeConfig()
  return computed(() => parseApplicationDownloadsEnabled(applicationDownloadsEnabled))
}
