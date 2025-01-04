import type { CSSColorValue, ParsedColorValue } from '@unocss/rule-utils'
import { colorToString } from '@unocss/rule-utils'
import * as culori from 'culori'

function interpolateColor(
  fromColor: ParsedColorValue,
  toColor: ParsedColorValue,
  t: number,
): ParsedColorValue {
  if (!fromColor.cssColor || !toColor.cssColor) {
    throw new Error('Both fromColor and toColor must have cssColor defined.')
  }

  // Convert colors to OKLCH
  const fromOKLCH = convertToOKLCH(fromColor.cssColor)
  const toOKLCH = convertToOKLCH(toColor.cssColor)

  // Interpolate components
  const interpolatedComponents = interpolateComponents(
    fromOKLCH.components,
    toOKLCH.components,
    t,
  )

  // Interpolate alpha
  const interpolatedAlpha = interpolateAlpha(
    fromOKLCH.alpha,
    toOKLCH.alpha,
    t,
  )

  return {
    cssColor: {
      type: 'oklch',
      components: interpolatedComponents,
      alpha: interpolatedAlpha,
    },
    opacity: `${interpolatedAlpha}`!,
    alpha: interpolatedAlpha,
    name: `oklch(${interpolatedComponents.join(', ')})`,
    no: fromColor.no,
  }
}

function interpolateComponents(
  fromComponents: (string | number)[],
  toComponents: (string | number)[],
  t: number,
): (string | number)[] {
  return fromComponents.map((fromComp, i) => {
    const toComp = toComponents[i]
    const fromValue = Number.parseFloat(fromComp as string)
    const toValue = Number.parseFloat(toComp as string)

    // Handle hue interpolation
    if (i === 2) { // Assuming hue is the third component in OKLCH
      let delta = toValue - fromValue
      if (Math.abs(delta) > 180) {
        delta -= Math.sign(delta) * 360
      }
      return fromValue + delta * t
    }
    else {
      return fromValue + (toValue - fromValue) * t
    }
  })
}

function interpolateAlpha(
  alpha1: string | number | undefined,
  alpha2: string | number | undefined,
  t: number,
): string | number | undefined {
  const a1 = alpha1 != null ? Number.parseFloat(alpha1 as string) : 1
  const a2 = alpha2 != null ? Number.parseFloat(alpha2 as string) : 1
  const interpolatedAlpha = a1 + (a2 - a1) * t
  return interpolatedAlpha
}

function convertToOKLCH(color: CSSColorValue): CSSColorValue {
  const { alpha } = color
  const colorString = colorToString(color)

  // Use a color conversion library or custom implementation
  // For this example, we'll assume a function `convertColorToOKLCH` exists
  const oklchComponents = culori.oklch(colorString)
  if (!oklchComponents)
    throw new Error('Failed to convert color to OKLCH')

  return {
    type: 'oklch',
    components: [oklchComponents.l, oklchComponents.c, oklchComponents.h!],
    alpha,
  }
}

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

  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const easedT = easingFn(t)
    const interpolatedColor = interpolateColor(fromColor, toColor, easedT)
    const colorStr = colorToString(interpolatedColor.cssColor!)

    let position = ''
    if(length) {
      position = `calc(${t.toFixed(4)} * var(--un-easing-gradient-length))`
    } else {
      position = `${(t * 100).toFixed(2)}%`
    }

    stops.push(`${colorStr} ${position}`)
  }

  return stops.join(', ')
}
