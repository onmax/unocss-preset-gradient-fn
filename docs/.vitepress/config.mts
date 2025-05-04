import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/unocss-preset-gradient-fn',
  title: 'UnoCSS Gradient Fn',
  description: 'Docs for the UnoCSS Easing Gradient Docs',
  themeConfig: {
    socialLinks: [
      { icon: 'github', link: 'https://github.com/onmax/unocss-preset-onmax/tree/main/packages/unocss-preset-easing-gradient/' },
      { icon: 'bsky', link: 'https://bsky.app/profile/onmax.bsky.social' },
    ],
  },
  vite: {
    plugins: [
      UnoCSS({
        configFile: '../../unocss.config.ts',
      }),
    ],
  },
})
