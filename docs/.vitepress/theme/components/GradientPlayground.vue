<script setup lang="ts">
import { createGenerator } from '@unocss/core'
import { presetMini } from '@unocss/preset-mini'
import { computedAsync, useLocalStorage, useStyleTag } from '@vueuse/core'
import { computed, watch, watchEffect } from 'vue'
import { presetGradientFn } from '../../../../src'
import { easingFunctions } from '../../../../src/easing'

const easingFunctionsNames = Object.keys(easingFunctions)

const defaultFromColor = '#ffd200'
const defaultToColor = '#f0008b'
const defaultFromHoverColor = '#7800e1'
const defaultToHoverColor = '#00ccff'
const defaultSteps = 4
// const defaultLength = '100%'

const fromColor = useLocalStorage('from', defaultFromColor)
const toColor = useLocalStorage('to', defaultToColor)
const fromHoverColor = useLocalStorage('from-hover', defaultFromHoverColor)
const toHoverColor = useLocalStorage('to-hover', defaultToHoverColor)
const steps = useLocalStorage('steps', defaultSteps)
// const length = useLocalStorage('length', defaultLength)

const toKebabCase = (str: string) => str.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/[\s_]+/g, '-').toLowerCase()

function reset() {
  fromColor.value = defaultFromColor
  toColor.value = defaultToColor
  fromHoverColor.value = defaultFromHoverColor
  toHoverColor.value = defaultToHoverColor
  // length.value = defaultLength
  steps.value = defaultSteps
}

const easeFn = useLocalStorage('easing-function', 'ease')

const unocssCode = computed(() => {
  const gradient = `to-b ${toKebabCase(easeFn.value)}${steps.value !== 8 ? `/${steps.value}` : ''} from-[${fromColor.value}] to-[${toColor.value}]`.split(' ').map(c => `bg-gradient-fn-${c}`).join(' ')
  const gradientVariants = `hover:from-[${fromHoverColor.value}] hover:to-[${toHoverColor.value}]`.split(' ').map(c => `${c.split(':').at(0)}:bg-gradient-fn-${c.split(':').at(1)}`).join(' ')
  const transition = `transition-colors duration-1s`
  return `${gradient} ${gradientVariants} ${transition}`
})

const ctx = createGenerator({ presets: [presetMini(), presetGradientFn()] })
const cssCode = computedAsync(async () => {
  const res = await ctx.generate(unocssCode.value)
  return res.css
})

watchEffect(() => {
  useStyleTag(cssCode.value || '', { id: 'gradient' })
})
</script>

<template>
  <div flex="~ col gap-24" w-full max-w-screen>
    <small>Put the mouse over the gradient to see the transition</small>
    <div mt-64 flex="~ gap-32 justify-between">
      <div flex-1>
        <button bg-blue-400 px-8 py-4 rounded-4 mb-16 @click="reset">
          Reset
        </button>

        <form flex="~ col gap-12">
          <fieldset>
            <legend>Color</legend>
            <input v-model="fromColor" type="color">
            <input v-model="toColor" type="color">
          </fieldset>
          <fieldset>
            <legend>Hover</legend>
            <input v-model="fromHoverColor" type="color">
            <input v-model="toHoverColor" type="color">
          </fieldset>
          <fieldset>
            <legend>Easing function</legend>
            <select v-model="easeFn" px-8 py-3 rounded-4>
              <option v-for="option in easingFunctionsNames" :key="option" :name="option" :value="option">
                {{ option }}
              </option>
            </select>
          </fieldset>
          <!-- <fieldset>
            <legend>Length (%)</legend>
            <input v-model="length" type="text" px-8 py-3 bg-white:10 rounded-2>
            <small block>Any CSS length value like <code cursor-pointer @click="() => length = `calc(128px + 16px)`">calc(128px + 16px)</code></small>
          </fieldset> -->
          <fieldset>
            <legend>Steps</legend>
            <input v-model="steps" type="range" :min="2" :max="16" px-8 py-3 bg-white:10 rounded-2>
            {{ steps }}
            <small block>The amount of steps in the gradient.</small>
          </fieldset>
        </form>
      </div>
      <div flex-1 aspect-1 rounded-8 :class="unocssCode" />
    </div>

    <details>
      <summary flex="~ gap-32" w-full>
        <h2 m-0>
          > Output
        </h2>
      </summary>
      <h3>
        UnoCSS code
      </h3>
      <pre w-full max-w-full bg="white/10" rounded-8 p-24 whitespace-pre-wrap break-words>
        {{ `<div class="${unocssCode}"></div>` }}
      </pre>
      <h3>
        CSS code
      </h3>
      <pre w-full max-w-full bg="white/10" rounded-8 p-24 whitespace-pre-wrap break-words>
        {{ cssCode }}
      </pre>
    </details>
  </div>
</template>
