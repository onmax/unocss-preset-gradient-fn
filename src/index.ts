// ****************** Warning ******************
//
// The code of this library has been moved to https://github.com/onmax/unocss-preset-onmax/tree/main/packages/unocss-preset-easing-gradient
// Please use the new package instead.
// ***********************************************

import type { Preset } from 'unocss'
import { theme } from '@unocss/preset-mini/theme'
import { h, parseColor, positionMap } from '@unocss/preset-mini/utils'
import { cubicBezier, easingFunctions as defaultEasingFunctions } from './easing'

interface presetGradientFnOptions {
  customFunctions?: Record<string, (t: number) => number>
}

const varPrefix = `--un-gradient-fn`
const colorSpace = `var(${varPrefix}-color-space, in oklch)`
const validColorSpaces = ['srgb', 'srgb-linear', 'display-p3', 'oklch', 'a98-rgb', 'prophoto-rgb', 'rec2020', 'xyz'].join('|')

// https://github.com/unocss/unocss/blob/8cfcf603ae54fa92098ed32e1dfe3148eac1d796/packages/preset-attributify/src/variant.ts
// eslint-disable-next-line regexp/no-super-linear-backtracking
export const variantsRE = /^(?!.*\[[^:]+:.+\]$)((?:.+:)?!?)(.*)$/

const toKebabCase = (str: string) => str.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/[\s_]+/g, '-').toLowerCase()
const toCamelCase = (str: string) => str.replace(/[-_](.)/g, (_, char) => char.toUpperCase())

export function presetGradientFn(options: presetGradientFnOptions = {}): Preset {
  const easingFunctions = {
    ...defaultEasingFunctions,
    ...(options.customFunctions || {}),
  }
  const functionNames = Object.keys(easingFunctions).map(toKebabCase)
  const functionNamesPattern = functionNames.join('|') // Create pattern for regex

  return {
    name: 'unocss-preset-gradient-fn',
    theme: {
      transitionProperty: {
        colors: [theme.transitionProperty.colors, `${varPrefix}-from`, `${varPrefix}-to`].join(','),
      },
    },
    preflights: [
      {
        getCSS() {
          return `@property ${varPrefix}-from {
  syntax: "<color>";
  inherits: false;
  initial-value: #000
}
@property ${varPrefix}-to {
  syntax: "<color>";
  inherits: false;
  initial-value: #000
}`
        },
      },
    ],
    rules: [
      [/^bg-gradient-fn-(.+)$/, () => ({}), {
        autocomplete: ['bg-gradient-fn', `bg-gradient-fn-(${functionNamesPattern})`, 'bg-gradient-fn-(from|to)-$colors', 'bg-gradient-fn-steps-$number'],
      }],
      [/^(?:bg-gradient-)?fn-(to|from)-(.+)$/, function ([, spot, color], { theme }) {
        const parsedColor = parseColor(color!, theme)
        return { [`${varPrefix}-${spot}`]: parsedColor?.color || 'black' }
      }, { autocomplete: ['bg-gradient-from-$colors', 'bg-gradient-to-$colors'] }],
      [/^(?:bg-gradient-)?fn-color-space-(srgb|srgb-linear|display-p3|oklch|a98-rgb|prophoto-rgb|rec2020|xyz)$/, ([, colorSpace]) => {
        return { [`${varPrefix}-color-space`]: `in ${colorSpace}` }
      }, { autocomplete: `bg-gradient-fn-color-space-(${validColorSpaces})` }],
      // [
      //   /^(?:bg-gradient-)?fn-length-(?:([\d.]+(?:px|rem|em|%)?)|\[(.+)\])$/,
      //   ([_, numericVal, bracketVal]) => {
      //     let value
      //     if (numericVal) {
      //       // If user wrote just a number (e.g. "120"), add "px"
      //       // If user wrote "120px" or "1rem", keep it
      //       value = /\D$/.test(numericVal) ? numericVal : `${numericVal}px`
      //     }
      //     else if (bracketVal) {
      //       value = h.bracket(`[${bracketVal}]`)
      //     }
      //     return { [`${varPrefix}-length`]: value }
      //   },
      //   {
      //     autocomplete: `bg-gradient-fn-length-$number`,
      //   },
      // ],
      [/^(?:bg-gradient-)?fn-to-([rltb]{1,2})$/, ([, d]) => {
        if (!(d! in positionMap))
          return
        return {
          [`${varPrefix}-shape`]: `to ${positionMap[d!]} ${colorSpace}`,
          [`${varPrefix}-gradient`]: `var(${varPrefix}-shape), var(${varPrefix}-stops)`,
          'background-image': `linear-gradient(var(${varPrefix}-gradient))`,
        }
      }, { autocomplete: `bg-gradient-fn-to-(${Object.keys(positionMap).filter(k => k.length <= 2 && Array.from(k).every(c => 'rltb'.includes(c))).join('|')})` }],
      [/^(?:bg-gradient-)?fn-shape-(.+)$/, ([, d]) => {
        const v = d! in positionMap ? `to ${positionMap[d!]}` : h.bracket(d!)
        if (v != null) {
          return {
            [`${varPrefix}-shape`]: `${v} ${colorSpace}`,
            [`${varPrefix}-gradient`]: `var(${varPrefix}-shape), var(${varPrefix}-stops)`,
          }
        }
      }, { autocomplete: ['bg-gradient-fn-shape', `bg-gradient-fn-shape-(${Object.keys(positionMap).join('|')})`, `shape-(${Object.keys(positionMap).join('|')})`] }],
      [/^bg-gradient-fn-((?:repeating-)?(?:linear|radial|conic))$/, ([, s]) => ({
        'background-image': `${s}-gradient(var(${varPrefix}-gradient, var(${varPrefix}-stops, rgb(255 255 255 / 0))))`,
      }), { autocomplete: ['bg-gradient-fn-repeating', 'bg-gradient-fn-(linear|radial|conic)', 'bg-gradient-fn-repeating-(linear|radial|conic)'] }],
      [
        new RegExp(`^(?:bg-gradient-)?fn-(${functionNamesPattern})(?:/(\\d+))?$`),
        ([, _functionName, maybeSteps]) => {
          const functionName = toCamelCase(_functionName!) as keyof typeof easingFunctions
          const easingFn = easingFunctions[functionName]
          return generateGradient({ easingFn, maybeSteps })
        },
      ],
      [
        /^(?:bg-gradient-)?fn-bezier-\[([01](?:\.\d+)?),([01](?:\.\d+)?),([01](?:\.\d+)?),([01](?:\.\d+)?)\](?:\/(\d+))?$/,
        ([_, x1, y1, x2, y2, maybeSteps]) => {
          const easingFn = cubicBezier(Number(x1!), Number(y1!), Number(x2!), Number(y2!))
          return generateGradient({ easingFn, maybeSteps })
        },
      ],
    ],
  }
}

