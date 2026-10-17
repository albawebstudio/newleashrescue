/** Routes prerendered at build time (in addition to link crawl from `/`). */
export const STATIC_PRERENDER_ROUTES = [
  '/',
  '/about',
  '/adopt',
  '/adopt/dog',
  '/adopt/cat',
  '/contact',
  '/contact-us',
  '/donate',
  '/donate/cancel',
  '/events',
  '/foster',
  '/foster/apply',
  '/legal/terms',
  '/legal/privacy',
  '/sponsors',
  '/volunteer',
  '/volunteer/apply',
] as const

/** Cloudflare Pages Functions invocation routes (static assets are served without the Worker). */
export const CLOUDFLARE_WORKER_ROUTE_INCLUDES = [
  '/api/send',
  '/api/adopt',
  '/api/foster',
  '/api/volunteer',
] as const
