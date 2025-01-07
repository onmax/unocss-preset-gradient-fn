import presetRemToPx from '@unocss/preset-rem-to-px'
import { presetAttributify, presetUno } from 'unocss'
import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vitepress'
import { presetEasingGradient } from '../../src/index'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'UnoCSS Preset Easing Gradient Docs',
  description: 'Docs for the UnoCSS Easing Gradient Docs',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' },
      { text: 'Playground', link: '/playground' },
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' },
    ],
  },
  vite: {
    plugins: [
      UnoCSS({
        presets: [
          presetUno(),
          presetAttributify(),
          presetEasingGradient(),
          presetRemToPx({ baseFontSize: 4 }),
        ],
      }),
    ],
  },
})
