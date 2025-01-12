# FAQ

## What is this plugin?

This plugin adds extra gradient features to UnoCSS. It allows you to use shapes beyond simple linear layouts (like radial or conic) and apply various easing methods to color transitions. It also defines custom properties that let browsers animate color variables smoothly.

This plugin is experimental and things might break. Feel free to create issues or PR to improve the current implementation :).

## Easing function

UnoCSS comes with a simple, yet powerful to create gradients:

```html
<div class="bg-gradient-to-b bg-gradient-from-rose-400 bg-gradient-to-red-800" />
```

This API works great and it will convert to a linear-gradient function. The browser will automatically create a linear gradient between the intial position and final position interpolating the color accordingly.

But you can only use a linear gradient, you cannot use other function. That's why this plugin exists.

You can use for example `bg-gradient-fn-ease-out`, and automatically it will generate a linear gradient with 4 steps. In each of the steps, it will interpolate the color it should use leveraging `color-mix` function.

> Important: Support for `color-mix` is limited in older browsers.

## Transitioning Colors

Normally, you cannot animate `background-image`. But thanks to `@property`, the browser knows to treat our custom variables as real colors. That means when you change those variables, the browser can transition them smoothly.

> Important: Support for @property is limited in some browsers.
