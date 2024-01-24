import vuetify from 'vite-plugin-vuetify'

export default defineNuxtConfig({
    ssr: false,
    app: {
        head: {
            titleTemplate: '%s - SpotifyStats',
            title: 'SpotifyStats',
            meta: [
                {
                    name: 'description',
                    content: 'Analyze your Spotify GDPR data-dump locally on your machine.'
                }
            ],
            link: [
                {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'}
            ]
        }
    },
    build: {
        transpile: ['vuetify'],
    },
    modules: [
        // Vuetify
        async (options, nuxt) => {
            nuxt.hooks.hook('vite:extendConfig', (config) =>
                // @ts-ignore
                config.plugins.push(vuetify())
            )
        },
    ],
    nitro: {
        preset: 'github-pages'
    },
    typescript: {
        strict: true,
    },
})
