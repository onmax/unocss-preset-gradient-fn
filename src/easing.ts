const linear = (t: number) => t

const ease = (t: number) => t * t
const easeIn = (t: number) => t * t * t
const easeOut = (t: number) => t * (2 - t)
function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
}

const easeInCubic = (t: number) => t * t * t
const easeOutCubic = (t: number) => 1 + (--t) * t * t
function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 + (--t) * 4 * t * t
}

const easeInQuart = (t: number) => t * t * t * t
const easeOutQuart = (t: number) => 1 - (--t) * t * t * t
function easeInOutQuart(t: number) {
  return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t
}

const easeInQuint = (t: number) => t * t * t * t * t
const easeOutQuint = (t: number) => 1 + (--t) * t * t * t * t
function easeInOutQuint(t: number) {
  return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t
}

const easeInSine = (t: number) => 1 - Math.cos((t * Math.PI) / 2)
const easeOutSine = (t: number) => Math.sin((t * Math.PI) / 2)
const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2

const easeInExpo = (t: number) => (t === 0 ? 0 : 2 ** (10 * (t - 1)))
const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - 2 ** (-10 * t))
function easeInOutExpo(t: number) {
  if (t === 0 || t === 1)
    return t
  return t < 0.5
    ? 2 ** (20 * t - 10) / 2
    : (2 - 2 ** (-20 * t + 10)) / 2
}

const easeInCirc = (t: number) => 1 - Math.sqrt(1 - t * t)
const easeOutCirc = (t: number) => Math.sqrt(1 - (--t) * t)
function easeInOutCirc(t: number) {
  return t < 0.5
    ? (1 - Math.sqrt(1 - 4 * t * t)) / 2
    : (Math.sqrt(1 - 4 * (--t) * t) + 1) / 2
}

export const easingFunctions = {
  linear,
  ease,
  easeIn,
  easeOut,
  easeInOut,
  easeInCubic,
  easeOutCubic,
  easeInOutCubic,
  easeInQuart,
  easeOutQuart,
  easeInOutQuart,
  easeInQuint,
  easeOutQuint,
  easeInOutQuint,
  easeInSine,
  easeOutSine,
  easeInOutSine,
  easeInExpo,
  easeOutExpo,
  easeInOutExpo,
  easeInCirc,
  easeOutCirc,
  easeInOutCirc,
}

export function cubicBezier(x1: number, y1: number, x2: number, y2: number) {
  // Helper to compute bezier values
  const bezier = (t: number, p0: number, p1: number, p2: number, p3: number) =>
    (1 - t) ** 3 * p0
    + 3 * (1 - t) ** 2 * t * p1
    + 3 * (1 - t) * t ** 2 * p2
    + t ** 3 * p3

  // Newton's method to find the value of t for a given x
  const findTForX = (x: number) => {
    let t = x // Initial guess
    for (let i = 0; i < 5; i++) { // Iterating to improve the guess
      const xEstimate = bezier(t, 0, x1, x2, 1)
      const dx = (3 * (1 - t) ** 2 * (x1 - 0))
        + (6 * (1 - t) * t * (x2 - x1))
        + (3 * t ** 2 * (1 - x2))
      t -= (xEstimate - x) / dx
    }
    return t
  }

  return (t: number) => {
    const adjustedT = findTForX(t)
    return bezier(adjustedT, 0, y1, y2, 1) // Calculate y for the corrected t
  }
}
