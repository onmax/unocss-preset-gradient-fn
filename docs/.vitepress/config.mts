import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: 'unocss-preset-gradient-fn',
  title: 'UnoCSS Gradient Fn',
  description: 'Docs for the UnoCSS Easing Gradient Docs',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Getting started', link: '/getting-started' },
      { text: 'Docs', items: [{ text: 'Utilities', link: '/utilities' }, { text: 'FAQ', link: '/faq' }] },
      { text: 'Playground', link: '/playground' },
    ],

    sidebar: [
      {
        text: 'Docs',
        items: [
          { text: 'Getting started', link: '/getting-started' },
          { text: 'Utilities', link: '/utilities' },
          { text: 'FAQ', link: '/faq' },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/onmax/unocss-preset-gradient-fn' },
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
