import presetRemToPx from '@unocss/preset-rem-to-px'
import { defineConfig, presetAttributify, presetUno } from 'unocss'
import { presetGradientFn } from './src/index'

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetGradientFn(),
    presetRemToPx({ baseFontSize: 4 }),
  ],
})
