// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: false },
  modules: ["vuetify-nuxt-module", "nuxt-auth-utils", "@pinia/nuxt"],
  css: ["@mdi/font/css/materialdesignicons.css"],
  vuetify: {
    vuetifyOptions: {
      icons: {
        defaultSet: "mdi",
      },
      theme: {
        defaultTheme: "dark",
      },
    },
  },
  devServer: {
    host: "0.0.0.0",
  },
  runtimeConfig: {
    session: {
      cookie: {
        secure: false,
        sameSite: "lax",
      },
    },
  },
});
