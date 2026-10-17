import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  CLOUDFLARE_WORKER_ROUTE_INCLUDES,
  STATIC_PRERENDER_ROUTES,
} from '../../shared/static-hosting'

describe('static hosting configuration', () => {
  it('lists every form API route for the Cloudflare Worker', () => {
    expect(CLOUDFLARE_WORKER_ROUTE_INCLUDES).toContain('/api/send')
    expect(CLOUDFLARE_WORKER_ROUTE_INCLUDES).toEqual(
      expect.arrayContaining(['/api/adopt', '/api/foster', '/api/volunteer']),
    )
  })

  it('prerenders legal content routes', () => {
    expect(STATIC_PRERENDER_ROUTES).toEqual(
      expect.arrayContaining(['/legal/terms', '/legal/privacy']),
    )
  })

  it('does not configure D1 in wrangler.toml', () => {
    const wrangler = readFileSync(resolve(process.cwd(), 'wrangler.toml'), 'utf8')
    expect(wrangler).not.toMatch(/d1_databases/)
  })

  it('uses Node native sqlite for content builds (no better-sqlite3)', () => {
    const nuxtConfig = readFileSync(resolve(process.cwd(), 'nuxt.config.ts'), 'utf8')
    expect(nuxtConfig).toMatch(/sqliteConnector:\s*['"]native['"]/)
    const pkg = readFileSync(resolve(process.cwd(), 'package.json'), 'utf8')
    expect(pkg).not.toMatch(/"better-sqlite3"/)
  })
})
