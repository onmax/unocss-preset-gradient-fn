import { defineConfig, presetAttributify, presetUno } from 'unocss'
import { presetEasingGradient } from '../src'

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetEasingGradient(),
  ],
})