interface GenerateGradientStopsOptions {
  easingFn: (t: number) => number

  /**
   * The number of steps that the gradient should interpolate
   *
   * @default 4
   */
  maybeSteps?: string
}

function generateGradient(options: GenerateGradientStopsOptions) {
  const { easingFn, maybeSteps } = options
  const steps = maybeSteps ? Number.parseInt(String(maybeSteps), 10) : 4

  /**
   * 1) Generate an array of “base” colors from i=0..steps
   *    using color-mix(...) for each step fraction.
   */
  const baseColors: string[] = []
  for (let i = 0; i <= steps; i++) {
    const t = easingFn(i / steps) // 0..1
    baseColors.push(
      `color-mix(${colorSpace}, var(${varPrefix}-from), var(${varPrefix}-to) ${Math.round(t * 100)}%)`,
    )
  }

  /**
   * 2) Build up the stops by taking each adjacent pair:
   *    - At step start:   baseColors[i]
   *    - At step middle:  color-mix(...) of [i, i+1] (50-50)
   *    - At step end:     baseColors[i+1]
   */
  const stops: string[] = []
  for (let i = 0; i < steps; i++) {
    const colorA = baseColors[i]
    const colorB = baseColors[i + 1]

    // Step start/end positions (as fractions)
    const stepStart = i / steps
    const stepEnd = (i + 1) / steps
    // Middle is halfway between start and end
    const stepMid = (stepStart + stepEnd) / 2

    // Convert to percentage strings or use calc() if you prefer
    const stepStartPct = `${(stepStart * 100).toFixed(2)}%`
    const stepMidPct = `${(stepMid * 100).toFixed(2)}%`
    const stepEndPct = `${(stepEnd * 100).toFixed(2)}%`

    // Mid color is 50% mix of colorA and colorB
    const midColor = `color-mix(${colorSpace}, ${colorA}, ${colorB} 50%)`

    /**
     * 3) For each step i, we add 3 stops:
     *    1) colorA at stepStart
     *    2) midColor at stepMid
     *    3) colorB at stepEnd
     *
     * This will produce a subtle gradient in the middle of each step.
     */
    stops.push(`${colorA} ${stepStartPct}`)
    stops.push(`${midColor} ${stepMidPct}`)
    stops.push(`${colorB} ${stepEndPct}`)
  }

  // 4) Join them into a single comma-separated list
  const gradientStops = stops.join(', ')

  // 5) Return object for custom properties usage
  return {
    [`${varPrefix}-stops`]: gradientStops,
    [`${varPrefix}-gradient`]: `var(${varPrefix}-shape), ${gradientStops}`,
  }
}
