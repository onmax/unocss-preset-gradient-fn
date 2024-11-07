# UnoCSS Easing Gradient Preset

This is a custom preset for UnoCSS that allows you to create CSS gradients with easing functions. This preset provides utility classes to define gradients with custom easing and shape options. Gradients can be linear, radial or conic and support custom colour stops based on easing functions or Bézier curves.

## Features

- Easing-based colour stops: Create smooth gradient transitions based on easing functions.
- Customisable stops: Specify gradient colours, shapes and number of steps.
- Supports linear, radial and tapered gradients.
- Easy configuration: Control colours, shapes, directions, and smoothing functions directly in CSS classes.

## Installation

```bash
npm install -D unocss-preset-easing-gradient
```

Add the preset to your UnoCSS configuration.

```ts
import { defineConfig } from 'unocss'
import { presetEasingGradient } from 'unocss-preset-easing-gradient'

export default defineConfig({
  presets: [
    presetEasingGradient(),
    // other presets
  ],
})
```

## Usage

### Basic Gradient

To create a gradient with easing, follow these steps:

1. Set the starting color with `bg-gradient-fn-from-$color`.
2. Set the ending color with `bg-gradient-fn-to-$color`.
3. Choose an easing function by name, like `bg-gradient-fn-ease-in-out`.

```html
<div class="bg-gradient-fn-from-blue-500 bg-gradient-fn-to-l bg-gradient-fn-to-green-400 bg-gradient-fn-ease-in-out">
  <!-- Your content here -->
</div>
```

### Customizing Gradient Shape

Define the direction or shape of the gradient using `bg-gradient-fn-to-{direction}` or `bg-gradient-fn-shape-{shape}`.

- Directions: `t` (top), `r` (right), `b` (bottom), `l` (left)
- Shape: Use `linear`, `radial`, or `conic` shapes

```html
<div class="bg-gradient-fn-from-pink-400 bg-gradient-fn-to-yellow-500 bg-gradient-fn-to-tr">
  <!-- Content -->
</div>
```

### Custom Bézier Curve

For advanced customization, define custom Bézier curves:

```html
<div class="bg-gradient-fn-from-red-400 bg-gradient-fn-to-blue-500 bg-gradient-fn-bezier-[0.42,0,0.58,1]">
  <!-- Content -->
</div>
```

## Steps Control

Set the number of steps in the gradient with bg-gradient-fn-steps-{number}. Default is 8.

### Example

```html
<div class="bg-gradient-fn-from-indigo-400 bg-gradient-fn-to-purple-500 bg-gradient-fn-steps-12">
  <!-- Content -->
</div>
```

## Available Easing Functions

This preset supports common easing functions, including:

- `ease`
- `ease-in`
- `ease-out`
- `ease-in-out`
- Full list at [`easing.ts`](./src/easing.ts)

## Notes

Ensure from and to colors are set before applying easing or Bézier functions.

Step count affects the smoothness of the gradient; higher values yield smoother gradients.
