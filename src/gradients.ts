import type { ParsedColorValue } from '@unocss/rule-utils'
import { colorToString } from '@unocss/rule-utils'
import Color from 'colorjs.io'

export interface GenerateGradientStopsOptions {
  steps: number
  fromColor: ParsedColorValue
  toColor: ParsedColorValue
  easingFn: (t: number) => number
  length?: number
}

export function generateGradientStops(options: GenerateGradientStopsOptions) {
  const { steps, fromColor, toColor, easingFn, length } = options
  const stops: string[] = []

  // Convert input colors into Color.js objects
  const from = new Color(colorToString(fromColor.cssColor!))
  const to = new Color(colorToString(toColor.cssColor!))

  // Create a range in a chosen color space, for example "oklch"
  const colorRange = from.range(to, { space: 'oklch' })

  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const easedT = easingFn(t)

    // Get the interpolated color
    const interpolated = colorRange(easedT)

    // Convert to string in a format of your choice
    const colorStr = interpolated.toString({ format: 'oklch', alpha: true })

    // Compute position
    let position = ''
    position = length
      ? `calc(${t.toFixed(4)} * var(--un-easing-gradient-length))`
      : `${(t * 100).toFixed(2)}%`

    stops.push(`${colorStr} ${position}`)
  }

  return stops.join(', ')
}
