import type { ParsedColorValue } from '@unocss/rule-utils'
import type { Preset } from 'unocss'
import { h, parseColor, positionMap } from '@unocss/preset-mini/utils'
import { colorToString } from '@unocss/rule-utils'
import { cubicBezier, easingFunctions } from './easing'

const toKebabCase = (str: string) => str.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/[\s_]+/g, '-').toLowerCase()
const toCamelCase = (str: string) => str.replace(/[-_](.)/g, (_, char) => char.toUpperCase())

const functionNames = Object.keys(easingFunctions).map(toKebabCase)
const functionNamesPattern = functionNames.join('|') // Create pattern for regex

// Generate gradient stops based on easing
function generateGradientStops(easingFn: (t: number) => number, steps: number, color: ParsedColorValue) {
  const stops: string[] = []

  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const easedT = easingFn(t)
    const opacity = 1 - easedT // Adjust opacity based on easing value
    const position = `${(easedT * 100).toFixed(2)}%`
    const colorStr = colorToString(color.cssColor!, opacity)
    stops.push(`${colorStr} ${position}`)
  }

  return stops.join(', ')
}

export function presetEasingGradient(): Preset {
  let fromColor: ParsedColorValue
  let toColor: ParsedColorValue
  let steps = 8
  return {
    name: 'unocss-preset-easing-gradient',
    rules: [
      [/^bg-easing-gradient-(.+)$/, () => ({}), {
        autocomplete: ['bg-easing-gradient', `bg-easing-gradient-(${functionNamesPattern})`, 'bg-easing-gradient-(from|to)-$colors'],
      }],
      [/^(?:bg-easing-gradient-)?from-(.+)$/, ([, color], { theme }) => {
        const parsedColor = parseColor(color!, theme)
        if (!parsedColor?.color)
          return
        fromColor = parsedColor
        return {}
      }],
      [/^(?:bg-easing-gradient-)?to-(.+)$/, ([, color], { theme }) => {
        const parsedColor = parseColor(color!, theme)
        if (!parsedColor?.color)
          return
        toColor = parsedColor
        return {}
      }],
      [/^(?:bg-easing-gradient-)?steps-(\d+)$/, ([, _steps]) => {
        steps = Number(_steps)
        return {}
      }],
      [/^bg-easing-gradient-to-([rltb]{1,2})$/, ([, d]) => {
        if (!(d! in positionMap))
          return
        return {
          '--un-easing-gradient-shape': `to ${positionMap[d!]} in oklch`,
          '--un-easing-gradient': 'var(--un-easing-gradient-shape), var(--un-easing-gradient-stops)',
          'background-image': 'linear-gradient(var(--un-easing-gradient))',
        }
      }, { autocomplete: `bg-easing-gradient-to-(${Object.keys(positionMap).filter(k => k.length <= 2 && Array.from(k).every(c => 'rltb'.includes(c))).join('|')})` }],
      [/^(?:bg-easing-gradient-)?shape-(.+)$/, ([, d]) => {
        const v = d! in positionMap ? `to ${positionMap[d!]}` : h.bracket(d!)
        if (v != null) {
          return {
            '--un-easing-gradient-shape': `${v} in oklch`,
            '--un-easing-gradient': 'var(--un-easing-gradient-shape), var(--un-easing-gradient-stops)',
          }
        }
      }, { autocomplete: ['bg-easing-gradient-shape', `bg-easing-gradient-shape-(${Object.keys(positionMap).join('|')})`, `shape-(${Object.keys(positionMap).join('|')})`] }],
      [/^bg-easing-gradient-((?:repeating-)?(?:linear|radial|conic))$/, ([, s]) => ({
        'background-image': `${s}-gradient(var(--un-easing-gradient, var(--un-easing-gradient-stops, rgb(255 255 255 / 0))))`,
      }), { autocomplete: ['bg-easing-gradient-repeating', 'bg-easing-gradient-(linear|radial|conic)', 'bg-easing-gradient-repeating-(linear|radial|conic)'] }],
      [
        new RegExp(`^(?:bg-easing-gradient-)?(${functionNamesPattern})$`),
        ([, _functionName]) => {
          const functionName = toCamelCase(_functionName!) as keyof typeof easingFunctions
          const easingFn = easingFunctions[functionName]
          if (!fromColor) {
            throw new Error(`Make sure to set \`bg-easing-gradient-from-$color\` before using \`bg-easing-gradient-$easingFunctions\``)
          }
          if (!toColor) {
            throw new Error(`Make sure to set \`bg-easing-gradient-to-$color\` before using \`bg-easing-gradient-$easingFunctions\``)
          }
          const gradientStops = generateGradientStops(easingFn, steps, fromColor)
          return {
            '--un-easing-gradient-stops': gradientStops,
            '--un-easing-gradient': `var(--un-easing-gradient-shape), ${gradientStops}`,
            'background-color': toColor.color!,
          }
        },
      ],

      [
        /^(?:bg-easing-gradient-)?bezier-\[(1|0?(?:\.\d+)?),(1|0?(?:\.\d+)?),(1|0?(?:\.\d+)?),(1|0?(?:\.\d+)?)\]$/,
        (matches) => {
          const [x1, y1, x2, y2] = matches.slice(1).map(Number)
          const easingFn = cubicBezier(x1!, y1!, x2!, y2!)
          if (!fromColor) {
            throw new Error(`Make sure to set \`bg-easing-gradient-from-$color\` before using \`bg-easing-gradient-$easingFunctions\``)
          }
          if (!toColor) {
            throw new Error(`Make sure to set \`bg-easing-gradient-to-$color\` before using \`bg-easing-gradient-$easingFunctions\``)
          }
          const gradientStops = generateGradientStops(easingFn, steps, fromColor)
          return {
            '--un-easing-gradient-stops': gradientStops,
            '--un-easing-gradient': `var(--un-easing-gradient-shape), ${gradientStops}`,
            'background-color': toColor.color!,
          }
        },
      ],

    ],
  }
}
