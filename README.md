# UnoCSS Easing Gradient Preset

T
his is a custom preset for UnoCSS that allows you to create CSS gradients with easing functions. This preset provides utility classes to define gradients with custom easing and shape options. Gradients can be linear, radial or conic and support custom colour stops based on easing functions or Bézier curves.

## Features

- Easing-based colour stops: Create smooth gradient transitions based on easing functions.
- Customisable stops: Specify gradient colours, shapes and number of steps.
- Supports linear, radial and tapered gradients.
- Easy configuration: Control colours, shapes, directions, and smoothing functions directly in CSS classes.

## Installation

```bash
npm install unocss-preset-easing-gradient
```

Add the preset to your UnoCSS configuration.

```ts
import { presetEasingGradient } from 'path-to-your-preset'
import { defineConfig } from 'unocss'

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

1. Set the starting color with bg-easing-gradient-from-$color.
2. Set the ending color with bg-easing-gradient-to-$color.
3. Choose an easing function by name, like bg-easing-gradient-ease-in-out.

```html
<div class="bg-easing-gradient-from-blue-500 bg-easing-gradient-to-green-400 bg-easing-gradient-ease-in-out">
  <!-- Your content here -->
</div>
```

### Customizing Gradient Shape

Define the direction or shape of the gradient using bg-easing-gradient-to-{direction} or bg-easing-gradient-shape-{shape}.

- Directions: `t` (top), `r` (right), `b` (bottom), `l` (left)
- Shape: Use `linear`, `radial`, or `conic` shapes

```html
<div class="bg-easing-gradient-from-pink-400 bg-easing-gradient-to-yellow-500 bg-easing-gradient-to-tr">
  <!-- Content -->
</div>
```

### Custom Bézier Curve

For advanced customization, define custom Bézier curves:

```html
<div class="bg-easing-gradient-from-red-400 bg-easing-gradient-to-blue-500 bg-easing-gradient-bezier-[0.42,0,0.58,1]">
  <!-- Content -->
</div>
```

## Steps Control

Set the number of steps in the gradient with bg-easing-gradient-steps-{number}. Default is 8.

### Example

```html
<div class="bg-easing-gradient-from-indigo-400 bg-easing-gradient-to-purple-500 bg-easing-gradient-steps-12">
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
