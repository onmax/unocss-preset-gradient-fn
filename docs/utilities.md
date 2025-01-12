# Utilities

## `bg-gradient-fn-to-{direction}`

Defines where the gradient is heading. Possible values are: `b` (bottom), `l`(left), `r`(right), `t`(top), or `bl`, `br`, `tr`, `tl`.

## `bg-gradient-fn-{from,to}-{color}`

Defines the `from`/`to` color of the gradient. You can use variants as `hover:bg-gradient-fn-from-{color}` and it will transition smoothly. To control the transition use `transition-colors` and `duration-300` as any other transitions.

## `bg-gradient-fn-{easing-function}`

This preset supports common easing functions, including: `ease`, `ease-in`, `ease-out`, `ease-in-out`. Full list at [`easing.ts`](https://github.com/onmax/unocss-preset-gradient-fn/blob/main/src/easing.ts)

## `bg-gradient-fn-bezier-[x1,y1,x2,y2]`

You can pass your own easing function with the handles position as parameters. The values must be in the range of `[0,1]`.

## Steps

For both `bg-gradient-fn-{easing-function}` and `bg-gradient-fn-bezier-[x1,y1,x2,y2]`, you can control the amount of steps in the gradients. By default is 4. You can change the number of steps as it was opacity value: `bg-gradient-fn-{easing-function}/{steps}`

## `bg-gradient-fn-length-{value}`

> Alert: This is not implemented. PR welcome!

The lenght of the gradient. By default 100%. It can also be a `[calc()]` value or any distance value (120px, 1rem...).

## `bg-gradient-fn-offset-{value}`

> Alert: This is not implemented. PR welcome!

Where the gradient should start. By default 0. It can also be a `[calc()]` value or any distance value (120px, 1rem...).

## `bg-gradient-fn-color-space-{color-space}`

Which color space to use. By default `oklch`. You can use any of: `srgb`, `srgb-linear`, `display-p3`, `oklch`, `a98-rgb`, `prophoto-rgb`, `rec2020`, `xyz`

## Attributify

All the utilities support the `Attributy` preset as follows:

```html
<div bg-gradient-fn="ease-out from-indigo-400 to-purple-500" />
```
