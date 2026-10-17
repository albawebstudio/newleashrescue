import {
    CLOUDFLARE_WORKER_ROUTE_INCLUDES,
    STATIC_PRERENDER_ROUTES,
} from './shared/static-hosting'

export default defineNuxtConfig({
    app: {
        head: {
            charset: 'utf-8',
            viewport: 'width=device-width, initial-scale=1',
        }
    },
    compatibilityDate: '2026-03-09',
    devtools: { enabled: true },

    typescript: {
        nodeTsConfig: {
            compilerOptions: {
                types: ['node'],
            },
        },
    },

    css: [
        '@/assets/css/main.css',
    ],

    icon: {
        // Inline SVG so `fill="currentColor"` follows Tailwind text color (default `css` mode uses masks).
        mode: 'svg',
        customCollections: [{
            prefix: 'custom',
            dir: './app/assets/icons'
        }]
    },

    image: {
        cloudflare: {
            baseURL: 'https://newleashrescue.org/'
        }
    },

    runtimeConfig: {
        resendApiKey: process.env.RESEND_API_KEY ?? "",
        contactName: process.env.CONTACT_NAME ?? "New Leash Rescue",
        contactEmail: process.env.CONTACT_EMAIL ?? "website@newleashrescue.org",
        toEmail: process.env.TO_EMAIL ?? "adopt@newleashrescue.org",
        adoptionToEmail: process.env.ADOPTION_TO_EMAIL ?? "adopt@newleashrescue.org",
        fosterToEmail: process.env.FOSTER_TO_EMAIL ?? "adopt@newleashrescue.org",
        volunteerToEmail: process.env.VOLUNTEER_TO_EMAIL ?? "adopt@newleashrescue.org",
        public: {
            siteUrl: process.env.SITE_URL || 'https://newleashrescue.org',
            resendTemplateId: process.env.RESEND_TEMPLATE_ID ?? "",
            applicationDownloadsEnabled: process.env.NUXT_PUBLIC_APPLICATION_DOWNLOADS_ENABLED === 'true',
        }
    },
    modules: [
        '@nuxt/content',
        '@nuxt/image',
        '@nuxt/ui',
        'nuxt-gtag',
        'nuxt-security',
    ],

    gtag: {
        id: process.env.GTAG_ID,
    },

    security: {
        headers: {
            contentSecurityPolicy: {
                'img-src': [
                    "'self'",
                    "data:",
                    "https://www.paypalobjects.com/",
                    "https://*.cloudfront.net/"
                ],
                'script-src': [
                    "'self'",
                    "'unsafe-eval'",  // Required for the QR code library
                    'https:',
                    "'unsafe-inline'",
                    "https://static.cloudflareinsights.com/"
                ],
                'script-src-attr': [
                    "'unsafe-inline'",
                ],
                'form-action': [
                    "'self'",  // Allow form submissions to the same origin
                    "https://www.paypal.com"  // Allow form submissions to PayPal
                ],

            }
        },
    },
    // Build-time content DB via Node 22 `node:sqlite` (no native better-sqlite3 on CI).
    content: {
        experimental: {
            sqliteConnector: 'native',
        },
    },
    // Legal/content pages: build-time SQLite, browser WASM on navigation — no D1 at runtime.
    routeRules: {
        '/api/**': { prerender: false },
        '/**': { prerender: true },
    },
    nitro: {
        preset: 'cloudflare-pages',
        prerender: {
            crawlLinks: true,
            routes: [...STATIC_PRERENDER_ROUTES],
        },
        cloudflare: {
            nodeCompat: true,
            pages: {
                defaultRoutes: false,
                routes: {
                    include: [...CLOUDFLARE_WORKER_ROUTE_INCLUDES],
                },
            },
        },
    },
    vite: {
        optimizeDeps: {
            include: [
                'swiper/vue',
                'swiper/modules',
                'date-fns',
            ],
        },
    },
})
