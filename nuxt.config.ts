// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@nuxt/image', '@nuxt/eslint'],
  css: ['./assets/css/main.css'],
  // Prettier owns formatting; ESLint handles logic only (no stylistic rules).
  eslint: {
    config: {
      stylistic: false,
    },
  },
  // Surface TypeScript errors in the terminal during `nuxt dev` and `nuxt build`.
  typescript: {
    typeCheck: true,
  },
  vite: {
    optimizeDeps: {
      include: ['better-auth/client/plugins', 'better-auth/vue', 'zod'],
    },
  },
})
