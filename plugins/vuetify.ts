import 'vuetify/styles'
import {createVuetify} from 'vuetify'
import {md3} from 'vuetify/blueprints'
import colors from 'vuetify/util/colors'
import {aliases as allAliases, mdi} from 'vuetify/iconsets/mdi-svg'

const aliases = allAliases;

export default defineNuxtPlugin((nuxtApp) => {
    const vuetify = createVuetify({
        blueprint: md3,
        defaults: {
            VBtn: {
                color: 'accent',
            },
            VTabs: {
                color: 'on-primary',
            }
        },
        icons: {
            defaultSet: 'mdi',
            aliases,
            sets: {mdi}
        },
        theme: {
            defaultTheme: 'appTheme',
            themes: {
                appTheme: {
                    dark: true,
                    colors: {
                        primary: colors.blue.darken2,
                        accent: colors.grey.darken3,
                        secondary: colors.amber.darken3,
                        info: colors.teal.lighten1,
                        warning: colors.amber.base,
                        error: colors.deepOrange.accent4,
                        success: colors.green.accent3
                    }
                }
            }
        }
    })

    nuxtApp.vueApp.use(vuetify)
});
