# Getting Started

## Installation

```bash
npm install -D unocss-preset-gradient-fn
```

Add the preset to your UnoCSS configuration.

```ts
import { defineConfig } from 'unocss'
import { presetGradientFn } from 'unocss-preset-gradient-fn'

export default defineConfig({
  presets: [
    presetGradientFn(),
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
<div class="bg-gradient-fn-from-blue-500 bg-gradient-fn-to-l bg-gradient-fn-to-green-400 bg-gradient-fn-ease-in-out" />
```

> Please be aware, this preset has not been tested throughfully. If you find any issue or your need a specfic feature, feel free to open an issue!

## Learn more

- [FAQ](./faq)
- [List of utilities](./utilities)
