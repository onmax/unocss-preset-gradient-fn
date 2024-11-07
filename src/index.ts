import type { ParsedColorValue } from '@unocss/rule-utils'
import type { Preset } from 'unocss'
import { h, parseColor, positionMap } from '@unocss/preset-mini/utils'
import { cubicBezier, easingFunctions } from './easing'
import { generateGradientStops } from './gradients'

const toKebabCase = (str: string) => str.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/[\s_]+/g, '-').toLowerCase()
const toCamelCase = (str: string) => str.replace(/[-_](.)/g, (_, char) => char.toUpperCase())

const functionNames = Object.keys(easingFunctions).map(toKebabCase)
const functionNamesPattern = functionNames.join('|') // Create pattern for regex

export function presetEasingGradient(): Preset {
  let fromColor: ParsedColorValue
  let toColor: ParsedColorValue
  let steps = 8
  return {
    name: 'unocss-preset-easing-gradient',
    rules: [
      [/^bg-gradient-fn-(.+)$/, () => ({}), {
        autocomplete: ['bg-gradient-fn', `bg-gradient-fn-(${functionNamesPattern})`, 'bg-gradient-fn-(from|to)-$colors', 'bg-gradient-fn-steps-$number'],
      }],
      [/^(?:bg-gradient-fn-)?from-(.+)$/, ([, color], { theme }) => {
        const parsedColor = parseColor(color!, theme)
        if (!parsedColor?.color)
          return
        fromColor = parsedColor
        return {}
      }],
      [/^(?:bg-gradient-fn-)?to-(.+)$/, ([, color], { theme }) => {
        const parsedColor = parseColor(color!, theme)
        if (!parsedColor?.color)
          return
        toColor = parsedColor
        return {}
      }],
      [/^(?:bg-gradient-fn-)?steps-(\d+)$/, ([, _steps]) => {
        steps = Number(_steps)
        return {}
      }],
      [/^(?:bg-gradient-fn-)?to-([rltb]{1,2})$/, ([, d]) => {
        if (!(d! in positionMap))
          return
        return {
          '--un-easing-gradient-shape': `to ${positionMap[d!]} in oklch`,
          '--un-easing-gradient': 'var(--un-easing-gradient-shape), var(--un-easing-gradient-stops)',
          'background-image': 'linear-gradient(var(--un-easing-gradient))',
        }
      }, { autocomplete: `bg-gradient-fn-to-(${Object.keys(positionMap).filter(k => k.length <= 2 && Array.from(k).every(c => 'rltb'.includes(c))).join('|')})` }],
      [/^(?:bg-gradient-fn-)?shape-(.+)$/, ([, d]) => {
        const v = d! in positionMap ? `to ${positionMap[d!]}` : h.bracket(d!)
        if (v != null) {
          return {
            '--un-easing-gradient-shape': `${v} in oklch`,
            '--un-easing-gradient': 'var(--un-easing-gradient-shape), var(--un-easing-gradient-stops)',
          }
        }
      }, { autocomplete: ['bg-gradient-fn-shape', `bg-gradient-fn-shape-(${Object.keys(positionMap).join('|')})`, `shape-(${Object.keys(positionMap).join('|')})`] }],
      [/^bg-gradient-fn-((?:repeating-)?(?:linear|radial|conic))$/, ([, s]) => ({
        'background-image': `${s}-gradient(var(--un-easing-gradient, var(--un-easing-gradient-stops, rgb(255 255 255 / 0))))`,
      }), { autocomplete: ['bg-gradient-fn-repeating', 'bg-gradient-fn-(linear|radial|conic)', 'bg-gradient-fn-repeating-(linear|radial|conic)'] }],
      [
        new RegExp(`^(?:bg-gradient-fn-)?fn-(${functionNamesPattern})$`),
        ([, _functionName]) => {
          const functionName = toCamelCase(_functionName!) as keyof typeof easingFunctions
          const easingFn = easingFunctions[functionName]
          if (!fromColor) {
            throw new Error(`Make sure to set \`bg-gradient-fn-from-$color\` before using \`bg-gradient-fn-$easingFunctions\``)
          }
          if (!toColor) {
            throw new Error(`Make sure to set \`bg-gradient-fn-to-$color\` before using \`bg-gradient-fn-$easingFunctions\``)
          }
          const gradientStops = generateGradientStops(easingFn, steps, fromColor, toColor)
          return {
            '--un-easing-gradient-stops': gradientStops,
            '--un-easing-gradient': `var(--un-easing-gradient-shape), ${gradientStops}`,
            // 'background-color': 'var(--un-easing-gradient-to-color)',
          }
        },
      ],

      [
        /^(?:bg-gradient-fn-)?bezier-\[(1|0?(?:\.\d+)?),(1|0?(?:\.\d+)?),(1|0?(?:\.\d+)?),(1|0?(?:\.\d+)?)\]$/,
        (matches) => {
          const [x1, y1, x2, y2] = matches.slice(1).map(Number)
          const easingFn = cubicBezier(x1!, y1!, x2!, y2!)
          if (!fromColor) {
            throw new Error(`Make sure to set \`bg-gradient-fn-from-$color\` before using \`bg-gradient-fn-$easingFunctions\``)
          }
          if (!toColor) {
            throw new Error(`Make sure to set \`bg-gradient-fn-to-$color\` before using \`bg-gradient-fn-$easingFunctions\``)
          }
          const gradientStops = generateGradientStops(easingFn, steps, fromColor, toColor)
          return {
            '--un-easing-gradient-stops': gradientStops,
            '--un-easing-gradient': `var(--un-easing-gradient-shape), ${gradientStops}`,
            'background-color': 'var(--un-easing-gradient-to-color)',
          }
        },
      ],

    ],
  }
}
